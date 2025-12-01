from flask import Blueprint, request, jsonify
from uuid import UUID

from app.database.database import get_db
from app.services.membership_service import MembershipService
from app.schemas.membership import MembershipCreate, MembershipUpdate, MembershipResponse

membership_router = Blueprint("memberships", __name__, url_prefix="/api/memberships")
membership_service = MembershipService()


@membership_router.route("", methods=["POST"])
def create_membership():
    db = next(get_db())
    try:
        membership_data = MembershipCreate(**request.json)
        membership = membership_service.create_membership(db, membership_data)
        return jsonify(MembershipResponse.model_validate(membership).model_dump(mode="json")), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@membership_router.route("/<membership_id>", methods=["GET"])
def get_membership(membership_id):
    db = next(get_db())
    try:
        membership = membership_service.get_membership(db, UUID(membership_id))
        if not membership:
            return jsonify({"error": "Membership not found"}), 404
        return jsonify(MembershipResponse.model_validate(membership).model_dump(mode="json")), 200
    finally:
        db.close()


@membership_router.route("", methods=["GET"])
def get_all_memberships():
    db = next(get_db())
    try:
        skip = request.args.get("skip", 0, type=int)
        limit = request.args.get("limit", 100, type=int)
        memberships = membership_service.get_all_memberships(db, skip, limit)
        return jsonify([MembershipResponse.model_validate(m).model_dump(mode="json") for m in memberships]), 200
    finally:
        db.close()


@membership_router.route("/<membership_id>", methods=["PUT"])
def update_membership(membership_id):
    db = next(get_db())
    try:
        membership_data = MembershipUpdate(**request.json)
        membership = membership_service.update_membership(db, UUID(membership_id), membership_data)
        if not membership:
            return jsonify({"error": "Membership not found"}), 404
        return jsonify(MembershipResponse.model_validate(membership).model_dump(mode="json")), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@membership_router.route("/<membership_id>", methods=["DELETE"])
def delete_membership(membership_id):
    db = next(get_db())
    try:
        success = membership_service.delete_membership(db, UUID(membership_id))
        if not success:
            return jsonify({"error": "Membership not found"}), 404
        return jsonify({"message": "Membership deleted successfully"}), 200
    finally:
        db.close()
