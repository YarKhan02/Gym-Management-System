from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    AUTH_SERVER_URL: str
    JWT_ISSUER: str
    APP_CLIENT_ID: str

settings = Settings()    