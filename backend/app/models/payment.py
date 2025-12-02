import uuid
from sqlalchemy import Column, Float, Date, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.database.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    member_id = Column(UUID(as_uuid=True), ForeignKey("members.id"), nullable=False)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("member_subscriptions.id"), nullable=True)
    amount = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=False)
    method = Column(String, nullable=False)  # cash, card, online
