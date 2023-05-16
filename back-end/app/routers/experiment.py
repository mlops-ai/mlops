from datetime import datetime

from fastapi import APIRouter, status
from beanie import PydanticObjectId
from typing import List, Dict

from app.models.dataset import Dataset
from app.models.experiment import Experiment, UpdateExperiment
from app.models.project import Project
from app.routers.exceptions.dataset import dataset_not_found_exception
from app.routers.exceptions.experiment import experiment_name_not_unique_exception, experiment_not_found_exception
from app.routers.exceptions.iteration import iteration_not_found_exception
from app.routers.exceptions.project import project_not_found_exception

experiment_router = APIRouter()


@experiment_router.get("/", response_model=List[Experiment], status_code=status.HTTP_200_OK)
async def get_experiments(project_id: PydanticObjectId) -> List[Experiment]:
    """
    Retrieve all experiments.

    Args:

    - **project_id (PydanticObjectId)**: Project id

    Returns:
    - **List[Experiment]**: List of experiments
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiments = project.experiments

    return experiments


@experiment_router.get("/{id}", response_model=Experiment, status_code=status.HTTP_200_OK)
async def get_experiment(project_id: PydanticObjectId, id: PydanticObjectId) -> Experiment:
    """
    Retrieve experiment by id.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **id (PydanticObjectId)**: Experiment id

    Returns:
    - **Experiment**: Experiment
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == id), None)
    if not experiment:
        raise experiment_not_found_exception()

    return experiment


@experiment_router.get("/name/{name}", response_model=Experiment, status_code=status.HTTP_200_OK)
async def get_experiment_by_name(project_id: PydanticObjectId, name: str) -> Experiment:
    """
    Retrieve experiment by name.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **name (str)**: Experiment name

    Returns:
    - **Experiment**: Experiment
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.name == name), None)
    if not experiment:
        raise experiment_not_found_exception()

    return experiment


@experiment_router.post("/", response_model=Experiment, status_code=status.HTTP_201_CREATED)
async def add_experiment(project_id: PydanticObjectId, experiment: Experiment) -> Experiment:
    """
    Add new experiment.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment (Experiment)**: Experiment

    Returns:
    - **Experiment**: Experiment
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    name_unique = await is_name_unique(project.experiments, experiment.name)
    if not name_unique:
        raise experiment_name_not_unique_exception()

    experiment.project_id = project_id

    project.experiments.append(experiment)
    await project.save()

    return experiment


@experiment_router.put("/{id}", response_model=Experiment, status_code=status.HTTP_200_OK)
async def update_experiment(project_id: PydanticObjectId, id: PydanticObjectId,
                            updated_experiment: UpdateExperiment) -> Experiment:
    """
    Update experiment.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **id (PydanticObjectId)**: Experiment id
    - **updated_experiment (UpdateExperiment)**: Updated experiment

    Returns:
    - **Experiment**: Experiment
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == id), None)
    if not experiment:
        raise experiment_not_found_exception()

    name_unique = await is_name_unique(project.experiments, updated_experiment.name)
    if not name_unique:
        raise experiment_name_not_unique_exception()

    experiment.name = updated_experiment.name or experiment.name
    experiment.description = updated_experiment.description or experiment.description
    experiment.updated_at = datetime.now()

    await project.save()

    return experiment


@experiment_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experiment(project_id: PydanticObjectId, id: PydanticObjectId) -> None:
    """
    Delete experiment by id.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **id (PydanticObjectId)**: Experiment id

    Returns:
    - **None**
    """
    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == id), None)
    if not experiment:
        raise experiment_not_found_exception()

    iterations = experiment.iterations
    for iteration in iterations:
        if iteration.dataset:
            dataset = await Dataset.get(iteration.dataset.id)
            if not dataset:
                raise dataset_not_found_exception()

            del dataset.linked_iterations[str(iteration.id)]
            await dataset.save()

    project.experiments.remove(experiment)
    await project.save()

    return None


@experiment_router.post("/delete_iterations", status_code=status.HTTP_204_NO_CONTENT)
async def delete_iterations(project_id: PydanticObjectId, experiment_dict: Dict[PydanticObjectId,
    List[PydanticObjectId]]) -> None:
    """
    Delete iterations by ids.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment_dict (Dict[PydanticObjectId, List[PydanticObjectId]])**: Dictionary with experiment id as key and list
            of iteration ids as value

    Returns:
    - **None**
    """

    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    for experiment_id, iteration_ids in experiment_dict.items():
        experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)
        if not experiment:
            raise experiment_not_found_exception()

        for iteration_id in iteration_ids:
            iteration = next((iter for iter in experiment.iterations if iter.id == iteration_id), None)
            if not iteration:
                raise iteration_not_found_exception()

            if iteration.dataset:
                dataset = await Dataset.get(iteration.dataset.id)
                if not dataset:
                    raise dataset_not_found_exception()

                del dataset.linked_iterations[str(iteration.id)]
                await dataset.save()

            experiment.iterations.remove(iteration)

    await project.save()

    return None


async def is_name_unique(experiments: List[Experiment], name: str) -> bool:
    """
    Util function for checking if experiment name is unique within project.

    Args:
    - **experiments**: List of experiments in the project.
    - **name**: Experiment name to check.

    Returns:
    - True if name is unique, False otherwise.
    """
    for exp in experiments:
        if exp.name == name:
            return False
    return True
