from app.config.config import settings
from app.models.project import Project

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient


async def init_mongo_db():
    """
    Initialize mongoDB database connection using beanie ODM
    """
    db_client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_name = settings.MONGODB_TEST_DB_NAME if settings.TESTING else settings.MONGODB_DB_NAME

    await init_beanie(
        database=db_client[db_name],
        document_models=[
            Project
        ]
    )


async def drop_database():
    """
    Drop the database

    Returns:
        None
    """
    client = MongoClient(settings.MONGODB_URL)
    db_name = settings.MONGODB_TEST_DB_NAME if settings.TESTING else settings.MONGODB_DB_NAME
    client.drop_database(db_name)
