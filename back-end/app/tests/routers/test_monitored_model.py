import pytest
import os
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
            "learning_rate": 0.01},
        "path_to_model": os.path.join(
            os.path.dirname(__file__), "test_files", "linear_regression_model.pkl")
    }
    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model",
        "model_description": "Test monitored model description for Mercedes-Benz Manufacturing Poland",
        "model_status": "idle"
    }
    response = await client.post("/monitored-models/", json=monitored_model)
    assert response.status_code == 201
    assert response.json()["model_name"] == monitored_model["model_name"]
    assert response.json()["model_description"] == monitored_model["model_description"]
    assert response.json()["model_status"] == "idle"

    monitored_model_id = response.json()["_id"]

    monitored_model_changed = {
        "model_status": "active",
        "iteration": iteration_to_model
    }

    response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed)
    assert response.status_code == 200
    assert response.json()["model_status"] == "active"
    assert response.json()['model_name'] == monitored_model['model_name']
    assert response.json()['iteration']['assigned_monitored_model_name'] == monitored_model['model_name']


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
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.0001},
        "path_to_model": os.path.join(
            os.path.dirname(__file__), "test_files", "linear_regression_model.pkl")
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model",
        "model_description": "Test monitored model description",
        "model_status": "idle"
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

    monitored_model = {
        "model_name": "Engine failure prediction model v2",
        "model_description": "Test monitored model description",
        "model_status": "idle",
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

    monitored_model = {
        "model_name": "Engine failure prediction model v3",
        "model_description": "Test monitored model description",
        "model_status": "idle"
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
    assert len(response.json()) == 0


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
    assert len(response.json()) == 2


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
    assert len(response.json()) == 3


@pytest.mark.asyncio
async def test_update_monitored_model_without_iteration(client: AsyncClient):
    """
    Test update monitored model without iteration.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    monitored_model = {
        "model_name": "Test monitored model 5",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }

    monitored_model_changed = {
        "model_name": "Test monitored model 4 changed",
        "model_description": "Test monitored model description changed"
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_id = response.json()["_id"]

    response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed)
    assert response.status_code == 200
    assert response.json()["model_name"] == monitored_model_changed["model_name"]
    assert response.json()["model_description"] == monitored_model_changed["model_description"]


@pytest.mark.asyncio
async def test_update_monitored_model_with_iteration(client: AsyncClient):
    """
    Test update monitored model with iteration.

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
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19},
        "user_name": "Test user",
        "path_to_model": os.path.join(
            os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"
        )
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model v4",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }
    response = await client.post("/monitored-models/", json=monitored_model)
    assert response.status_code == 201

    monitored_model_changed = {
        "model_name": "Engine failure prediction model v4 changed",
        "model_description": "Test monitored model description changed",
        "model_status": "active",
        "iteration": iteration_to_model
    }
    response = await client.get(f"/monitored-models/name/{monitored_model['model_name']}")
    monitored_model_id = response.json()["_id"]

    response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed)
    assert response.status_code == 200
    assert response.json()["model_status"] == monitored_model_changed["model_status"]
    assert response.json()["iteration"]["iteration_name"] == iteration["iteration_name"]
    assert response.json()["iteration"]["assigned_monitored_model_name"] == monitored_model_changed["model_name"]


@pytest.mark.asyncio
async def test_update_iteration_with_no_path_to_model(client: AsyncClient):
    """
    Test update iteration with no path to model.

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
        "iteration_name": "Iteration without path",
        "metrics": {"accuracy": 0.9, "precision": 0.9, "recall": 0.9, "f1": 0.9},
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19},
        "user_name": "Test user"
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    iteration_to_model = response.json()
    
    monitored_model = {
        "model_name": "Engine failure prediction model v11",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }
    response = await client.post("/monitored-models/", json=monitored_model)
    assert response.status_code == 201

    monitored_model_changed = {
        "model_status": "active",
        "iteration": iteration_to_model
    }
    
    response = await client.get(f"/monitored-models/name/{monitored_model['model_name']}")
    assert response.status_code == 200

    monitored_model_id = response.json()["_id"]
    response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed)
    assert response.status_code == 400
    assert response.json()["detail"] == "Iteration has no path to model."


@pytest.mark.asyncio
async def test_get_monitored_model_ml_model_metadata(client: AsyncClient):
    """
    Test get monitored model ml model metadata.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    monitored_model_name = "Engine failure prediction model v4 changed"
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200

    monitored_model_id = response.json()["_id"]
    response = await client.get(f"/monitored-models/{monitored_model_id}/ml-model-metadata")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_monitored_ml_model_predict_success(client: AsyncClient):
    """
    Test monitored model predict with success.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    monitored_model_name = "Engine failure prediction model v4 changed"
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200

    monitored_model_id = response.json()["_id"]
    data = {
        "X1": 1.0,
        "X2": 2.0
    }
    response = await client.post(f"/monitored-models/{monitored_model_id}/predict", json=data)
    assert response.status_code == 200
    assert response.json()["prediction"] == pytest.approx(7.89043535267264)
    assert response.json()["X1"] == 1.0

    # check monitored model predictions data after prediction
    monitored_model_name = "Engine failure prediction model v4 changed"
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200
    assert len(response.json()["predictions_data"]) == 1


@pytest.mark.asyncio
async def test_monitored_ml_model_predict_failure(client: AsyncClient):
    """
    Test monitored model predict with failure (additional column not seen during fit).

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    monitored_model_name = "Engine failure prediction model v4 changed"
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200

    monitored_model_id = response.json()["_id"]
    data = {
        "X1": 21.0,
        "X2": 37.0,
        "X3": 3.0
    }
    response = await client.post(f"/monitored-models/{monitored_model_id}/predict", json=data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Cannot make prediction: The feature names should match those " \
                                        "that were passed during fit.\nFeature names unseen at fit time:\n- X3\n"

    # check monitored model predictions data after prediction (only one previous prediction)
    monitored_model_name = "Engine failure prediction model v4 changed"
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200
    assert len(response.json()["predictions_data"]) == 1
    assert response.json()["predictions_data"][0]["prediction"] == pytest.approx(7.89043535267264)


@pytest.mark.asyncio
async def test_monitored_ml_model_predict_failure_2(client: AsyncClient):
    """
    Test monitored model predict with failure (invalid input column type).

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    monitored_model_name = "Engine failure prediction model v4 changed"
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200

    monitored_model_id = response.json()["_id"]
    data = {
        "X1": 100.0,
        "X2": "Invalid value :)",
    }
    response = await client.post(f"/monitored-models/{monitored_model_id}/predict", json=data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Cannot make prediction: could not convert" \
                                        " string to float: 'Invalid value :)'"

    # check monitored model predictions data after prediction (only one previous prediction)
    monitored_model_name = "Engine failure prediction model v4 changed"
    response = await client.get(f"/monitored-models/name/{monitored_model_name}")
    assert response.status_code == 200
    assert len(response.json()["predictions_data"]) == 1
    assert response.json()["predictions_data"][0]["prediction"] == pytest.approx(7.89043535267264)


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
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19},
        "path_to_model": os.path.join(
            os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"
        )
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=old_iteration)
    old_iteration_id = response.json()["id"]

    old_iteration_to_model = response.json()

    monitored_model = {
        "model_name": "Engine failure prediction model v7",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_id = response.json()["_id"]
    monitored_model_name = response.json()["model_name"]

    monitored_model_changed_v1 = {
        "model_status": "active",
        "iteration": old_iteration_to_model
    }

    monitored_model_response = await client.put(f"/monitored-models/{monitored_model_id}", json=monitored_model_changed_v1)

    new_iteration = {
        "iteration_name": "Iteration 5",
        "metrics": {"accuracy": 0.99, "precision": 0.997, "recall": 0.907, "f1": 0.908},
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19},
        "path_to_model": os.path.join(
            os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"
        )
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
    assert new_iteration_response.json()["assigned_monitored_model_name"] == monitored_model_name
    assert old_iteration_response.json()["assigned_monitored_model_id"] is None
    assert old_iteration_response.json()["assigned_monitored_model_name"] is None


@pytest.mark.asyncio
async def test_delete_monitored_model(client: AsyncClient):
    """
    Test delete monitored model.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    model_name_to_find = "Engine failure prediction model v7"
    response = await client.get(f"/monitored-models/name/{model_name_to_find}")

    iteration = response.json()["iteration"]
    project_id = iteration["project_id"]
    experiment_id = iteration["experiment_id"]
    iteration_id = iteration["id"]

    response = await client.delete(f"/monitored-models/{response.json()['_id']}")
    assert response.status_code == 200

    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{iteration_id}")
    assert response.status_code == 200
    assert response.json()["assigned_monitored_model_id"] is None
    assert response.json()["assigned_monitored_model_name"] is None

    response = await client.get(f"/monitored-models/name/{model_name_to_find}")
    assert response.status_code == 404
