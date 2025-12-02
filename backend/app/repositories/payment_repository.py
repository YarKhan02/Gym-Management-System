from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date

from app.models.payment import Payment


class PaymentRepository:
    def create(self, db: Session, payment_data: dict) -> Payment:
        payment = Payment(**payment_data)
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment

    def get_by_id(self, db: Session, payment_id: UUID) -> Optional[Payment]:
        return db.query(Payment).filter(Payment.id == payment_id).first()

    def get_by_member_id(self, db: Session, member_id: UUID) -> List[Payment]:
        return db.query(Payment).filter(Payment.member_id == member_id).all()

    def get_by_subscription_id(self, db: Session, subscription_id: UUID) -> List[Payment]:
        return db.query(Payment).filter(Payment.subscription_id == subscription_id).all()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Payment]:
        return db.query(Payment).offset(skip).limit(limit).all()

    def get_payments_by_member_and_date_range(
        self, db: Session, member_id: UUID, start_date: date, end_date: date, min_amount: float
    ) -> Optional[Payment]:
        return db.query(Payment).filter(
            Payment.member_id == member_id,
            Payment.payment_date >= start_date,
            Payment.payment_date <= end_date,
            Payment.amount >= min_amount
        ).first()
