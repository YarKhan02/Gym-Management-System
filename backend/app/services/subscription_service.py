from sqlalchemy.orm import Session
from uuid import UUID

from app.repositories import MemberSubscriptionRepository, PaymentRepository, MembershipRepository
from app.schemas.subscription import MemberSubscriptionCreate


class MemberSubscriptionService:
    def __init__(self):
        self.repository = MemberSubscriptionRepository()
        self.payment_repository = PaymentRepository()
        self.membership_repository = MembershipRepository()

    def create_subscription(self, db: Session, subscription: MemberSubscriptionCreate):
        subscription_data = subscription.model_dump()
        is_active_subscription = self.repository.get_active_subscriptions(db, subscription_data['member_id'])
        if is_active_subscription:
            return None
        return self.repository.create(db, subscription_data)

    def get_subscription(self, db: Session, subscription_id: UUID):
        return self.repository.get_by_id(db, subscription_id)

    def get_member_subscriptions(
        self,
        db: Session,
        member_id: UUID,
        unpaid_only: bool = False,
        include_membership_name: bool = False,
    ):
        subscriptions = self.repository.get_by_member_id(db, member_id)

        if unpaid_only:
            payments = self.payment_repository.get_by_member_id(db, member_id)
            paid_subscription_ids = {payment.subscription_id for payment in payments if payment.subscription_id}
            subscriptions = [subscription for subscription in subscriptions if subscription.id not in paid_subscription_ids]

        if include_membership_name:
            membership_ids = list({subscription.membership_id for subscription in subscriptions})
            memberships = self.membership_repository.get_by_ids(db, membership_ids) if membership_ids else []
            membership_name_by_id = {membership.id: membership.name for membership in memberships}
            return [
                {
                    "id": subscription.id,
                    "member_id": subscription.member_id,
                    "membership_id": subscription.membership_id,
                    "membership_name": membership_name_by_id.get(subscription.membership_id),
                    "start_date": subscription.start_date,
                    "end_date": subscription.end_date,
                    "status": subscription.status,
                }
                for subscription in subscriptions
            ]

        return subscriptions

    def get_all_subscriptions(self, db: Session, skip: int = 0, limit: int = 100):
        all_subscriptions = self.repository.get_all(db, skip, limit)
        
        member_subscriptions = {}
        for sub in all_subscriptions:
            if sub.member_id not in member_subscriptions:
                member_subscriptions[sub.member_id] = []
            member_subscriptions[sub.member_id].append(sub)
        
        filtered_subscriptions = []
        for member_id, subs in member_subscriptions.items():
            active_subs = [s for s in subs if s.status == 'active']
            
            if active_subs:
                filtered_subscriptions.extend(active_subs)
            else:
                expired_subs = [s for s in subs if s.status == 'expired']
                if expired_subs:
                    latest_expired = max(expired_subs, key=lambda x: x.end_date)
                    filtered_subscriptions.append(latest_expired)
        
        return filtered_subscriptions

    def update_subscription(self, db: Session, subscription_id: UUID, subscription_data: dict):
        return self.repository.update(db, subscription_id, subscription_data)

    def delete_subscription(self, db: Session, subscription_id: UUID):
        return self.repository.delete(db, subscription_id)
