import pytest
from httpx import AsyncClient

from app.database.init_mongo_db import drop_database


@pytest.mark.asyncio
async def test_empty_get_projects(client: AsyncClient):
    """
    Test get all projects when there are no projects.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    await drop_database()
    response = await client.get("/projects/")
    assert response.status_code == 200
    assert(len(response.json()) == 0)


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient):
    """
    Test create project.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project = {
        "title": "Test project"
    }
    response = await client.post("/projects/", json=project)
    assert response.status_code == 201
    assert response.json()["title"] == project["title"]
    assert response.json()["description"] == ""


@pytest.mark.asyncio
async def test_title_unique(client: AsyncClient):
    """
    Test create project with title that already exists.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project = {
        "title": "Test project"
    }
    response = await client.post("/projects/", json=project)
    assert response.status_code == 400
    assert response.json()["detail"] == "Project with that title already exists."


@pytest.mark.asyncio
async def test_get_project_by_id(client: AsyncClient):
    """
    Test get project by id.

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
    response = await client.get(f"/projects/{project_id}")
    assert response.status_code == 200
    assert response.json()["title"] == project["title"]
    assert response.json()["_id"] == project_id


@pytest.mark.asyncio
async def test_get_project_base(client: AsyncClient):
    """
    Test get project base.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project = {
        "title": "Test project 5"
    }
    response = await client.post("/projects/", json=project)
    project_id = response.json()["_id"]
    response = await client.get(f"/projects/{project_id}/base")
    assert response.status_code == 200
    assert response.json()["title"] == project["title"]
    assert response.json()["_id"] == project_id

@pytest.mark.asyncio
async def test_get_project_by_name(client: AsyncClient):
    """
    Test get project by name.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"
    response = await client.get(f"/projects/title/{project_title}")
    assert response.status_code == 200
    assert response.json()["title"] == project_title


@pytest.mark.asyncio
async def test_change_project_title(client: AsyncClient):
    """
    Test change project title.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "Test project 2"
    new_title = "New title"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]
    response = await client.put(f"/projects/{project_id}", json={"title": new_title})
    assert response.status_code == 200
    assert response.json()["title"] == new_title


@pytest.mark.asyncio
async def test_change_project_status(client: AsyncClient):
    """
    Test change project status.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "New title"
    new_status = "wrong status"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]
    response = await client.put(f"/projects/{project_id}", json={"status": new_status})
    assert response.status_code == 400

    new_status = "completed"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]
    response = await client.put(f"/projects/{project_id}", json={"status": new_status})
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient):
    """
    Test delete project if there are no experiments.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project_title = "New title"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]
    response = await client.delete(f"/projects/{project_id}")
    assert response.status_code == 204


async def test_delete_project_with_experiments(client: AsyncClient):
    """
    Test delete project if there are experiments inside.

    Args:
        client (AsyncClient): Async client fixture

    Returns:
        None
    """
    project = {
        "title": "Project with experiments",
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
    assert response.status_code == 201

    response = await client.get(f"/projects/{project_id}")
    assert response.status_code == 200
    assert len(response.json()["experiments"]) == 1

    response = await client.delete(f"/projects/{project_id}")
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_get_remaining_projects(client: AsyncClient):
    response = await client.get("/projects/")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["title"] == "Test project"
