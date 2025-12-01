from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class MembershipCreate(BaseModel):
    name: str
    duration_days: int
    price: float


class MembershipUpdate(BaseModel):
    name: Optional[str] = None
    duration_days: Optional[int] = None
    price: Optional[float] = None


class MembershipResponse(BaseModel):
    id: UUID
    name: str
    duration_days: int
    price: float

    class Config:
        from_attributes = True
