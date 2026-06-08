from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.models.member import Member


class MemberRepository:
    def create(self, db: Session, user_id: str, member_data: dict) -> Member:
        member = Member(user_id=user_id, **member_data)
        db.add(member)
        db.commit()
        db.refresh(member)
        return member

    def get_by_id(self, db: Session, user_id: str, member_id: UUID) -> Optional[Member]:
        return db.query(Member).filter(Member.id == member_id, Member.user_id == user_id).first()

    def get_all(self, db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[Member]:
        return db.query(Member).filter(Member.user_id == user_id).offset(skip).limit(limit).all()

    def update(self, db: Session, user_id: str, member_id: UUID, member_data: dict) -> Optional[Member]:
        member = self.get_by_id(db, user_id, member_id)
        if member:
            for key, value in member_data.items():
                if value is not None:
                    setattr(member, key, value)
            db.commit()
            db.refresh(member)
        return member

    def delete(self, db: Session, user_id: str, member_id: UUID) -> bool:
        member = self.get_by_id(db, user_id, member_id)
        if member:
            db.delete(member)
            db.commit()
            return True
        return False

    def get_by_ids(self, db: Session, user_id: str, member_ids: List[UUID]) -> List[Member]:
        return db.query(Member).filter(Member.user_id == user_id, Member.id.in_(member_ids)).all()
