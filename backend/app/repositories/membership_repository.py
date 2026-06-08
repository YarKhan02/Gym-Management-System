from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.models.membership import Membership


class MembershipRepository:
    def create(self, db: Session, user_id: str, membership_data: dict) -> Membership:
        membership_data["user_id"] = user_id
        membership = Membership(**membership_data)
        db.add(membership)
        db.commit()
        db.refresh(membership)
        return membership

    def get_by_id(self, db: Session, user_id: str, membership_id: UUID) -> Optional[Membership]:
        return db.query(Membership).filter(Membership.id == membership_id, Membership.user_id == user_id).first()

    def get_all(self, db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[Membership]:
        return db.query(Membership).filter(Membership.user_id == user_id).offset(skip).limit(limit).all()

    def update(self, db: Session, user_id: str, membership_id: UUID, membership_data: dict) -> Optional[Membership]:
        membership = self.get_by_id(db, user_id, membership_id)
        if membership:
            for key, value in membership_data.items():
                if value is not None:
                    setattr(membership, key, value)
            db.commit()
            db.refresh(membership)
        return membership

    def delete(self, db: Session, user_id: str, membership_id: UUID) -> bool:
        membership = self.get_by_id(db, user_id, membership_id)
        if membership:
            db.delete(membership)
            db.commit()
            return True
        return False

    def get_by_ids(self, db: Session, user_id: str, membership_ids: List[UUID]) -> List[Membership]:
        return db.query(Membership).filter(Membership.user_id == user_id, Membership.id.in_(membership_ids)).all()
