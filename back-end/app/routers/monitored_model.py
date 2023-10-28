import pandas as pd
from typing import List
import pickle
from datetime import datetime
from beanie import PydanticObjectId
from fastapi import APIRouter, status

from app.models.iteration import Iteration
from app.models.monitored_model import MonitoredModel, UpdateMonitoredModel
from app.models.project import Project
from app.routers.exceptions.experiment import experiment_not_found_exception
from app.routers.exceptions.iteration import iteration_not_found_exception
from app.routers.exceptions.monitored_model import monitored_model_not_found_exception, \
    monitored_model_name_not_unique_exception, monitored_model_has_no_iteration_exception, \
    monitored_model_has_iteration_exception, iteration_has_no_path_to_model_exception, \
    monitored_model_load_ml_model_exception, monitored_model_prediction_exception
from app.routers.exceptions.project import project_not_found_exception


monitored_model_router = APIRouter()


@monitored_model_router.get("/", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_all_monitored_models() -> List[MonitoredModel]:
    """
    Get all monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all monitored models.
    """

    monitored_models = await MonitoredModel.find_all().to_list()
    return monitored_models


@monitored_model_router.get("/non-archived", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_non_archived_monitored_models() -> List[MonitoredModel]:
    """
    Get all non-archived monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all non-archived monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status != 'archived').to_list()
    return monitored_models


@monitored_model_router.get("/archived", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_archived_monitored_models() -> List[MonitoredModel]:
    """
    Get all archived monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all archived monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status == 'archived').to_list()
    return monitored_models


@monitored_model_router.get("/active", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_active_monitored_models() -> List[MonitoredModel]:
    """
    Get all active monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all active monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status == 'active').to_list()
    return monitored_models


@monitored_model_router.get("/idle", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_idle_monitored_models() -> List[MonitoredModel]:
    """
    Get all idle monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all idle monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status == 'idle').to_list()
    return monitored_models


@monitored_model_router.get('/name/{name}', response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def get_monitored_model_by_name(name: str) -> MonitoredModel:
    """
    Retrieve monitored model by name.

    Args:
    - **name (str)**: Monitored model name

    Returns:
    - **MonitoredModel**: Monitored model
    """

    monitored_model = await MonitoredModel.find_one(MonitoredModel.model_name == name)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    return monitored_model


@monitored_model_router.get('/id/{id}', response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def get_monitored_model_by_id(id: PydanticObjectId) -> MonitoredModel:
    """
    Retrieve monitored model by id.

    Args:
    - **id (str)**: Monitored model id

    Returns:
    - **MonitoredModel**: Monitored model
    """

    monitored_model = await MonitoredModel.find_one(MonitoredModel.id == id)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    return monitored_model


@monitored_model_router.post("/", response_model=MonitoredModel, status_code=status.HTTP_201_CREATED)
async def create_monitored_model(monitored_model: MonitoredModel) -> MonitoredModel:
    """
    Add new monitored model.

    Args:
    - **monitored_model** (MonitoredModel): Monitored model to add.

    Returns:
    - **MonitoredModel**: Added monitored model.
    """

    unique_name = await is_name_unique(monitored_model.model_name)
    if not unique_name:
        raise monitored_model_name_not_unique_exception()

    if monitored_model.iteration is None and monitored_model.model_status not in ('idle', 'archived'):
        raise monitored_model_has_no_iteration_exception()
    elif monitored_model.iteration is not None and monitored_model.model_status == 'idle':
        raise monitored_model_has_iteration_exception()

    monitored_model = await monitored_model.insert()

    if monitored_model.iteration is not None:
        iteration_with_assigned_model = await update_assigned_model_in_iteration(monitored_model.iteration,
                                                                                 monitored_model.id)
        monitored_model.iteration = iteration_with_assigned_model

    await monitored_model.save()

    return monitored_model


@monitored_model_router.put("/{id}", response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def update_monitored_model(id: PydanticObjectId, updated_monitored_model: UpdateMonitoredModel) -> MonitoredModel:
    """
    Update monitored model.

    Args:
    - **id (PydanticObjectId)**: Monitored model id
    - **monitored_model (MonitoredModel)**: Monitored model to update

    Returns:
    - **MonitoredModel**: Updated monitored model
    """

    monitored_model = await MonitoredModel.get(id)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    if updated_monitored_model.model_name is not None:
        unique_name = await is_name_unique(updated_monitored_model.model_name)
        if not unique_name:
            raise monitored_model_name_not_unique_exception()

    if updated_monitored_model.iteration is not None:
        # check if iteration has model path
        if not updated_monitored_model.iteration.path_to_model:
            raise iteration_has_no_path_to_model_exception()

        if updated_monitored_model.model_status == 'idle':
            raise monitored_model_has_iteration_exception()
        elif updated_monitored_model.model_status is None:
            if monitored_model.model_status == 'idle':
                raise monitored_model_has_iteration_exception()
    elif updated_monitored_model.iteration is None:
        if monitored_model.iteration is not None:
            if updated_monitored_model.model_status is not None:
                if updated_monitored_model.model_status not in ('active', 'archived'):
                    raise monitored_model_has_iteration_exception()
        else:
            if updated_monitored_model.model_status is not None:
                if updated_monitored_model.model_status not in ('idle', 'archived'):
                    raise monitored_model_has_no_iteration_exception()

    if updated_monitored_model.iteration is not None:
        if monitored_model.iteration is not None:
            # Remove the association from the old iteration if there was one
            await update_assigned_model_in_iteration(monitored_model.iteration, None)
            # Update the new iteration with the model ID and get the updated iteration
            iteration_with_assigned_model = await update_assigned_model_in_iteration(updated_monitored_model.iteration,
                                                                                     monitored_model.id)
            # Update monitored_model's iteration with the updated iteration
            updated_monitored_model.iteration = iteration_with_assigned_model
        elif monitored_model.iteration is None:
            # This is a new assignment, update the new iteration with the model ID and get the updated iteration
            iteration_with_assigned_model = await update_assigned_model_in_iteration(updated_monitored_model.iteration,
                                                                                     monitored_model.id)
            # Update monitored_model's iteration with the updated iteration
            updated_monitored_model.iteration = iteration_with_assigned_model

    await monitored_model.update({"$set": updated_monitored_model.dict(exclude_unset=True)})
    monitored_model = await MonitoredModel.get(id)
    await monitored_model.save()

    return monitored_model


@monitored_model_router.delete("/{id}", response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def delete_monitored_model(id: PydanticObjectId) -> MonitoredModel:
    """
    Delete monitored model.

    Args:
    - **id (PydanticObjectId)**: Monitored model id

    Returns:
    - **MonitoredModel**: Deleted monitored model
    """

    monitored_model = await MonitoredModel.find_one(MonitoredModel.id == id)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    if monitored_model.iteration is not None:
        monitored_model.iteration.assigned_monitored_model_id = None

    await monitored_model.delete()
    return monitored_model


@monitored_model_router.get('/{id}/ml-model-metadata', response_model=dict, status_code=status.HTTP_200_OK)
async def get_monitored_model_ml_model_metadata(id: PydanticObjectId) -> dict:
    """
    Get monitored model ml model metadata.

    Args:
    - **id (str)**: Monitored model id

    Returns:
    - **dict**: Monitored model ml model metadata.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()
    if not monitored_model.iteration:
        raise monitored_model_has_no_iteration_exception()

    try:
        ml_model = await load_ml_model(monitored_model)
    except Exception as e:
        raise monitored_model_load_ml_model_exception(str(e))

    return {
        'response_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'ml_model': str(ml_model)
    }


@monitored_model_router.post('/{id}/predict', response_model=dict, status_code=status.HTTP_200_OK)
async def monitored_model_predict(id: PydanticObjectId, data: dict) -> dict:
    """
    Make prediction using monitored model ml model. <br>
    **NOTE:** ml model needs to be complied with scikit-learn API.

    Args:
    - **id (str)**: Monitored model id
    - **data (dict)**: Single data sample to make prediction on.

    Returns:
    - **dict**: Prediction result.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()
    if not monitored_model.iteration:
        raise monitored_model_has_no_iteration_exception()

    try:
        ml_model = await load_ml_model(monitored_model)
    except Exception as e:
        raise monitored_model_load_ml_model_exception(str(e))

    try:
        prediction = ml_model.predict(pd.DataFrame([data]))[0]
    except Exception as e:
        raise monitored_model_prediction_exception(str(e))

    return {
        'prediction': prediction
    }


async def is_name_unique(name: str) -> bool:
    """
    Util function for checking if monitored model name is unique.

    Args:
        name: Monitored model name to check.

    Returns:
        True if name is unique, False otherwise.
    """

    monitored_model = await MonitoredModel.find_one(
        MonitoredModel.model_name == name
    )
    if monitored_model:
        return False
    return True

  
async def update_assigned_model_in_iteration(iteration_to_found: Iteration, value_to_set) -> Iteration:
    """
    Util function for getting iteration.

    Args:
        iteration_to_found: Iteration to get.
        value_to_set: Value to set.
    Returns:
        Iteration.
    """
    project = await Project.get(iteration_to_found.project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == iteration_to_found.experiment_id),
                      None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration = next((iter for iter in experiment.iterations if iter.id == iteration_to_found.id), None)
    if not iteration:
        raise iteration_not_found_exception()

    iteration.assigned_monitored_model_id = value_to_set
    await project.save()

    return iteration

 
async def load_ml_model(monitored_model: MonitoredModel) -> object:
    """
    Load ml model from path using pickle.

    Args:
        monitored_model: Monitored model to load ml model from path.

    Returns:
        Loaded ml model instance.
    """
    # TODO: each time we make prediction we load model from path
    # this will be replaced with loading model from database

    with open(monitored_model.iteration.path_to_model, 'rb') as f:
        ml_model = pickle.load(f)
    return ml_model
