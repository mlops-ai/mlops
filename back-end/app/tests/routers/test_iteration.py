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

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
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

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project_title = "Test project"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Test iteration",
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

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
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

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
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

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
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
async def test_change_iteration_name(client: AsyncClient):
    """
    Test change iteration name.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project_title = "Test project"

    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Test iteration to change",
        "metrics": {"accuracy": 0.8, "precision": 0.7, "recall": 0.9, "f1": 0.75},
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.0001},
        "model_name": "Test model name to change"
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    new_name = "Changed iteration name"
    response = await client.put(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{iteration_id}",
                                json={"iteration_name": new_name})

    assert response.status_code == 200
    assert response.json()['iteration_name'] == new_name


@pytest.mark.asyncio
async def test_delete_iteration_by_id(client: AsyncClient):
    """
    Test delete iteration by id.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
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


@pytest.mark.asyncio
async def test_delete_iteration_with_dataset(client: AsyncClient):
    """
    Test delete iteration with dataset.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    dataset = {
        "dataset_name": "Test dataset in iteration",
        "dataset_description": "Test dataset description",
        "dataset_type": "Test dataset type",
        "version": "0.0.0",
        "path_to_dataset": "https://www.kaggle.com/c/titanic/data",
    }

    response = await client.post("/datasets/", json=dataset)
    dataset_id = response.json()["_id"]

    project_title = "Test project"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Test iteration",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "dataset": {
            "id": dataset_id,
            "name": "Test dataset in iteration"}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    await client.delete(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{iteration_id}")

    response = await client.get(f"/datasets/{dataset_id}")

    assert response.json()["linked_iterations"] == {}


@pytest.mark.asyncio
async def test_add_iteration_with_chart(client: AsyncClient):
    """
    Test add iteration with chart.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    dataset_name = "Test dataset in iteration"
    response = await client.get(f"/datasets/name/{dataset_name}")
    dataset_id = response.json()["_id"]

    project_title = "Test project"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Test iteration",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "dataset": {
            "id": dataset_id,
            "name": "Test dataset in iteration"},
        "interactive_charts": [
            {
                "chart_name": "Test chart 1",
                "chart_type": "line",
                "x_data": [1, 2, 3, 4, 5],
                "y_data": [8, 2, 30, 4, 10],
                "x_label": "Shot number",
                "y_label": "Points",
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 201
    assert response.json()["interactive_charts"][0]["chart_name"] == "Test chart 1"
    assert len(response.json()["interactive_charts"]) == 1


@pytest.mark.asyncio
async def test_add_iteration_with_duplicated_chart_names(client: AsyncClient):
    """
    Test add iteration with duplicated chart names.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    dataset_name = "Test dataset in iteration"
    response = await client.get(f"/datasets/name/{dataset_name}")
    dataset_id = response.json()["_id"]

    project_title = "Test project"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Test iteration with duplicated chart names",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "dataset": {
            "id": dataset_id,
            "name": "Test dataset in iteration"},
        "interactive_charts": [
            {
                "chart_name": "Test chart 1",
                "chart_type": "line",
                "x_data": [1, 2, 3, 4, 5, 6],
                "y_data": [8, 2, 30, 4, 10, 12],
                "x_label": "Shot number",
                "y_label": "Points"
            },
            {
                "chart_name": "Test chart 1",
                "chart_type": "line",
                "x_data": [20, 30, 40, 50, 60, 70],
                "y_data": [8, 2, 30, 4, 10, 12],
                "x_label": "Age of the player",
                "y_label": "Count"
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 400
    assert response.json()["detail"] == "Chart names in iteration must be unique"


@pytest.mark.asyncio
async def test_add_iteration_with_different_amounts_of_x_and_y(client: AsyncClient):
    """
    Test add iteration with different amounts of x and y.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    dataset_name = "Test dataset in iteration"
    response = await client.get(f"/datasets/name/{dataset_name}")
    dataset_id = response.json()["_id"]

    project_title = "Test project"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response.json()["id"]

    iteration = {
        "iteration_name": "Test iteration with different amounts of x and y",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "dataset": {
            "id": dataset_id,
            "name": "Test dataset in iteration"},
        "interactive_charts": [
            {
                "chart_name": "Test chart 1",
                "chart_type": "line",
                "x_data": [1, 2, 3],
                "y_data": [8, 2, 30, 4, 10, 12],
                "x_label": "Shot number",
                "y_label": "Points"
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 400
    assert response.json()["detail"] == "Number of x_data and y_data must be the same for the selected chart type"
