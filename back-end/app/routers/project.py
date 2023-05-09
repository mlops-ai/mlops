from datetime import datetime

from fastapi import APIRouter, status
from beanie import PydanticObjectId
from typing import List, Dict

from app.models.project import Project, UpdateProject
from app.routers.exceptions.project import (
    project_not_found_exception,
    project_title_not_unique_exception,
)

router = APIRouter()


@router.get("/", response_model=List[Project], status_code=status.HTTP_200_OK)
async def get_all_projects() -> List[Project]:
    """
    Get all projects.

    Args:
    - **None**

    Returns:
    - **List[Project]**: List of all projects.
    """
    projects = await Project.find_all().to_list()
    return projects


@router.get("/base", response_model=List[Dict], status_code=status.HTTP_200_OK)
async def get_all_projects_base() -> List[Dict[str, PydanticObjectId | str]]:
    """
    Get base information about all projects.

    Args:
    - **None**

    Returns:
    - **List[Dict[str, str]]**: List of dictionaries with base information about all projects.
    """
    projects = await Project.find_all().to_list()

    projects_base = [
        {"id": project.id, "title": project.title} for project in projects
    ]
    return projects_base


@router.get("/base/{id}", response_model=Dict, status_code=status.HTTP_200_OK)
async def get_project_base(id: PydanticObjectId) -> Dict[str, PydanticObjectId | str | list[str]]:
    """
    Get base information about project by id.

    Args:
    - **id** (PydanticObjectId): Project id.

    Returns:
    - **Dict[str, str]**: Dictionary with base information about project with given id.
    """
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    experiments_names = [experiment.name for experiment in project.experiments]

    return {"id": project.id, "title": project.title, "experiments": experiments_names}


@router.get("/non-archived", response_model=List[Project], status_code=status.HTTP_200_OK)
async def get_non_archived_projects() -> List[Project]:
    """
    Get all non-archived projects.

    Args:
    - **None**

    Returns:
    - **List[Project]**: List of all non-archived projects.
    """
    projects = await Project.find(Project.archived == False).to_list()
    return projects


@router.get("/archived", response_model=List[Project], status_code=status.HTTP_200_OK)
async def get_archived_projects() -> List[Project]:
    """
    Get all archived projects.

    Args:
    - **None**

    Returns:
    - **List[Project]**: List of all archived projects.
    """
    projects = await Project.find(Project.archived == True).to_list()
    return projects


@router.get("/{id}", response_model=Project, status_code=status.HTTP_200_OK)
async def get_project(id: PydanticObjectId) -> Project:
    """
    Get project by id.

    Args:
    - **id** (PydanticObjectId): Project id.

    Returns:
    - **Project**: Project with given id.
    """
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    return project


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def add_project(project: Project) -> Project:
    """
    Add new project.

    Args:
    - **project** (Project): Project to add.

    Returns:
    - **Project**: Added project.
    """
    title_unique = await is_title_unique(project.title)
    if not title_unique:
        raise project_title_not_unique_exception()

    await project.insert()
    return project


@router.put("/{id}", response_model=Project, status_code=status.HTTP_200_OK)
async def update_project(id: PydanticObjectId, updated_project: UpdateProject) -> Project:
    """
    Update project.

    Args:
    - **id** (PydanticObjectId): Project id.

    Returns:
    - **Project**: Updated project.
    """
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    title_unique = await is_title_unique(updated_project.title)
    if not title_unique:
        raise project_title_not_unique_exception()

    updated_project.updated_at = datetime.now()
    await project.update({"$set": updated_project.dict(exclude_unset=True)})
    await project.save()

    return project


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(id: PydanticObjectId):
    """
    Delete project.

    Args:
    - **id** (PydanticObjectId): Project id.

    Returns:
    - **None**
    """
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    await project.delete()
    return None


@router.get("/title/{title}", response_model=Project, status_code=status.HTTP_200_OK)
async def get_project_by_title(title: str) -> Project:
    """
    Get project by title.

    Args:
    - **title** (str): Project title.

    Returns:
    - **Project**: Project with given title.
    """
    project = await Project.find_one(Project.title == title)
    if not project:
        raise project_not_found_exception()

    return project


async def is_title_unique(title: str) -> bool:
    """
    Util function for checking if project title is unique.

    Args:
        title: Project title to check.

    Returns:
        True if title is unique, False otherwise.
    """
    project = await Project.find_one(
        Project.title == title
    )
    if project:
        return False
    return True
