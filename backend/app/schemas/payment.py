from pydantic import BaseModel
from datetime import date
from uuid import UUID


class PaymentCreate(BaseModel):
    member_id: UUID
    amount: float
    payment_date: date
    method: str


class PaymentResponse(BaseModel):
    id: UUID
    member_id: UUID
    amount: float
    payment_date: date
    method: str

    class Config:
        from_attributes = True
