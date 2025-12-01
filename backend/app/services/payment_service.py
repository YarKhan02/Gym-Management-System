from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date, timedelta

from app.repositories.payment_repository import PaymentRepository
from app.repositories.member_subscription_repository import MemberSubscriptionRepository
from app.repositories.member_repository import MemberRepository
from app.repositories.membership_repository import MembershipRepository
from app.schemas.payment import PaymentCreate


class PaymentService:
    def __init__(self):
        self.repository = PaymentRepository()
        self.subscription_repository = MemberSubscriptionRepository()
        self.member_repository = MemberRepository()
        self.membership_repository = MembershipRepository()

    def create_payment(self, db: Session, payment: PaymentCreate):
        payment_data = payment.model_dump()
        return self.repository.create(db, payment_data)

    def get_payment(self, db: Session, payment_id: UUID):
        return self.repository.get_by_id(db, payment_id)

    def get_member_payments(self, db: Session, member_id: UUID):
        return self.repository.get_by_member_id(db, member_id)

    def get_all_payments(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_all(db, skip, limit)

    def get_due_payments(self, db: Session):
        # Get all expired subscriptions
        expired_subscriptions = self.subscription_repository.get_expired_subscriptions(db)
        
        due_payments = []
        
        for subscription in expired_subscriptions:
            # Get member
            member = self.member_repository.get_by_id(db, subscription.member_id)
            if not member:
                continue
                
            # Get membership
            membership = self.membership_repository.get_by_id(db, subscription.membership_id)
            if not membership:
                continue
            
            # Check if payment exists for this subscription period
            # Look for payments made within 7 days before or after subscription end_date
            payment_window_start = subscription.end_date - timedelta(days=7)
            payment_window_end = subscription.end_date + timedelta(days=30)  # Grace period
            min_amount = membership.price * 0.9  # Allow 10% variance
            
            payment_exists = self.repository.get_payments_by_member_and_date_range(
                db, subscription.member_id, payment_window_start, payment_window_end, min_amount
            )
            
            if not payment_exists:
                # Calculate days overdue
                days_overdue = (date.today() - subscription.end_date).days
                
                due_payments.append({
                    'subscription_id': str(subscription.id),
                    'member_id': str(member.id),
                    'member_name': member.full_name,
                    'member_phone': member.phone,
                    'membership_id': str(membership.id),
                    'membership_name': membership.name,
                    'membership_price': membership.price,
                    'end_date': subscription.end_date.isoformat(),
                    'days_overdue': days_overdue,
                })
        
        # Business logic: Sort by days overdue (descending)
        due_payments.sort(key=lambda x: x['days_overdue'], reverse=True)
        
        return due_payments
