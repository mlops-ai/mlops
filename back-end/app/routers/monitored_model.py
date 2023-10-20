from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, status

from app.models.monitored_model import MonitoredModel
from app.routers.exceptions.monitored_model import monitored_model_not_found_exception, \
    monitored_model_name_not_unique_exception

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

    monitored_model = await monitored_model.insert()
    return monitored_model


@monitored_model_router.put("/{id}", response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def update_monitored_model(id: PydanticObjectId, monitored_model: MonitoredModel) -> MonitoredModel:
    """
    Update monitored model.

    Args:
    - **id (PydanticObjectId)**: Monitored model id
    - **monitored_model (MonitoredModel)**: Monitored model to update

    Returns:
    - **MonitoredModel**: Updated monitored model
    """
    db_monitored_model = await MonitoredModel.get(id)
    if not db_monitored_model:
        raise monitored_model_not_found_exception()

    unique_name = await is_name_unique(monitored_model.model_name)
    if not unique_name:
        raise monitored_model_name_not_unique_exception()

    db_monitored_model.model_name = monitored_model.model_name
    db_monitored_model.model_description = monitored_model.model_description
    db_monitored_model.model_status = monitored_model.model_status
    #db_monitored_model.ml_model = monitored_model.ml_model

    await db_monitored_model.save()
    return db_monitored_model


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

    await monitored_model.delete()
    return monitored_model


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
