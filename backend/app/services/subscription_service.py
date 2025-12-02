from sqlalchemy.orm import Session
from uuid import UUID

from app.repositories.subscription_repository import MemberSubscriptionRepository
from app.schemas.subscription import MemberSubscriptionCreate


class MemberSubscriptionService:
    def __init__(self):
        self.repository = MemberSubscriptionRepository()

    def create_subscription(self, db: Session, subscription: MemberSubscriptionCreate):
        subscription_data = subscription.model_dump()
        return self.repository.create(db, subscription_data)

    def get_subscription(self, db: Session, subscription_id: UUID):
        return self.repository.get_by_id(db, subscription_id)

    def get_member_subscriptions(self, db: Session, member_id: UUID):
        return self.repository.get_by_member_id(db, member_id)

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
