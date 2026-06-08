from flask import Blueprint, request, jsonify
from uuid import UUID

from app.utils import with_db_session, MEMBERSHIP_NOT_FOUND
from app.services.membership_service import MembershipService
from app.schemas.membership import MembershipCreate, MembershipUpdate, MembershipResponse
from app.auth.middleware import verify_token

membership_router = Blueprint("memberships", __name__, url_prefix="/api/memberships")
membership_service = MembershipService()


@membership_router.route("", methods=["POST"])
@with_db_session
@verify_token
def create_membership(db, user):
    membership_data = MembershipCreate(**request.json)
    membership = membership_service.create_membership(db, user["id"], membership_data)
    return jsonify(MembershipResponse.model_validate(membership).model_dump(mode="json")), 201


@membership_router.route("/<membership_id>", methods=["GET"])
@with_db_session
@verify_token
def get_membership(db, user, membership_id):
    membership = membership_service.get_membership(db, user["id"], UUID(membership_id))
    if not membership:
        return jsonify({"error": MEMBERSHIP_NOT_FOUND}), 404
    return jsonify(MembershipResponse.model_validate(membership).model_dump(mode="json")), 200


@membership_router.route("", methods=["GET"])
@with_db_session
@verify_token
def get_all_memberships(db, user):
    skip = request.args.get("skip", 0, type=int)
    limit = request.args.get("limit", 100, type=int)
    memberships = membership_service.get_all_memberships(db, user["id"], skip, limit)
    return jsonify([MembershipResponse.model_validate(m).model_dump(mode="json") for m in memberships]), 200

@membership_router.route("/<membership_id>", methods=["PUT"])
@with_db_session
@verify_token
def update_membership(db, user, membership_id):
    membership_data = MembershipUpdate(**request.json)
    membership = membership_service.update_membership(db, user["id"], UUID(membership_id), membership_data)
    if not membership:
        return jsonify({"error": MEMBERSHIP_NOT_FOUND}), 404
    return jsonify(MembershipResponse.model_validate(membership).model_dump(mode="json")), 200

@membership_router.route("/<membership_id>", methods=["DELETE"])
@with_db_session
@verify_token
def delete_membership(db, user, membership_id):
    success = membership_service.delete_membership(db, user["id"], UUID(membership_id))
    if not success:
        return jsonify({"error": MEMBERSHIP_NOT_FOUND}), 404
    return jsonify({"message": "Membership deleted successfully"}), 200
