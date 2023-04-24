from fastapi import APIRouter, status
from beanie import PydanticObjectId
from typing import List

from app.models.project import Project, UpdateProject
from app.routers.exceptions.project import (
    project_not_found_exception,
    project_title_not_unique_exception,
    project_has_remaining_experiments_exception
)

router = APIRouter()


@router.get("/", response_model=List[Project], status_code=status.HTTP_200_OK)
async def get_all_projects() -> List[Project]:
    projects = await Project.find_all().to_list()
    return projects


@router.get("/non-archived", response_model=List[Project], status_code=status.HTTP_200_OK)
async def get_non_archived_projects() -> List[Project]:
    projects = await Project.find(Project.archived == False).to_list()
    return projects


@router.get("/archived", response_model=List[Project], status_code=status.HTTP_200_OK)
async def get_archived_projects() -> List[Project]:
    projects = await Project.find(Project.archived == True).to_list()
    return projects


@router.get("/{id}", response_model=Project, status_code=status.HTTP_200_OK)
async def get_project(id: PydanticObjectId) -> Project:
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    return project


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def add_project(project: Project) -> Project:
    title_unique = await is_title_unique(project.title)
    if not title_unique:
        raise project_title_not_unique_exception()

    await project.insert()
    return project


# @router.put("/title/{id}", response_model=Project, status_code=status.HTTP_200_OK)
# async def change_project_title(id: PydanticObjectId, title: str) -> Project:
#     project = await Project.get(id)
#     if not project:
#         raise project_not_found_exception()
#
#     title_unique = await is_title_unique(title)
#     if not title_unique:
#         raise project_title_not_unique_exception()
#
#     project.title = title
#     await project.save()
#
#     return project


@router.put("/{id}", response_model=Project, status_code=status.HTTP_200_OK)
async def update_project(id: PydanticObjectId, updated_project: UpdateProject) -> Project:
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    title_unique = await is_title_unique(updated_project.title)
    if not title_unique:
        raise project_title_not_unique_exception()

    await project.update({"$set": updated_project.dict(exclude_unset=True)})
    await project.save()

    return project


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(id: PydanticObjectId):
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    # let's not allow deleting if project has remaining experiments
    if project.experiments:
        raise project_has_remaining_experiments_exception()

    await project.delete()
    return None


@router.get("/title/{title}", response_model=Project, status_code=status.HTTP_200_OK)
async def get_project_by_title(title: str) -> Project:
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
