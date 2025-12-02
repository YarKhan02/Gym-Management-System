from flask import Blueprint, jsonify

from app.database.database import get_db
from app.services.dashboard_service import DashboardService

dashboard_router = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")
dashboard_service = DashboardService()


@dashboard_router.route("", methods=["GET"])
def get_dashboard():
    db = next(get_db())
    try:
        dashboard_data = dashboard_service.get_dashboard_data(db)
        return jsonify(dashboard_data), 200
    finally:
        db.close()
