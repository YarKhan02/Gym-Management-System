from flask import Blueprint, request, jsonify
from uuid import UUID

from app.utils import with_db_session, SUBSCRIPTION_NOT_FOUND
from app.services.subscription_service import MemberSubscriptionService
from app.schemas.subscription import MemberSubscriptionCreate, MemberSubscriptionResponse
from app.auth.middleware import verify_token

subscription_router = Blueprint("subscriptions", __name__, url_prefix="/api/subscriptions")
subscription_service = MemberSubscriptionService()


@subscription_router.route("", methods=["POST"])
@with_db_session
@verify_token
def create_subscription(db, user):
    subscription_data = MemberSubscriptionCreate(**request.json)
    subscription = subscription_service.create_subscription(db, user["id"], subscription_data)
    if not subscription:
        return jsonify({"error": "Active subscription already exists for this member"}), 400
    return jsonify(MemberSubscriptionResponse.model_validate(subscription).model_dump(mode="json")), 201


@subscription_router.route("/<subscription_id>", methods=["GET"])
@with_db_session
@verify_token
def get_subscription(db, user, subscription_id):
    subscription = subscription_service.get_subscription(db, user["id"], UUID(subscription_id))
    if not subscription:
        return jsonify({"error": SUBSCRIPTION_NOT_FOUND}), 404
    return jsonify(MemberSubscriptionResponse.model_validate(subscription).model_dump(mode="json")), 200


@subscription_router.route("/member/<member_id>", methods=["GET"])
@with_db_session
@verify_token
def get_member_subscriptions(db, user, member_id):
    unpaid_only = request.args.get("unpaid", "false").lower() in {"true", "1", "yes"}
    subscriptions = subscription_service.get_member_subscriptions(
        db,
        user["id"],
        UUID(member_id),
        unpaid_only=unpaid_only,
        include_membership_name=unpaid_only,
    )
    return jsonify([MemberSubscriptionResponse.model_validate(s).model_dump(mode="json") for s in subscriptions]), 200


@subscription_router.route("", methods=["GET"])
@with_db_session
@verify_token
def get_all_subscriptions(db, user):
    skip = request.args.get("skip", 0, type=int)
    limit = request.args.get("limit", 100, type=int)
    subscriptions = subscription_service.get_all_subscriptions(db, user["id"], skip, limit)
    return jsonify([MemberSubscriptionResponse.model_validate(s).model_dump(mode="json") for s in subscriptions]), 200


@subscription_router.route("/<subscription_id>", methods=["PUT"])
@with_db_session
@verify_token
def update_subscription(db, user, subscription_id):
    subscription = subscription_service.update_subscription(db, user["id"], UUID(subscription_id), request.json)
    if not subscription:
        return jsonify({"error": SUBSCRIPTION_NOT_FOUND}), 404
    return jsonify(MemberSubscriptionResponse.model_validate(subscription).model_dump(mode="json")), 200
    

@subscription_router.route("/<subscription_id>", methods=["DELETE"])
@with_db_session
@verify_token
def delete_subscription(db, user, subscription_id):
    success = subscription_service.delete_subscription(db, user["id"], UUID(subscription_id))
    if not success:
        return jsonify({"error": SUBSCRIPTION_NOT_FOUND}), 404
    return jsonify({"message": "Subscription deleted successfully"}), 200
