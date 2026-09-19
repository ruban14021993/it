from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "InfinityMind Tech API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://infinity_user:infinity_pass@localhost:5432/infinitydb"
    DATABASE_ECHO: bool = False

    # JWT
    SECRET_KEY: str = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_KEY_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours

    # Media / Uploads
    UPLOAD_DIR: str = "../uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    ALLOWED_VIDEO_TYPES: list[str] = ["video/mp4", "video/webm"]

    # Next.js Cache Revalidation
    NEXTJS_REVALIDATE_URL: str = "http://localhost:3000/api/revalidate"
    NEXTJS_REVALIDATE_SECRET: str = "CHANGE_THIS_REVALIDATE_SECRET"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Admin seed
    ADMIN_EMAIL: str = "admin@infinitymindtech.com"
    ADMIN_PASSWORD: str = "ChangeMe123!"
    ADMIN_NAME: str = "Super Admin"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
