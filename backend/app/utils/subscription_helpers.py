from datetime import date
from typing import List
from sqlalchemy.orm import Session

from app.models.member_subscription import MemberSubscription


def update_subscription_status(subscription: MemberSubscription) -> MemberSubscription:
    if subscription.status == 'active' and subscription.end_date < date.today():
        subscription.status = 'expired'
    return subscription


def update_subscriptions_status_bulk(db: Session, subscriptions: List[MemberSubscription]) -> List[MemberSubscription]:
    updated = False
    for subscription in subscriptions:
        if subscription.status == 'active' and subscription.end_date < date.today():
            subscription.status = 'expired'
            updated = True
    
    if updated:
        db.commit()
        for subscription in subscriptions:
            db.refresh(subscription)
    
    return subscriptions


def check_and_update_status(db: Session, subscription: MemberSubscription) -> MemberSubscription:
    if subscription.status == 'active' and subscription.end_date < date.today():
        subscription.status = 'Expired'
        db.commit()
        db.refresh(subscription)
    return subscription
