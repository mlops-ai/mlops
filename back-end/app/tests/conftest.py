import pytest
from asgi_lifespan import LifespanManager
from httpx import AsyncClient

from app.app import app
from app.config.config import settings


@pytest.fixture
async def client():
    """
    Create an instance of the client for testing.

    Returns:
        AsyncClient: An instance of the client for testing.
    """
    if not settings.TESTING:
        raise RuntimeError("Wrong .env TESTING value.")

    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            try:
                yield ac
            except Exception as exc:
                print(exc)
