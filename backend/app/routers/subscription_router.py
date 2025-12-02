from flask import Blueprint, request, jsonify
from uuid import UUID

from app.database.database import get_db
from app.services.subscription_service import MemberSubscriptionService
from app.schemas.subscription import MemberSubscriptionCreate, MemberSubscriptionResponse

subscription_router = Blueprint("subscriptions", __name__, url_prefix="/api/subscriptions")
subscription_service = MemberSubscriptionService()


@subscription_router.route("", methods=["POST"])
def create_subscription():
    db = next(get_db())
    try:
        subscription_data = MemberSubscriptionCreate(**request.json)
        subscription = subscription_service.create_subscription(db, subscription_data)
        return jsonify(MemberSubscriptionResponse.model_validate(subscription).model_dump(mode="json")), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@subscription_router.route("/<subscription_id>", methods=["GET"])
def get_subscription(subscription_id):
    db = next(get_db())
    try:
        subscription = subscription_service.get_subscription(db, UUID(subscription_id))
        if not subscription:
            return jsonify({"error": "Subscription not found"}), 404
        return jsonify(MemberSubscriptionResponse.model_validate(subscription).model_dump(mode="json")), 200
    finally:
        db.close()


@subscription_router.route("/member/<member_id>", methods=["GET"])
def get_member_subscriptions(member_id):
    db = next(get_db())
    try:
        subscriptions = subscription_service.get_member_subscriptions(db, UUID(member_id))
        return jsonify([MemberSubscriptionResponse.model_validate(s).model_dump(mode="json") for s in subscriptions]), 200
    finally:
        db.close()


@subscription_router.route("", methods=["GET"])
def get_all_subscriptions():
    db = next(get_db())
    try:
        skip = request.args.get("skip", 0, type=int)
        limit = request.args.get("limit", 100, type=int)
        subscriptions = subscription_service.get_all_subscriptions(db, skip, limit)
        return jsonify([MemberSubscriptionResponse.model_validate(s).model_dump(mode="json") for s in subscriptions]), 200
    finally:
        db.close()


@subscription_router.route("/<subscription_id>", methods=["PUT"])
def update_subscription(subscription_id):
    db = next(get_db())
    try:
        subscription = subscription_service.update_subscription(db, UUID(subscription_id), request.json)
        if not subscription:
            return jsonify({"error": "Subscription not found"}), 404
        return jsonify(MemberSubscriptionResponse.model_validate(subscription).model_dump(mode="json")), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@subscription_router.route("/<subscription_id>", methods=["DELETE"])
def delete_subscription(subscription_id):
    db = next(get_db())
    try:
        success = subscription_service.delete_subscription(db, UUID(subscription_id))
        if not success:
            return jsonify({"error": "Subscription not found"}), 404
        return jsonify({"message": "Subscription deleted successfully"}), 200
    finally:
        db.close()
