from sqlalchemy.orm import Session
from uuid import UUID

from app.repositories.member_subscription_repository import MemberSubscriptionRepository
from app.schemas.member_subscription import MemberSubscriptionCreate


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
        return self.repository.get_all(db, skip, limit)

    def update_subscription(self, db: Session, subscription_id: UUID, subscription_data: dict):
        return self.repository.update(db, subscription_id, subscription_data)

    def delete_subscription(self, db: Session, subscription_id: UUID):
        return self.repository.delete(db, subscription_id)
