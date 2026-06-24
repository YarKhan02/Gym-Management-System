from flask import Blueprint, jsonify, request

from app.utils import with_db_session
from app.services.analytics_service import AnalyticsService
from app.auth.middleware import verify_token


analytics_router = Blueprint("analytics", __name__, url_prefix="/api/analytics")
analytics_service = AnalyticsService()


@analytics_router.route("/overview", methods=["GET"])
@with_db_session
@verify_token
def get_overview(db, user):
    data = analytics_service.overview(db, user["id"])
    return jsonify(data), 200


@analytics_router.route("/members/growth", methods=["GET"])
@with_db_session
@verify_token
def get_member_growth(db, user):
    months = int(request.args.get("months", 12))
    data = analytics_service.member_growth(db, user["id"], months)
    return jsonify({"data": data}), 200


@analytics_router.route("/members/demographics", methods=["GET"])
@with_db_session
@verify_token
def get_demographics(db, user):
    data = analytics_service.demographics(db, user["id"])
    return jsonify(data), 200


@analytics_router.route("/revenue/timeline", methods=["GET"])
@with_db_session
@verify_token
def get_revenue_timeline(db, user):
    months = int(request.args.get("months", 12))
    data = analytics_service.revenue_timeline(db, user["id"], months)
    return jsonify({"data": data}), 200


@analytics_router.route("/revenue/payment-methods", methods=["GET"])
@with_db_session
@verify_token
def get_payment_methods(db, user):
    data = analytics_service.payment_methods(db, user["id"])
    return jsonify({"data": data}), 200


@analytics_router.route("/subscriptions/status", methods=["GET"])
@with_db_session
@verify_token
def get_subscription_status(db, user):
    data = analytics_service.subscription_status(db, user["id"])
    return jsonify({"data": data}), 200


@analytics_router.route("/subscriptions/plans", methods=["GET"])
@with_db_session
@verify_token
def get_plans(db, user):
    data = analytics_service.plans(db, user["id"])
    return jsonify({"data": data}), 200


@analytics_router.route("/subscriptions/expiring", methods=["GET"])
@with_db_session
@verify_token
def get_expiring(db, user):
    days = int(request.args.get("days", 30))
    data = analytics_service.expiring(db, user["id"], days)
    return jsonify({"data": data}), 200


@analytics_router.route("/members/top-revenue", methods=["GET"])
@with_db_session
@verify_token
def get_top_members(db, user):
    limit = int(request.args.get("limit", 10))
    data = analytics_service.top_members(db, user["id"], limit)
    return jsonify({"data": data}), 200
