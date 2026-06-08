from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.repositories.membership_repository import MembershipRepository
from app.schemas.membership import MembershipCreate, MembershipUpdate


class MembershipService:
    def __init__(self):
        self.repository = MembershipRepository()

    def create_membership(self, db: Session, user_id, membership: MembershipCreate):
        membership_data = membership.model_dump()
        return self.repository.create(db, user_id, membership_data)

    def get_membership(self, db: Session, user_id, membership_id: UUID):
        return self.repository.get_by_id(db, user_id, membership_id)

    def get_all_memberships(self, db: Session, user_id, skip: int = 0, limit: int = 100):
        return self.repository.get_all(db, user_id, skip, limit)

    def update_membership(self, db: Session, user_id, membership_id: UUID, membership: MembershipUpdate):
        membership_data = membership.model_dump(exclude_unset=True)
        return self.repository.update(db, user_id, membership_id, membership_data)

    def delete_membership(self, db: Session, user_id, membership_id: UUID):
        return self.repository.delete(db, user_id, membership_id)
