from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from uuid import UUID


class ExpiringSubscriptionItem(BaseModel):
    subscription_id: UUID
    member_id: UUID
    member_name: str
    membership_id: UUID
    membership_name: str
    end_date: date
    days_until_expiry: int

    class Config:
        from_attributes = True


class RecentPaymentItem(BaseModel):
    payment_id: UUID
    member_id: UUID
    member_name: str
    amount: float
    payment_date: date
    method: str

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_members: int
    active_members: int
    expired_members: int
    month_revenue: float


class DashboardResponse(BaseModel):
    stats: DashboardStats
    expiring_subscriptions: List[ExpiringSubscriptionItem]
    recent_payments: List[RecentPaymentItem]
