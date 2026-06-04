from flask import Flask
from flask_cors import CORS

from app.database.database import Base, engine
from app.routers.member_router import member_router
from app.routers.membership_router import membership_router
from app.routers.subscription_router import subscription_router
from app.routers.payment_router import payment_router
from app.routers.dashboard_router import dashboard_router


def create_app():
    app = Flask(__name__)
    
    CORS(app, 
         origins=["http://localhost:4567"],
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # Create database tables
    Base.metadata.create_all(bind=engine)

    # Register blueprints
    app.register_blueprint(member_router)
    app.register_blueprint(membership_router)
    app.register_blueprint(subscription_router)
    app.register_blueprint(payment_router)
    app.register_blueprint(dashboard_router)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=8000)
