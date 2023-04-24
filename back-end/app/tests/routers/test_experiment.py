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
    assert(len(response.json()) == 0)


@pytest.mark.asyncio
async def test_add_experiment(client: AsyncClient):
    """
    Test add experiment
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
    """
    project_title = "Test project 2"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    response = await client.get(f"/projects/{project_id}/experiments/")
    assert response.status_code == 200
    assert(len(response.json()) >= 1)


@pytest.mark.asyncio
async def test_get_experiment(client: AsyncClient):
    """
    Test get experiment by id
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
    response = await client.put(f"/projects/{project_id}/experiments/{experiment_id}?name={new_name}")

    assert response.status_code == 200
    assert response.json()['name'] == new_name


@pytest.mark.asyncio
async def test_get_experiment_by_name(client: AsyncClient):
    """
    Test get experiment by name
    """
    project_title = "Test project 2"

    # Find the project ID for the project with the given title
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment 1"

    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    print(response.json())
    assert response.status_code == 200
    assert response.json()['name'] == experiment_name


@pytest.mark.asyncio
async def test_delete_experiment(client: AsyncClient):
    """
    Test delete experiment
    """
    project_title = "Test project 2"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment = {
        "name": "Test experiment 3",
    }
    response = await client.post(f"/projects/{project_id}/experiments/", json=experiment)
    # Log the response and status code
    experiment_id = response.json()["id"]

    # Get the experiment by ID
    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}")
    experiment_id = response.json()["id"]

    response = await client.delete(f"/projects/{project_id}/experiments/{experiment_id}")
    assert response.status_code == 204
