from flask import Blueprint, request, jsonify
from uuid import UUID

from app.utils import with_db_session
from app.services.payment_service import PaymentService
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.auth.middleware import verify_token

payment_router = Blueprint("payments", __name__, url_prefix="/api/payments")
payment_service = PaymentService()


@payment_router.route("", methods=["POST"])
@with_db_session
@verify_token
def create_payment(db, user):
    payment_data = PaymentCreate(**request.json)
    payment = payment_service.create_payment(db, user["id"], payment_data)
    return jsonify(PaymentResponse.model_validate(payment).model_dump(mode="json")), 201


@payment_router.route("/<payment_id>", methods=["GET"])
@with_db_session
@verify_token
def get_payment(db, user, payment_id):
    payment = payment_service.get_payment(db, user["id"], UUID(payment_id))
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    return jsonify(PaymentResponse.model_validate(payment).model_dump(mode="json")), 200


@payment_router.route("/member/<member_id>", methods=["GET"])
@with_db_session
@verify_token
def get_member_payments(db, user, member_id):
    payments = payment_service.get_member_payments(db, user["id"], UUID(member_id))
    return jsonify([PaymentResponse.model_validate(p).model_dump(mode="json") for p in payments]), 200

@payment_router.route("", methods=["GET"])
@with_db_session
@verify_token
def get_all_payments(db, user):
    skip = request.args.get("skip", 0, type=int)
    limit = request.args.get("limit", 100, type=int)
    payments = payment_service.get_all_payments(db, user["id"], skip, limit)
    return jsonify([PaymentResponse.model_validate(p).model_dump(mode="json") for p in payments]), 200

@payment_router.route("/due", methods=["GET"])
@with_db_session
@verify_token
def get_due_payments(db, user):
    due_payments = payment_service.get_due_payments(db, user["id"])
    return jsonify(due_payments), 200