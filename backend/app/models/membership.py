import uuid
from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.dialects.postgresql import UUID

from app.database.database import Base


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    name = Column(String, nullable=False)
    duration_days = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
