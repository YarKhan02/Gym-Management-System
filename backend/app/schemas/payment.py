from pydantic import BaseModel
from datetime import date
from uuid import UUID
from typing import Optional


class PaymentCreate(BaseModel):
    member_id: UUID
    subscription_id: Optional[UUID] = None
    amount: float
    payment_date: date
    method: str


class PaymentResponse(BaseModel):
    id: UUID
    member_id: UUID
    subscription_id: Optional[UUID] = None
    amount: float
    payment_date: date
    method: str

    class Config:
        from_attributes = True
