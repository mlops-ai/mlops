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

    project = {
        "title": "Mercedes-Benz Manufacturing Poland",
        "description": "Test project description for Mercedes-Benz Manufacturing Poland"
    }
    response = await client.post("/projects/", json=project)
    project_id = response.json()["_id"]

    experiment = {
        "name": "Engine failure prediction",
        "description": "Test experiment description for Mercedes-Benz Manufacturing Poland"
    }

    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Iteration 1",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model",
        "model_description": "Test monitored model description for Mercedes-Benz Manufacturing Poland",
        "model_status": "active",
        "iteration": iteration_to_model
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    assert response.status_code == 201
    assert response.json()["model_name"] == monitored_model["model_name"]
    assert response.json()["model_description"] == monitored_model["model_description"]
    assert response.json()["model_status"] == "active"


@pytest.mark.asyncio
async def test_model_name_unique(client: AsyncClient):
    """
    Test create monitored model with model name that already exists.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Mercedes-Benz Manufacturing Poland"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Engine failure prediction"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Iteration 1.1",
        "metrics": {"accuracy": 0.8, "precision": 0.7, "recall": 0.9, "f1": 0.75},
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.0001}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model",
        "model_description": "Test monitored model description",
        "model_status": "archived",
        "iteration": iteration_to_model
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
    project_title = "Mercedes-Benz Manufacturing Poland"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Engine failure prediction"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Iteration 2",
        "metrics": {"accuracy": 0.8, "precision": 0.7, "recall": 0.9, "f1": 0.7},
        "parameters": {"batch_size": 32, "epochs": 100, "learning_rate": 0.1}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model v2",
        "model_description": "Test monitored model description",
        "model_status": "archived",
        "iteration": iteration_to_model
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
    project_title = "Mercedes-Benz Manufacturing Poland"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Engine failure prediction"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Iteration 3",
        "metrics": {"accuracy": 0.9, "precision": 0.9, "recall": 0.9, "f1": 0.9},
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model v3",
        "model_description": "Test monitored model description",
        "model_status": "active",
        "iteration": iteration_to_model
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
    assert len(response.json()) == 2


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
    assert len(response.json()) == 0


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
async def test_update_monitored_model_by_adding_iteration(client: AsyncClient):
    """
    Test update monitored model.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Mercedes-Benz Manufacturing Poland"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Engine failure prediction"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Iteration 3",
        "metrics": {"accuracy": 0.9, "precision": 0.9, "recall": 0.9, "f1": 0.9},
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model v4",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }

    monitored_model_changed = {
        "model_name": "Engine failure prediction model v4 changed",
        "model_description": "Test monitored model description changed",
        "model_status": "active",
        "iteration": iteration_to_model
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_id = response.json()["_id"]
    response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed)
    mon_model_assigned_model_id_to_iter_new = response.json()["iteration"]["assigned_monitored_model_id"]
    assert response.status_code == 200
    assert response.json()["model_name"] == monitored_model_changed["model_name"]
    assert response.json()["model_status"] == monitored_model_changed["model_status"]
    assert monitored_model_id == mon_model_assigned_model_id_to_iter_new


@pytest.mark.asyncio
async def test_update_monitored_model_with_changing_status(client: AsyncClient):
    """
    Test update monitored model with changing status.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    monitored_model_name = 'Engine failure prediction model v4 changed'
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    id = response.json()["_id"]

    monitored_model_changed = {
        "model_status": "archived"
    }

    response = await client.put(f"/monitored-models/{id}", json=monitored_model_changed)

    assert response.status_code == 200
    assert response.json()["model_name"] == monitored_model_name
    assert response.json()["model_status"] == monitored_model_changed["model_status"]


@pytest.mark.asyncio
async def test_update_monitored_model_with_changing_status_to_idle(client: AsyncClient):
    """
    Test update monitored model with changing status to idle.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    monitored_model_name = 'Engine failure prediction model v4 changed'
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    id = response.json()["_id"]

    monitored_model_changed = {
        "model_status": "idle"
    }

    response = await client.put(f"/monitored-models/{id}", json=monitored_model_changed)

    assert response.status_code == 400
    assert response.json()["detail"] == "Monitored model has iteration. Model status must be 'active' or 'archived'."


@pytest.mark.asyncio
async def test_update_monitored_model_with_changing_status_to_active(client: AsyncClient):
    """
    Test update monitored model with changing status to active.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    monitored_model = {
        "model_name": "Engine failure prediction model v5",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    id = response.json()["_id"]

    monitored_model_changed = {
        "model_status": "active"
    }

    response = await client.put(f"/monitored-models/{id}", json=monitored_model_changed)

    assert response.status_code == 400
    assert response.json()["detail"] == "Monitored model has no iteration. Model status must be 'idle' or 'archived'."


@pytest.mark.asyncio
async def test_create_monitored_model_with_no_iteration_and_status_active(client: AsyncClient):
    """
    Test create monitored model with no iteration and status active.

    Args:
        client: Async client fixture

    Returns:
        None
    """
    monitored_model = {
        "model_name": "Engine failure prediction model v6",
        "model_description": "Test monitored model description",
        "model_status": "active"
    }

    response = await client.post("/monitored-models/", json=monitored_model)

    assert response.status_code == 400
    assert response.json()["detail"] == "Monitored model has no iteration. Model status must be 'idle' or 'archived'."


@pytest.mark.asyncio
async def test_update_monitored_model_with_changing_iteration(client: AsyncClient):
    """
    Test update monitored model with changing iteration.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project_title = "Mercedes-Benz Manufacturing Poland"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Engine failure prediction"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    old_iteration = {
        "iteration_name": "Iteration 4",
        "metrics": {"accuracy": 0.9, "precision": 0.9, "recall": 0.9, "f1": 0.9},
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=old_iteration)
    old_iteration_id = response.json()["id"]

    old_iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model v7",
        "model_description": "Test monitored model description",
        "model_status": "active",
        "iteration": old_iteration_to_model
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_id = response.json()["_id"]
    monitored_model_name = response.json()["model_name"]

    new_iteration = {
        "iteration_name": "Iteration 5",
        "metrics": {"accuracy": 0.9, "precision": 0.9, "recall": 0.9, "f1": 0.9},
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=new_iteration)
    new_iteration_id = response.json()["id"]

    new_iteration_to_model = response.json()

    monitored_model_changed = {
        "iteration": new_iteration_to_model
    }

    monitored_model_response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed)

    old_iteration_response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{old_iteration_id}")
    new_iteration_response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{new_iteration_id}")

    assert monitored_model_response.status_code == 200
    assert monitored_model_response.json()["iteration"]["id"] == new_iteration_id
    assert monitored_model_response.json()["iteration"]["assigned_monitored_model_id"] == monitored_model_id
    assert new_iteration_response.json()["assigned_monitored_model_id"] == monitored_model_id
    assert old_iteration_response.json()["assigned_monitored_model_id"] is None
