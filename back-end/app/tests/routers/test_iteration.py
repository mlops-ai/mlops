import os

import pytest
import logging
import base64

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
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.0001}
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
        "path_to_model": test_file_path
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
        "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.0001}
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
        "tags": "Test, dataset",
        "archived": False,
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
            "id": dataset_id
        }
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]
    assert response.json()["dataset"]["name"] == dataset["dataset_name"]
    assert response.json()["dataset"]["version"] == dataset["version"]

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
                "name": "test-line-chart",
                "chart_title": "Test chart 1",
                "chart_type": "line",
                "x_data": [[1, 2, 3, 4, 5]],
                "y_data": [[8, 2, 30, 4, 10]],
                "x_label": "Shot number",
                "y_label": "Points"
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    assert response.status_code == 201
    assert response.json()["interactive_charts"][0]["chart_title"] == "Test chart 1"
    assert len(response.json()["interactive_charts"]) == 1


@pytest.mark.asyncio
async def test_add_iteration_with_str_chart(client: AsyncClient):
    """
    Test add iteration with chart string values.

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
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "interactive_charts": [
            {
                "name": "test-bar-chart",
                "chart_title": "Test chart with string values",
                "chart_type": "bar",
                "x_data": [["height", "width", "length"]],
                "y_data": [[180.0, 79, 100.0]],
                "x_label": "String labels",
                "y_label": "Values",
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 201
    assert response.json()["interactive_charts"][0]["chart_title"] == "Test chart with string values"
    assert len(response.json()["interactive_charts"]) == 1
    assert response.json()["dataset"] is None


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
                "name": "test-line-chart",
                "chart_title": "Test chart 1",
                "chart_type": "line",
                "x_data": [[1, 2, 3, 4, 5, 6]],
                "y_data": [[8, 2, 30, 4, 10, 12]],
                "x_label": "Shot number",
                "y_label": "Points",
                "comparable": True
            },
            {
                "name": "test-line-chart",
                "chart_title": "Test chart 1",
                "chart_type": "line",
                "x_data": [[20, 30, 40, 50, 60, 70]],
                "y_data": [[8, 2, 30, 4, 10, 12]],
                "x_label": "Age of the player",
                "y_label": "Count",
                "comparable": True
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
                "name": "line-plot-1",
                "chart_title": "Test chart 1",
                "chart_type": "line",
                "x_data": [[1, 2, 3]],
                "y_data": [[8, 2, 30, 4, 10, 12]],
                "x_label": "Shot number",
                "y_label": "Points"
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 400
    assert response.json()["detail"] == "Length of x_data and y_data must be equal"


@pytest.mark.asyncio
async def test_add_iteration_with_image_charts(client: AsyncClient):
    """
    Test add iteration with image charts from .jpg.

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

    input_image_path = os.path.join(os.path.dirname(__file__), "test_files", "test_image_chart.png")
    with open(input_image_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

    iteration = {
        "iteration_name": "Test iteration with different amounts of x and y",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "image_charts": [
            {
                "name": "Test chart 1",
                "encoded_image": encoded_image
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 201
    assert response.json()["image_charts"][0]["name"] == "Test chart 1"
    assert response.json()["image_charts"][0]["encoded_image"] != ""

    output_image_path = os.path.join(os.path.dirname(__file__), "test_files", "output_image_chart.png")
    with open(output_image_path, "wb") as output_image:
        output_image.write(base64.b64decode(response.json()["image_charts"][0]["encoded_image"]))

    # test if two images are the same
    assert open(input_image_path, "rb").read() == open(output_image_path, "rb").read()


@pytest.mark.asyncio
async def test_change_iteration_project_title_update(client: AsyncClient):
    """
    Test change iteration project_title field when updating project name.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    new_title = "Test project updated"
    response = await client.put(f"/projects/{project_id}", json={"title": new_title})
    assert response.status_code == 200
    assert response.json()["title"] == new_title

    experiment_name = "Test experiment"
    response_exp = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")

    for iteration in response_exp.json()["iterations"]:
        assert iteration["project_title"] == new_title


@pytest.mark.asyncio
async def test_change_iteration_experiment_name_update(client: AsyncClient):
    """
    Test change iteration experiment_name field when updating experiment name.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project updated"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment"
    response_exp = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response_exp.json()["id"]

    new_name = "Test experiment updated"
    response = await client.put(f"/projects/{project_id}/experiments/{experiment_id}", json={"name": new_name})

    assert response.status_code == 200
    assert response.json()['name'] == new_name

    for iteration in response.json()["iterations"]:
        assert iteration["experiment_name"] == new_name


@pytest.mark.asyncio
async def test_add_iteration_with_bar_plot(client: AsyncClient):
    """
    Test add iteration with bar plot.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project_title = "Test project updated"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment updated"
    response_exp = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response_exp.json()["id"]

    iteration = {
        "iteration_name": "Test iteration with bar plot",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "interactive_charts": [
            {
                "chart_type": "bar",
                "name": "bar_plot-1",
                "chart_title": "The number of people in each age group",
                "chart_subtitle": "Source: World Bank",
                "x_data": [["20-40", "40-60", "60-80"]],
                "y_data": [[100, 200, 300], [400, 500, 600]],
                "y_data_names": ["Poznan", "Warsaw"],
                "x_label": "X",
                "y_label": "Y",
                "compare": False
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 201
    assert response.json()["interactive_charts"][0]["name"] == "bar_plot-1"
    assert response.json()["interactive_charts"][0]["chart_title"] == "The number of people in each age group"
    assert response.json()["interactive_charts"][0]["chart_subtitle"] == "Source: World Bank"
    assert response.json()["interactive_charts"][0]["x_data"] == [["20-40", "40-60", "60-80"]]


@pytest.mark.asyncio
async def test_add_iteration_with_scatter_plots(client: AsyncClient):
    """
    Test add iteration with scatter plots.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project_title = "Test project updated"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment updated"
    response_exp = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response_exp.json()["id"]

    iteration = {
        "iteration_name": "Test iteration with scatter plots",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "interactive_charts": [
            {
                "chart_type": "scatter",
                "name": "scatter_plot-1",
                "chart_title": "The number of deaths at different ages",
                "chart_subtitle": "Source: World Bank",
                "x_data": [[20, 40, 60], [10, 30, 50]],
                "y_data": [[100, 200, 300], [400, 500, 600]],
                "x_label": "Age",
                "y_label": "Amount of deaths",
                "compare": True
            },
            {
                "chart_type": "scatter",
                "name": "scatter_plot-2",
                "chart_title": "The number of deaths at different ages 2",
                "chart_subtitle": "Source: World Bank",
                "x_data": [[25, 45, 65], [15, 35, 55]],
                "y_data": [[100, 200, 300], [400, 500, 600]],
                "x_label": "Age",
                "y_label": "Amount of deaths",
                "compare": True
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 201
    assert response.json()["interactive_charts"][0]["name"] == "scatter_plot-1"
    assert response.json()["interactive_charts"][0]["chart_title"] == "The number of deaths at different ages"
    assert response.json()["interactive_charts"][0]["chart_subtitle"] == "Source: World Bank"
    assert response.json()["interactive_charts"][0]["x_data"] == [[20, 40, 60], [10, 30, 50]]
    assert response.json()["interactive_charts"][1]["name"] == "scatter_plot-2"
    assert response.json()["interactive_charts"][1]["chart_title"] == "The number of deaths at different ages 2"
    assert response.json()["interactive_charts"][1]["chart_subtitle"] == "Source: World Bank"
    assert response.json()["interactive_charts"][1]["x_data"] == [[25, 45, 65], [15, 35, 55]]


@pytest.mark.asyncio
async def test_add_iteration_with_pie_plot(client: AsyncClient):
    """
    Test add iteration with pie plot.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project_title = "Test project updated"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment updated"
    response_exp = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response_exp.json()["id"]

    iteration = {
        "iteration_name": "Test iteration with pie plot",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01},
        "interactive_charts": [
            {
                "chart_type": "pie",
                "name": "pie_plot-1",
                "chart_title": "The number of deaths at different ages",
                "chart_subtitle": "Source: World Bank",
                "x_data": [[20, 40, 60]],
                "y_data": [[100, 200, 300], [400, 500, 600]],
                "x_label": "Age",
                "y_label": "Amount of deaths",
                "compare": False
            }
        ]
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)

    assert response.status_code == 400
    assert response.json()["detail"] == "x_data and y_data can only have one list of data"


@pytest.mark.asyncio
async def test_delete_iteration_assigned_to_monitored_model(client: AsyncClient):
    """
    Test delete iteration assigned to monitored model.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """

    project_title = "Test project updated"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]

    experiment_name = "Test experiment updated"
    response_exp = await client.get(f"/projects/{project_id}/experiments/name/{experiment_name}")
    experiment_id = response_exp.json()["id"]

    iteration = {
        "iteration_name": "Iteration with monitored model",
        "metrics": {
            "accuracy": 0.9},
        "parameters": {
            "learning_rate": 0.01}
    }

    response = await client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration)
    iteration_id = response.json()["id"]

    iteration_to_model = response.json()
    monitored_model = {
        "model_name": "Test monitored model",
        "model_description": "Test monitored model description",
        "model_status": "active",
        "iteration": iteration_to_model
    }

    response = await client.post("/monitored-models/", json=monitored_model)
    monitored_model_id = response.json()["_id"]

    response = await client.get(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{iteration_id}")

    assigned_monitored_model_id = response.json()["assigned_monitored_model_id"]

    response = await client.delete(f"/projects/{project_id}/experiments/{experiment_id}/iterations/{iteration_id}")

    assert assigned_monitored_model_id == monitored_model_id
    assert response.status_code == 400
    assert response.json()["detail"] == ("Iteration is assigned to monitored model. Cannot delete it. "
                                         "Please delete monitored model first.")
