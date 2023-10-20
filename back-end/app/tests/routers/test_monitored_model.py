import pytest
from httpx import AsyncClient

from app.database.init_mongo_db import drop_database


@pytest.mark.asyncio
async def test_empty_get_monitored_models(client: AsyncClient):
    """
    Test get all monitored models when there are no monitored models.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    await drop_database()
    response = await client.get("/monitored-models/")
    assert response.status_code == 200
    assert(len(response.json()) == 0)


@pytest.mark.asyncio
async def test_create_monitored_model(client: AsyncClient):
    """
    Test create monitored model.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    iteration = {
        "iteration_name": "Test iteration",
        "experiment_name": "Test experiment",
        "project_title": "Test project",
        "experiment_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "project_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "user_name": "Test user"
    }

    monitored_model = {
        "model_name": "Test monitored model",
        "model_description": "Test monitored model description",
        "iteration": iteration
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    assert response.status_code == 201
    assert response.json()["model_name"] == monitored_model["model_name"]
    assert response.json()["model_description"] == monitored_model["model_description"]
    assert response.json()["model_status"] == "idle"


@pytest.mark.asyncio
async def test_model_name_unique(client: AsyncClient):
    """
    Test create monitored model with model name that already exists.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    iteration = {
        "iteration_name": "Test iteration",
        "experiment_name": "Test experiment",
        "project_title": "Test project",
        "experiment_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "project_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "user_name": "Test user"
    }

    monitored_model = {
        "model_name": "Test monitored model",
        "model_description": "Test monitored model description",
        "iteration": iteration
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    assert response.status_code == 400
    assert response.json()["detail"] == "Monitored model name already exists."


@pytest.mark.asyncio
async def test_get_monitored_model_by_id(client: AsyncClient):
    """
    Test get monitored model by id.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    iteration = {
        "iteration_name": "Test iteration",
        "experiment_name": "Test experiment",
        "project_title": "Test project",
        "experiment_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "project_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "user_name": "Test user"
    }

    monitored_model = {
        "model_name": "Test monitored model 2",
        "model_description": "Test monitored model description",
        "model_status": "active",
        "iteration": iteration
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_id = response.json()["_id"]
    response = await client.get(f"/monitored-models/id/{monitored_model_id}")
    assert response.status_code == 200
    assert response.json()["model_name"] == monitored_model["model_name"]


@pytest.mark.asyncio
async def test_get_monitored_model_by_name(client: AsyncClient):
    """
    Test get monitored model by name.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    iteration = {
        "iteration_name": "Test iteration",
        "experiment_name": "Test experiment",
        "project_title": "Test project",
        "experiment_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "project_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "user_name": "Test user"
    }

    monitored_model = {
        "model_name": "Test monitored model 3",
        "model_description": "Test monitored model description",
        "model_status": "archived",
        "iteration": iteration
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_name = response.json()["model_name"]
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200
    assert response.json()["model_name"] == monitored_model["model_name"]


@pytest.mark.asyncio
async def test_get_all_monitored_models(client: AsyncClient):
    """
    Test get all monitored models.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    response = await client.get("/monitored-models/")
    assert response.status_code == 200
    assert len(response.json()) == 3


@pytest.mark.asyncio
async def test_get_archived_monitored_models(client: AsyncClient):
    """
    Test get archived monitored models.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    response = await client.get("/monitored-models/archived")
    assert response.status_code == 200
    assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_get_active_monitored_models(client: AsyncClient):
    """
    Test get active monitored models.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    response = await client.get("/monitored-models/active")
    assert response.status_code == 200
    assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_get_idle_monitored_models(client: AsyncClient):
    """
    Test get idle monitored models.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    response = await client.get("/monitored-models/idle")
    assert response.status_code == 200
    assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_get_non_archived_monitored_models(client: AsyncClient):
    """
    Test get non-archived monitored models.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    response = await client.get("/monitored-models/non-archived")
    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_update_monitored_model(client: AsyncClient):
    """
    Test update monitored model.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    iteration = {
        "iteration_name": "Test iteration",
        "experiment_name": "Test experiment",
        "project_title": "Test project",
        "experiment_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "project_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
        "user_name": "Test user"
    }

    monitored_model = {
        "model_name": "Test monitored model 5",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }

    monitored_model_changed = {
        "model_name": "Test monitored model 4 changed",
        "model_description": "Test monitored model description changed",
        "model_status": "active",
        "iteration": iteration
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_id = response.json()["_id"]
    monitored_model["model_name"] = "Test monitored model 5"
    response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed)
    assert response.status_code == 200
    assert response.json()["model_name"] == monitored_model_changed["model_name"]
    assert response.json()["model_status"] == monitored_model_changed["model_status"]
