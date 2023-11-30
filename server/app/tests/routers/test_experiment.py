import os

import pytest
from httpx import AsyncClient

from app.database.init_mongo_db import drop_database

import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
async def test_empty_get_experiments(client: AsyncClient):
    """
    Test get all experiments when there are no experiments

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    # create a new project
    await drop_database()
    project = {
        "title": "Test project"
    }
    response = await client.post("/projects/", json=project)
    project_id = response.json()["_id"]

    # get experiments for the project
    response = await client.get(f"/projects/{project_id}/experiments/")

    assert response.status_code == 200
    assert (len(response.json()) == 0)


@pytest.mark.asyncio
async def test_add_experiment(client: AsyncClient):
    """
    Test add experiment

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project = {
        "title": "Test project 2"
    }

    response = await client.post("/projects/", json=project)
    project_id = response.json()["_id"]

    experiment = {
        "name": "Test experiment"
    }

    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    assert response.status_code == 201
    assert response.json()['name'] == experiment['name']


@pytest.mark.asyncio
async def test_get_experiments(client: AsyncClient):
    """
    Test get all experiments if there are experiments

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    response = await client.get(f"/projects/{project_id}/experiments/")
    assert response.status_code == 200
    assert (len(response.json()) >= 1)


@pytest.mark.asyncio
async def test_get_experiment(client: AsyncClient):
    """
    Test get experiment by id

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"

    # Find the project ID for the project with the given title
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    # Create an experiment for the project
    experiment = {
        "name": "Test experiment 1",
    }
    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    # Log the response and status code
    experiment_id = response.json()["id"]

    # Get the experiment by ID
    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}")
    experiment = response.json()

    # Assert that the response status code is 200 OK
    assert response.status_code == 200

    # Assert that the experiment title and description match the expected values
    assert experiment["name"] == "Test experiment 1"


@pytest.mark.asyncio
async def test_change_experiment_name(client: AsyncClient):
    """
    Test change experiment name

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"

    # Find the project ID for the project with the given title
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment = {
        "name": "Test experiment 10"
    }

    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    experiment_id = response.json()["id"]

    new_name = "new_name experiment"
    response = await client.put(f"/projects/{project_id}/experiments/{experiment_id}", json={"name": new_name})

    assert response.status_code == 200
    assert response.json()['name'] == new_name


@pytest.mark.asyncio
async def test_change_experiment_description(client: AsyncClient):
    """
    Test change experiment description

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"

    # Find the project ID for the project with the given title
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment = {
        "name": "Test experiment 4"
    }

    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    experiment_id = response.json()["id"]

    description = "I have changed the description"
    response = await client.put(f"/projects/{project_id}/experiments/{experiment_id}",
                                json={"description": description})

    assert response.status_code == 200
    assert response.json()['description'] == description


@pytest.mark.asyncio
async def test_get_experiment_by_name(client: AsyncClient):
    """
    Test get experiment by name

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"

    # Find the project ID for the project with the given title
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment 1"

    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    assert response.status_code == 200
    assert response.json()['name'] == experiment_name


@pytest.mark.asyncio
async def test_delete_experiment(client: AsyncClient):
    """
    Test delete experiment

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment = {
        "name": "Test experiment 3"
    }
    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    # Log the response and status code
    experiment_id = response.json()["id"]

    # Get the experiment by ID
    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}")
    experiment_id = response.json()["id"]

    response = await client.delete(f"/projects/{project_id}/experiments/{experiment_id}")
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_iterations(client: AsyncClient):
    """
    Test delete iterations.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project = {
        "title": "Test project to delete few iterations",
        "description": "Test project description"
    }
    response = await client.post("/projects/", json=project)
    project_id = response.json()["_id"]

    experiment_dict = {}

    experiment_1 = {
        "name": "Test experiment 1",
        "description": "Test experiment description"
    }

    experiment_2 = {
        "name": "Test experiment 2",
        "description": "Test experiment description"
    }

    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment_1)
    experiment_1_id = response.json()["id"]
    experiment_dict[experiment_1_id] = []

    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment_2)
    experiment_2_id = response.json()["id"]
    experiment_dict[experiment_2_id] = []

    iteration_1 = {
        "iteration_name": "Test iteration 1",
        "description": "Test iteration description",
        "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001}
    }

    iteration_2 = {
        "iteration_name": "Test iteration 2",
        "description": "Test iteration description",
        "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_1_id}/iterations/",
                                 json=iteration_1)
    iteration_1_id = response.json()["id"]
    experiment_dict[experiment_1_id].append(iteration_1_id)

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_2_id}/iterations/",
                                 json=iteration_2)
    iteration_2_id = response.json()["id"]
    experiment_dict[experiment_2_id].append(iteration_2_id)

    response = await client.post(f"/projects/{project_id}/experiments/delete_iterations", json=experiment_dict)

    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_experiment_with_iteration_assigned_to_monitored_model(client: AsyncClient):
    """
    Test delete experiment if there are iterations inside assigned to monitored model.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project = {
        "title": "Red Bull Racing project",
        "description": "Description not empty"
    }
    response = await client.post("/projects/", json=project)
    project_id = response.json()["_id"]
    assert response.status_code == 201
    assert response.json()["title"] == project["title"]
    assert response.json()["description"] == project["description"]

    experiment = {
        "name": "Test experiment"
    }
    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    experiment_id = response.json()["id"]
    assert response.status_code == 201

    response = await client.get(f"/projects/{project_id}")
    assert response.status_code == 200
    assert len(response.json()["experiments"]) == 1

    iteration = {
        "iteration_name": "Iteration test v1",
        "metrics": {"accuracy": 0.9, "precision": 0.9, "recall": 0.9, "f1": 0.9},
        "parameters": {"batch_size": 64, "epochs": 1000, "learning_rate": 0.19},
        "path_to_model": os.path.join(
            os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"
        )
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model_1 = response.json()

    monitored_model_1 = {
        "model_name": "Engine failure prediction model v8",
        "model_description": "Test monitored model description",
        "model_status": "idle"
    }

    response = await client.post("/monitored-models/", json=monitored_model_1)
    monitored_model_id = response.json()["_id"]
    monitored_model_name = response.json()["model_name"]

    monitored_model_changed_v1 = {
        "model_status": "active",
        "iteration": iteration_to_model_1
    }

    monitored_model_response = await client.put(f"/monitored-models/{monitored_model_id}",
                                                json=monitored_model_changed_v1)

    response = await client.delete(f"/projects/{project_id}/experiments/{experiment_id}")
    assert response.status_code == 400
    assert response.json()["detail"] == ("Iteration in experiment is assigned to monitored model. Cannot delete it. "
                                         "Please delete monitored model first.")
