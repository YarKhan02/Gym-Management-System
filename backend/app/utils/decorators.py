from functools import wraps

from app.database.database import get_db

def with_db_session(f):
    """Decorator to handle database session management"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        db = next(get_db())
        try:
            return f(db, *args, **kwargs)
        finally:
            db.close()
    return decorated_function