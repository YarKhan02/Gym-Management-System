from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from uuid import UUID


class MemberCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    join_date: date


class MemberUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None


class MemberResponse(BaseModel):
    id: UUID
    full_name: str
    phone: Optional[str]
    gender: Optional[str]
    address: Optional[str]
    join_date: date
    is_active: bool

    class Config:
        from_attributes = True
