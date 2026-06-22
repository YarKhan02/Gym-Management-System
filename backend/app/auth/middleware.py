import functools
import logging
from typing import Optional

from flask import request, jsonify, g
from jwt import decode as jwt_decode, PyJWKClient
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from app.utils.config import settings

logger = logging.getLogger(__name__)

AUTH_SERVER_URL = settings.AUTH_SERVER_URL   # auth server
APP_CLIENT_ID   = settings.APP_CLIENT_ID   # registered in auth server
JWT_ISSUER      = settings.JWT_ISSUER

# PyJWKClient handles JWKS fetching + caching + key rotation automatically
# It fetches once, caches, and auto-rotates when it sees an unknown kid header
_jwks_client = PyJWKClient(
    f"{AUTH_SERVER_URL}/.well-known/jwks.json",
    cache_keys=True,
    lifespan=3600      # re-fetch public keys every hour
)


def _extract_token() -> Optional[str]:
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header.split(" ", 1)[1]
    return None


def verify_token(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = _extract_token()
        if not token:
            return jsonify({"error": "missing authorization header"}), 401

        try:
            signing_key = _jwks_client.get_signing_key_from_jwt(token)

            payload = jwt_decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=JWT_ISSUER,
                options={"verify_exp": True},
            )

            app_claims = payload.get("client_id")
            if not app_claims or app_claims != APP_CLIENT_ID:
                return jsonify({"error": "invalid token"}), 401

            user = {
                "id":           payload["sub"],
                "email":        payload["email"],
                "global_roles": payload.get("global_roles", []),
                "app_roles":    payload.get("apps", {}).get(APP_CLIENT_ID, []),
                "jti":          payload.get("jti"),
            }

            g.user = user

        except ExpiredSignatureError:
            return jsonify({"error": "token expired"}), 401
        except InvalidTokenError as e:
            logger.warning("Invalid JWT: %s", e)
            return jsonify({"error": "invalid token"}), 401
        except Exception as e:
            logger.error("Auth middleware error: %s", e)
            return jsonify({"error": "authentication unavailable"}), 503

        return f(*args, user, **kwargs)
    return decorated


def require_role(*roles):
    def decorator(f):
        @functools.wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(g, "user", None)
            if not user:
                return jsonify({"error": "unauthorized"}), 401

            # super_admin bypasses every role check
            if "super_admin" in user["global_roles"]:
                return f(*args, **kwargs)

            # Check global roles
            for role in roles:
                if role in user["global_roles"]:
                    return f(*args, **kwargs)

            # Check app-level roles (scoped to this app only)
            for role in roles:
                if role in user["app_roles"]:
                    return f(*args, **kwargs)

            return jsonify({
                "error": "forbidden",
                "required": list(roles),
            }), 403
        return decorated
    return decorator


def current_user() -> Optional[dict]:
    return getattr(g, "user", None)