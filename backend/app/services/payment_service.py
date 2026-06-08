from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date, timedelta

from app.repositories.payment_repository import PaymentRepository
from app.repositories.subscription_repository import MemberSubscriptionRepository
from app.repositories.member_repository import MemberRepository
from app.repositories.membership_repository import MembershipRepository
from app.schemas.payment import PaymentCreate


class PaymentService:
    def __init__(self):
        self.repository = PaymentRepository()
        self.subscription_repository = MemberSubscriptionRepository()
        self.member_repository = MemberRepository()
        self.membership_repository = MembershipRepository()

    def create_payment(self, db: Session, user_id, payment: PaymentCreate):
        payment_data = payment.model_dump()
        return self.repository.create(db, user_id, payment_data)

    def get_payment(self, db: Session, user_id, payment_id: UUID):
        return self.repository.get_by_id(db, user_id, payment_id)

    def get_member_payments(self, db: Session, user_id, member_id: UUID):
        return self.repository.get_by_member_id(db, user_id, member_id)

    def get_all_payments(self, db: Session, user_id, skip: int = 0, limit: int = 100):
        return self.repository.get_all(db, user_id, skip, limit)

    def get_due_payments(self, db: Session, user_id):
        expired_subscriptions = self.subscription_repository.get_expired_subscriptions(db, user_id)
        
        due_payments = []
        
        for subscription in expired_subscriptions:
            # Check if payment exists for this subscription using subscription_id link
            payments_for_subscription = self.repository.get_by_subscription_id(db, subscription.id)
            
            if not payments_for_subscription:
                # No payment found for this subscription - it's due
                # Get member
                member = self.member_repository.get_by_id(db, subscription.member_id)
                if not member:
                    continue
                    
                # Get membership
                membership = self.membership_repository.get_by_id(db, subscription.membership_id)
                if not membership:
                    continue
                
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
