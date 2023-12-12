from pydantic import BaseSettings, AnyHttpUrl
from decouple import config
from typing import List


class Settings(BaseSettings):
    """
    Main settings for FastAPI backend application
    """
    # General
    PROJECT_NAME: str = "mlops"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "*",
    ]

    # Database (mongoDB)
    MONGODB_URL: str = config("MONGODB_URL", cast=str)
    MONGODB_DB_NAME: str = config("MONGODB_DB_NAME", cast=str)
    TESTING: bool = config("TESTING", cast=bool, default=False)
    MONGODB_TEST_DB_NAME = config("MONGODB_TEST_DB_NAME", cast=str)

    class Config:
        case_sensitive = True


settings = Settings()
