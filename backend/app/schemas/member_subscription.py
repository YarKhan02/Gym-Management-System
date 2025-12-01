from pydantic import BaseModel
from datetime import date
from uuid import UUID


class MemberSubscriptionCreate(BaseModel):
    member_id: UUID
    membership_id: UUID
    start_date: date
    end_date: date
    status: str = "active"


class MemberSubscriptionResponse(BaseModel):
    id: UUID
    member_id: UUID
    membership_id: UUID
    start_date: date
    end_date: date
    status: str

    class Config:
        from_attributes = True
