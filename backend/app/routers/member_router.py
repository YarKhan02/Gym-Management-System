from flask import Blueprint, request, jsonify
from uuid import UUID

from app.database.database import get_db
from app.services.member_service import MemberService
from app.schemas.member import MemberCreate, MemberUpdate, MemberResponse

member_router = Blueprint("members", __name__, url_prefix="/api/members")
member_service = MemberService()


@member_router.route("", methods=["POST"])
def create_member():
    db = next(get_db())
    try:
        member_data = MemberCreate(**request.json)
        member = member_service.create_member(db, member_data)
        return jsonify(MemberResponse.model_validate(member).model_dump(mode="json")), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@member_router.route("/<member_id>", methods=["GET"])
def get_member(member_id):
    db = next(get_db())
    try:
        member = member_service.get_member(db, UUID(member_id))
        if not member:
            return jsonify({"error": "Member not found"}), 404
        return jsonify(MemberResponse.model_validate(member).model_dump(mode="json")), 200
    finally:
        db.close()


@member_router.route("", methods=["GET"])
def get_all_members():
    db = next(get_db())
    try:
        skip = request.args.get("skip", 0, type=int)
        limit = request.args.get("limit", 100, type=int)
        members = member_service.get_all_members(db, skip, limit)
        return jsonify([MemberResponse.model_validate(m).model_dump(mode="json") for m in members]), 200
    finally:
        db.close()


@member_router.route("/<member_id>", methods=["PUT"])
def update_member(member_id):
    db = next(get_db())
    try:
        member_data = MemberUpdate(**request.json)
        member = member_service.update_member(db, UUID(member_id), member_data)
        if not member:
            return jsonify({"error": "Member not found"}), 404
        return jsonify(MemberResponse.model_validate(member).model_dump(mode="json")), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@member_router.route("/<member_id>", methods=["DELETE"])
def delete_member(member_id):
    db = next(get_db())
    try:
        success = member_service.delete_member(db, UUID(member_id))
        if not success:
            return jsonify({"error": "Member not found"}), 404
        return jsonify({"message": "Member deleted successfully"}), 200
    finally:
        db.close()
