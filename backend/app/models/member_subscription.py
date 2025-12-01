import uuid
from sqlalchemy import Column, String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.database.database import Base


class MemberSubscription(Base):
    __tablename__ = "member_subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    member_id = Column(UUID(as_uuid=True), ForeignKey("members.id"), nullable=False)
    membership_id = Column(UUID(as_uuid=True), ForeignKey("memberships.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String, nullable=False)  # active, expired, cancelled
