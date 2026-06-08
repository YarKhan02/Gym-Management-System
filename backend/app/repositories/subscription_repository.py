from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.models.member_subscription import MemberSubscription
from app.models.member import Member
from app.utils.subscription_helpers import check_and_update_status, update_subscriptions_status_bulk


class MemberSubscriptionRepository:
    def create(self, db: Session, subscription_data: dict) -> MemberSubscription:
        subscription = MemberSubscription(**subscription_data)
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        return subscription

    def get_by_id(self, db: Session, subscription_id: UUID) -> Optional[MemberSubscription]:
        subscription = db.query(MemberSubscription).filter(MemberSubscription.id == subscription_id).first()
        if subscription:
            subscription = check_and_update_status(db, subscription)
        return subscription

    def get_by_member_id(self, db: Session, member_id: UUID) -> List[MemberSubscription]:
        subscriptions = db.query(MemberSubscription).filter(MemberSubscription.member_id == member_id).all()
        return update_subscriptions_status_bulk(db, subscriptions)

    def get_all(self, db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[MemberSubscription]:
        subscriptions = (
            db.query(MemberSubscription)
            .join(Member, MemberSubscription.member_id == Member.id)
            .filter(Member.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return update_subscriptions_status_bulk(db, subscriptions)

    def update(self, db: Session, subscription_id: UUID, subscription_data: dict) -> Optional[MemberSubscription]:
        subscription = self.get_by_id(db, subscription_id)
        if subscription:
            for key, value in subscription_data.items():
                if value is not None:
                    setattr(subscription, key, value)
            db.commit()
            db.refresh(subscription)
        return subscription

    def delete(self, db: Session, subscription_id: UUID) -> bool:
        subscription = self.get_by_id(db, subscription_id)
        if subscription:
            db.delete(subscription)
            db.commit()
            return True
        return False

    def get_expired_subscriptions(self, db: Session, user_id: str) -> List[MemberSubscription]:
        return (
            db.query(MemberSubscription)
            .join(Member, MemberSubscription.member_id == Member.id)
            .filter(MemberSubscription.status == 'expired', Member.user_id == user_id)
            .all()
        )
    
    def get_active_subscriptions(self, db: Session, member_id: UUID) -> Optional[MemberSubscription]:
        return db.query(MemberSubscription).filter(
            MemberSubscription.status == 'active',
            MemberSubscription.member_id == member_id
        ).first()
