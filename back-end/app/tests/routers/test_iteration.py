import os

import pytest
import logging

from httpx import AsyncClient
from app.database.init_mongo_db import drop_database

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@pytest.mark.asyncio
async def test_empty_get_iterations(client: AsyncClient):
    """
    Test get all iterations when there are no iterations.
    :param client:
    :return:
    """

    await drop_database()
    project = {
        "title": "Test project",
        "description": "Test project description"
    }
    response = await client.post("/projects/", json=project)
    project_id = response.json()["_id"]

    experiment = {
        "name": "Test experiment",
        "description": "Test experiment description"
    }

    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    experiment_id = response.json()["id"]

    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/")

    assert response.status_code == 200
    assert (len(response.json()) == 0)


@pytest.mark.asyncio
async def test_add_iteration(client: AsyncClient):
    """
    Test add iteration without path_to_model.
    :param client:
    :return:
    """

    project_title = "Test project"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Test iteration",
        "description": "Test iteration description",
        "metrics": {"accuracy": 0.8, "precision": 0.7, "recall": 0.9, "f1": 0.75},
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.0001},
        "model_name": "Test model name"
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    assert response.status_code == 201
    assert response.json()['iteration_name'] == iteration['iteration_name']


@pytest.mark.asyncio
async def test_add_iteration2(client: AsyncClient):
    """
    Test add iteration with path_to_model.
    :param client:
    :return:
    """

    project_title = "Test project"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    test_file_path = os.path.join(os.path.dirname(__file__), "test_files", "test_iteration_file.pkl")

    iteration = {
        "iteration_name": "Test iteration 2",
        "description": "Test iteration description",
        "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001},
        "path_to_model": test_file_path,
        "model_name": "Test model name"
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    assert response.status_code == 201
    assert response.json()['iteration_name'] == iteration['iteration_name']


@pytest.mark.asyncio
async def test_get_iterations(client: AsyncClient):
    """
    Test get all iterations if there are iterations.
    :param client:
    :return:
    """

    project_title = "Test project"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/")

    assert response.status_code == 200
    assert (len(response.json()) == 2)


@pytest.mark.asyncio
async def test_get_iteration_or_iterations_by_name(client: AsyncClient):
    """
    Test get iteration or iterations by name.
    :param client:
    :return:
    """

    project_title = "Test project"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration_name = "Test iteration"
    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/name/{iteration_name}")

    assert response.status_code == 200
    assert (response.json()[0]['iteration_name'] == iteration_name)


@pytest.mark.asyncio
async def test_delete_iteration_by_id(client: AsyncClient):
    """
    Test delete iteration by id.
    :param client:
    :return:
    """

    project_title = "Test project"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration_name = "Test iteration"
    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/name/{iteration_name}")
    iteration_id = response.json()[0]["id"]

    response = await client.delete(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{iteration_id}")
    assert response.status_code == 204
