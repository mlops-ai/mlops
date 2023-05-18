from datetime import datetime

from fastapi import APIRouter, status
from beanie import PydanticObjectId
from typing import List, Dict

from app.models.dataset import Dataset
from app.models.iteration import Iteration, UpdateIteration
from app.models.project import Project
from app.models.chart import InteractiveChart
from app.routers.exceptions.chart import chart_name_in_iteration_not_unique_exception
from app.routers.exceptions.dataset import dataset_not_found_exception
from app.routers.exceptions.experiment import experiment_not_found_exception
from app.routers.exceptions.project import project_not_found_exception
from app.routers.exceptions.iteration import iteration_not_found_exception

iteration_router = APIRouter()


@iteration_router.get("/", response_model=List[Iteration], status_code=status.HTTP_200_OK)
async def get_iterations(project_id: PydanticObjectId, experiment_id: PydanticObjectId) -> List[Iteration]:
    """
    Retrieve all iteration for selected experiment.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment_id (PydanticObjectId)**: Experiment id

    Returns:
    - **List[Iteration]**: List of iterations
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
async def get_iteration(project_id: PydanticObjectId, experiment_id: PydanticObjectId, id: PydanticObjectId) -> \
        Iteration:
    """
    Retrieve iteration by id.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment_id (PydanticObjectId)**: Experiment id
    - **id (PydanticObjectId)**: Iteration id

    Returns:
    - **Iteration**: Iteration
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
async def get_iterations_by_name(project_id: PydanticObjectId, experiment_id: PydanticObjectId, name: str) -> \
        List[Iteration]:
    """
    Retrieve all iterations by name.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment_id (PydanticObjectId)**: Experiment id
    - **name (str)**: Iteration name

    Returns:
    - **List[Iteration]**: List of iterations with selected name
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
async def add_iteration(project_id: PydanticObjectId, experiment_id: PydanticObjectId, iteration: Iteration) -> \
        Iteration:
    """
    Add new iteration to experiment.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment_id (PydanticObjectId)**: Experiment id
    - **iteration (Iteration)**: Iteration

    Returns:
    - **Iteration**: Iteration added to experiment
    """

    project = await Project.get(project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration.experiment_id = experiment_id
    iteration.project_id = project_id
    iteration.experiment_name = experiment.name
    iteration.project_title = project.title
    iteration.created_at = datetime.now()

    if iteration.interactive_charts:
        unique_charts_names = await is_chart_name_unique(iteration)
        if not unique_charts_names:
            raise chart_name_in_iteration_not_unique_exception()

    if iteration.dataset:
        await add_iteration_to_dataset_linked_iterations(iteration)

    experiment.iterations.append(iteration)
    await project.save()

    return iteration


@iteration_router.put("/{id}", response_model=Iteration, status_code=status.HTTP_200_OK)
async def update_iteration(project_id: PydanticObjectId, experiment_id: PydanticObjectId, id: PydanticObjectId,
                           updated_iteration: UpdateIteration) -> Iteration:
    """
    Update iteration by id.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment_id (PydanticObjectId)**: Experiment id
    - **id (PydanticObjectId)**: Iteration id
    - **updated_iteration (UpdateIteration)**: Updated iteration

    Returns:
    - **Iteration**: Updated iteration
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

    iteration.iteration_name = updated_iteration.iteration_name or iteration.iteration_name

    await project.save()

    return iteration


@iteration_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_iteration(project_id: PydanticObjectId, experiment_id: PydanticObjectId, id: PydanticObjectId) -> None:
    """
    Delete iteration by id.

    Args:
    - **project_id (PydanticObjectId)**: Project id
    - **experiment_id (PydanticObjectId)**: Experiment id
    - **id (PydanticObjectId)**: Iteration id

    Returns:
    - **None**: None
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

    if iteration.dataset:
        await delete_iteration_from_dataset_deleting_iteration(iteration)

    experiment.iterations.remove(iteration)
    await project.save()

    return None


async def delete_iteration_from_dataset_deleting_iteration(iteration: Iteration) -> None:
    """
    Util function for deleting iteration from dataset when iteration is deleted.

    Args:
    - **iteration (Iteration)**: Iteration

    Returns:
    - **None**: None
    """
    dataset = await Dataset.get(iteration.dataset.id)
    if not dataset:
        raise dataset_not_found_exception()

    del dataset.linked_iterations[str(iteration.id)]
    await dataset.save()

    return None


async def is_chart_name_unique(iteration: Iteration) -> bool:
    """
    Check if chart name is unique in iteration.

    Args:
    - **iteration (Iteration)**: Iteration

    Returns:
    - **bool**: True if chart name is unique, False otherwise
    """
    chart_names = [chart.chart_name for chart in iteration.interactive_charts]
    if len(chart_names) != len(set(chart_names)):
        return False
    return True


async def add_iteration_to_dataset_linked_iterations(iteration: Iteration) -> None:
    """
    Util function for adding iteration to dataset linked iterations.

    Args:
    - **iteration (Iteration)**: Iteration

    Returns:
    - **None**: None
    """
    dataset = await Dataset.get(iteration.dataset.id)
    if not dataset:
        raise dataset_not_found_exception()

    iteration.dataset.name = dataset.dataset_name
    dataset.linked_iterations[str(iteration.id)] = (iteration.project_id, iteration.experiment_id)
    await dataset.save()

    return None