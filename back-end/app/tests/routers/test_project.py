import pytest
from httpx import AsyncClient

from app.database.init_mongo_db import drop_database


@pytest.mark.asyncio
async def test_empty_get_projects(client: AsyncClient):
    await drop_database()
    response = await client.get("/projects/")
    assert response.status_code == 200
    assert(len(response.json()) == 0)


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient):
    project = {
        "title": "Test project"
    }
    response = await client.post("/projects/", json=project)
    assert response.status_code == 201
    assert response.json()["title"] == project["title"]


@pytest.mark.asyncio
async def test_title_unique(client: AsyncClient):
    project = {
        "title": "Test project"
    }
    response = await client.post("/projects/", json=project)
    assert response.status_code == 400
    assert response.json()["detail"] == "Project with that title already exists."


@pytest.mark.asyncio
async def test_get_project_by_id(client: AsyncClient):
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
async def test_get_project_by_name(client: AsyncClient):
    project_title = "Test project 2"
    response = await client.get(f"/projects/title/{project_title}")
    assert response.status_code == 200
    assert response.json()["title"] == project_title


@pytest.mark.asyncio
async def test_change_project_title(client: AsyncClient):
    project_title = "Test project 2"
    new_title = "New title"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]
    response = await client.put(f"/projects/{project_id}?title={new_title}")
    assert response.status_code == 200
    assert response.json()["title"] == new_title


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient):
    project_title = "New title"
    response = await client.get(f"/projects/title/{project_title}")
    project_id = response.json()["_id"]
    response = await client.delete(f"/projects/{project_id}")
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_get_remaining_projects(client: AsyncClient):
    response = await client.get("/projects/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Test project"
