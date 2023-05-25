from datetime import datetime

from fastapi import APIRouter, status
from beanie import PydanticObjectId
from typing import List, Dict

from app.models.dataset import Dataset
from app.models.experiment import Experiment
from app.models.iteration import Iteration
from app.models.project import Project, UpdateProject, DisplayProject
from app.routers.exceptions.dataset import dataset_not_found_exception
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


@router.get("/base", response_model=List[DisplayProject], status_code=status.HTTP_200_OK)
async def get_all_projects_base() -> List[DisplayProject]:
    """
    Get base information about all projects.

    Args:
    - **None**

    Returns:
    - **List[DisplayProject]**: List of base information about all projects.
    """

    projects = await Project.find_all().to_list()
    display_projects = []

    for project in projects:
        display_project = DisplayProject(
            id=project.id,
            title=project.title,
            description=project.description,
            status=project.status,
            archived=project.archived,
            created_at=project.created_at,
            updated_at=project.updated_at,
            experiments=[]
        )

        experiments_names = [experiment.name for experiment in project.experiments]

        display_project.experiments = experiments_names

        display_projects.append(display_project)

    return display_projects


@router.get("/{id}/base", response_model=DisplayProject, status_code=status.HTTP_200_OK)
async def get_project_base(id: PydanticObjectId) -> DisplayProject:
    """
    Get base information about project by id.

    Args:
    - **id** (PydanticObjectId): Project id.

    Returns:
    - **DisplayProject**: Base information about project.
    """
    project = await Project.get(id)
    if not project:
        raise project_not_found_exception()

    display_project = DisplayProject(
        id=project.id,
        title=project.title,
        description=project.description,
        status=project.status,
        archived=project.archived,
        created_at=project.created_at,
        updated_at=project.updated_at,
        experiments=[experiment.name for experiment in project.experiments]
    )

    return display_project


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


@router.put("/{id}", response_model=DisplayProject, status_code=status.HTTP_200_OK)
async def update_project(id: PydanticObjectId, updated_project: UpdateProject) -> DisplayProject:
    """
    Update project.

    Args:
    - **id** (PydanticObjectId)**: Project id.

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

    await update_iteration_project_title(project)

    display_project = DisplayProject(
        id=project.id,
        title=project.title,
        description=project.description,
        status=project.status,
        archived=project.archived,
        created_at=project.created_at,
        updated_at=project.updated_at,
        experiments=[experiment.name for experiment in project.experiments]
    )

    return display_project


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

    experiments = project.experiments

    await delete_iterations_from_dataset_deleting_project(experiments)

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


async def delete_iterations_from_dataset_deleting_project(experiments: List[Experiment]) -> None:
    """
    Util function for deleting iterations from dataset when deleting project.

    Args:
        experiments: List of experiments.

    Returns:
        None
    """
    for experiment in experiments:
        iterations = experiment.iterations
        for iteration in iterations:
            if iteration.dataset:
                dataset = await Dataset.get(iteration.dataset.id)
                if not dataset:
                    raise dataset_not_found_exception()

                del dataset.linked_iterations[str(iteration.id)]
                await dataset.save()

    return None


async def update_iteration_project_title(project: Project) -> None:
    """
    Util function for updating project title inside iteration.

    Args:
        project: Project.

    Returns:
        None
    """
    for experiment in project.experiments:
        for iteration in experiment.iterations:
            iteration.project_title = project.title

    await project.save()
