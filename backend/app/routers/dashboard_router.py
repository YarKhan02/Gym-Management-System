from flask import Blueprint, jsonify

from app.utils import with_db_session
from app.services.dashboard_service import DashboardService
from app.auth.middleware import verify_token

dashboard_router = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")
dashboard_service = DashboardService()


@dashboard_router.route("", methods=["GET"])
@with_db_session
@verify_token
def get_dashboard(db):
    dashboard_data = dashboard_service.get_dashboard_data(db)
    return jsonify(dashboard_data), 200
    