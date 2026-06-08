from sqlalchemy.orm import Session
from uuid import UUID

from app.repositories.member_repository import MemberRepository
from app.schemas.member import MemberCreate, MemberUpdate


class MemberService:
    def __init__(self):
        self.repository = MemberRepository()

    def create_member(self, db: Session, user_id, member: MemberCreate):
        member_data = member.model_dump()
        return self.repository.create(db, user_id, member_data)

    def get_member(self, db: Session, user_id, member_id: UUID):
        return self.repository.get_by_id(db, user_id, member_id)

    def get_all_members(self, db: Session, user_id, skip: int = 0, limit: int = 100):
        return self.repository.get_all(db, user_id, skip, limit)

    def update_member(self, db: Session, user_id, member_id: UUID, member: MemberUpdate):
        member_data = member.model_dump(exclude_unset=True)
        return self.repository.update(db, user_id, member_id, member_data)

    def delete_member(self, db: Session, user_id, member_id: UUID):
        return self.repository.delete(db, user_id, member_id)
