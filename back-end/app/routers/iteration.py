from datetime import datetime

from fastapi import APIRouter, status
from beanie import PydanticObjectId
from typing import List

from app.models.iteration import Iteration
from app.models.project import Project
from app.routers.exceptions.experiment import experiment_not_found_exception
from app.routers.exceptions.project import project_not_found_exception
from app.routers.exceptions.iteration import iteration_not_found_exception

iteration_router = APIRouter()


@iteration_router.get("/", response_model=List[Iteration], status_code=status.HTTP_200_OK)
async def get_iterations(project_id: PydanticObjectId, experiment_id: PydanticObjectId) -> List[Iteration]:
    """
    Retrieve all iteration for selected experiment.
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)

    if not experiment:
        raise experiment_not_found_exception()

    iterations = experiment.iterations

    return iterations


@iteration_router.get("/{id}", response_model=Iteration, status_code=status.HTTP_200_OK)
async def get_iteration(project_id: PydanticObjectId, experiment_id: PydanticObjectId, id: PydanticObjectId) -> Iteration:
    """
    Retrieve iteration by id.
    :param project_id:
    :param experiment_id:
    :param id:
    :return: Iteration
    """

    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration = next((iter for iter in experiment.iterations if iter.id == id), None)
    if not iteration:
        raise iteration_not_found_exception()

    return iteration


@iteration_router.get("/name/{name}", response_model=List[Iteration], status_code=status.HTTP_200_OK)
async def get_iterations_by_name(project_id: PydanticObjectId, experiment_id: PydanticObjectId, name: str) -> List[Iteration]:
    """
    Retrieve all iterations by name.
    :param project_id:
    :param experiment_id:
    :param name:
    :return: List[Iteration]
    """

    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)
    if not experiment:
        raise experiment_not_found_exception()

    iterations = [iter for iter in experiment.iterations if iter.iteration_name == name]

    if not iterations:
        raise iteration_not_found_exception()

    return iterations


@iteration_router.post("/", response_model=Iteration, status_code=status.HTTP_201_CREATED)
async def add_iteration(project_id: PydanticObjectId, experiment_id: PydanticObjectId, iteration: Iteration) -> Iteration:
    """
    Add new iteration to experiment.
    :param project_id:
    :param experiment_id:
    :param iteration:
    :return: Iteration
    """

    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration.created_at = datetime.now()

    experiment.iterations.append(iteration)
    await project.save()

    return iteration


@iteration_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_iteration(project_id: PydanticObjectId, experiment_id: PydanticObjectId, id: PydanticObjectId):
    """
    Delete iteration by id.
    :param project_id:
    :param experiment_id:
    :param id:
    :return: None
    """

    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration = next((iter for iter in experiment.iterations if iter.id == id), None)
    if not iteration:
        raise iteration_not_found_exception()

    experiment.iterations.remove(iteration)
    await project.save()

    return None
