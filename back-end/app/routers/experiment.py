from fastapi import APIRouter, status
from beanie import PydanticObjectId
from typing import List

from app.models.experiment import Experiment
from app.models.project import Project
from app.routers.exceptions.experiment import experiment_name_not_unique_exception, experiment_not_found_exception
from app.routers.exceptions.project import project_not_found_exception

experiment_router = APIRouter()


@experiment_router.get("/", response_model=List[Experiment], status_code=status.HTTP_200_OK)
async def get_experiments(project_id: PydanticObjectId) -> List[Experiment]:
    """
    Retrieve all experiments.
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiments = project.experiments

    #experiments = await Experiment.find_all().to_list()

    return experiments


@experiment_router.get("/{id}", response_model=Experiment, status_code=status.HTTP_200_OK)
async def get_experiment(project_id: PydanticObjectId, id: PydanticObjectId) -> Experiment:
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == id), None)
    if not experiment:
        raise experiment_not_found_exception()

    return experiment


@experiment_router.post("/", response_model=Experiment, status_code=status.HTTP_201_CREATED)
async def add_experiment(project_id: PydanticObjectId, experiment: Experiment) -> Experiment:
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    name_unique = await is_name_unique(project.experiments, experiment.name)
    if not name_unique:
        raise experiment_name_not_unique_exception()

    project.experiments.append(experiment)
    await project.save()

    return experiment


@experiment_router.put("/{id}", response_model=Experiment, status_code=status.HTTP_200_OK)
async def change_experiment_name(project_id: PydanticObjectId, id: PydanticObjectId, name: str) -> Experiment:
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == id), None)
    if not experiment:
        raise experiment_not_found_exception()

    name_unique = await is_name_unique(project.experiments, name)
    if not name_unique:
        raise experiment_name_not_unique_exception()

    experiment.name = name
    await project.save()

    return experiment


@experiment_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experiment(project_id: PydanticObjectId, id: PydanticObjectId):
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == id), None)
    if not experiment:
        raise experiment_not_found_exception()

    # let's not allow deleting if experiment has remaining iterations # TODO: List[Iteration] field in Experiment model
    # if experiment.iterations:
    #    raise experiment_has_remaining_iterations_exception()

    project.experiments.remove(experiment)
    await project.save()

    return None


async def is_name_unique(experiments: List[Experiment], name: str) -> bool:
    """
    Util function for checking if experiment name is unique within project.

    Args:
        experiments: List of experiments in the project.
        name: Experiment name to check.

    Returns:
        True if name is unique, False otherwise.
    """
    for exp in experiments:
        if exp.name == name:
            return False
    return True
