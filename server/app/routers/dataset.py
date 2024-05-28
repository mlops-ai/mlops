import os
import requests
import validators

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, status, HTTPException
from beanie import PydanticObjectId

from app.models.dataset import Dataset, UpdateDataset
from app.models.project import Project

from app.routers.exceptions.dataset import dataset_not_found_exception, dataset_name_and_version_not_unique_exception
from app.routers.exceptions.experiment import experiment_not_found_exception
from app.routers.exceptions.iteration import iteration_not_found_exception
from app.routers.exceptions.project import project_not_found_exception

dataset_router = APIRouter()


@dataset_router.get("/", response_model=List[Dataset], status_code=status.HTTP_200_OK)
async def get_datasets() -> List[Dataset]:
    """
    Retrieve all datasets.

    Args:
    - **None**

    Returns:
    - **List[Dataset]**: List of datasets
    """

    datasets = await Dataset.find_all().to_list()

    return datasets


@dataset_router.get("/non-archived", response_model=List[Dataset], status_code=status.HTTP_200_OK)
async def get_non_archived_datasets() -> List[Dataset]:
    """
    Get all non-archived datasets.

    Args:
    - **None**

    Returns:
    - **List[Dataset]**: List of all non-archived datasets.
    """
    datasets = await Dataset.find(Dataset.archived == False).to_list()
    return datasets


@dataset_router.get("/archived", response_model=List[Dataset], status_code=status.HTTP_200_OK)
async def get_archived_datasets() -> List[Dataset]:
    """
    Get all archived datasets.

    Args:
    - **None**

    Returns:
    - **List[Dataset]**: List of all archived datasets.
    """
    datasets = await Dataset.find(Dataset.archived == True).to_list()
    return datasets


@dataset_router.get("/name/{name}", response_model=Dataset, status_code=status.HTTP_200_OK)
async def get_dataset_by_name(name: str) -> Dataset:
    """
    Retrieve dataset by name.

    Args:
    - **name (str)**: Dataset name

    Returns:
    - **Dataset**: Dataset
    """

    dataset = await Dataset.find_one(Dataset.dataset_name == name)
    if not dataset:
        raise dataset_not_found_exception()

    return dataset


@dataset_router.get("/name/{name}/version/{version}", response_model=Dataset, status_code=status.HTTP_200_OK)
async def get_dataset_by_name_and_version(name: str, version: str) -> Dataset:
    """
    Retrieve dataset by name and version.

    Args:
    - **name (str)**: Dataset name
    - **version (str)**: Dataset version

    Returns:
    - **Dataset**: Dataset
    """

    dataset = await Dataset.find_one(
        Dataset.dataset_name == name,
        Dataset.version == version
    )
    if not dataset:
        raise dataset_not_found_exception()

    return dataset


@dataset_router.get("/names/{name}", response_model=List[Dataset], status_code=status.HTTP_200_OK)
async def get_datasets_by_name(name: str) -> List[Dataset]:
    """
    Retrieve datasets by name.

    Args:
    - **name (str)**: Dataset name

    Returns:
    - **List[Dataset]**: List of datasets
    """

    datasets = await Dataset.find(Dataset.dataset_name == name).to_list()
    if not datasets:
        raise dataset_not_found_exception()

    return datasets


@dataset_router.get("/{id}", response_model=Dataset, status_code=status.HTTP_200_OK)
async def get_dataset(id: PydanticObjectId) -> Dataset:
    """
    Retrieve dataset by id.

    Args:
    - **id (PydanticObjectId)**: Dataset id

    Returns:
    - **Dataset**: Dataset
    """

    dataset = await Dataset.get(id)
    if not dataset:
        raise dataset_not_found_exception()
    return dataset


@dataset_router.post("/", response_model=Dataset, status_code=status.HTTP_201_CREATED)
async def create_dataset(dataset: Dataset) -> Dataset:
    """
    Create dataset.

    Args:
    - **dataset (Dataset)**: Dataset

    Returns:
    - **Dataset**: Dataset
    """
    is_unique = await is_name_and_version_unique(dataset.dataset_name, dataset.version)
    if not is_unique:
        raise dataset_name_and_version_not_unique_exception()

    await validate_path(dataset.path_to_dataset)

    dataset.created_at = datetime.now()
    dataset.updated_at = datetime.now()

    await dataset.insert()
    return dataset


@dataset_router.put("/{id}", response_model=Dataset, status_code=status.HTTP_200_OK)
async def update_dataset(id: PydanticObjectId, updated_dataset: UpdateDataset) -> Dataset:
    """
    Update dataset.

    Args:
    - **id (PydanticObjectId)**: Dataset id
    - **dataset (UpdateDataset)**: Dataset

    Returns:
    - **Dataset**: Dataset
    """

    dataset = await Dataset.get(id)
    if not dataset:
        raise dataset_not_found_exception()

    is_unique = await is_name_and_version_unique(updated_dataset.dataset_name, updated_dataset.version)
    if not is_unique:
        raise dataset_name_and_version_not_unique_exception()

    if updated_dataset.path_to_dataset:
        await validate_path(updated_dataset.path_to_dataset)

    updated_dataset.updated_at = datetime.now()

    if updated_dataset.dataset_name and updated_dataset.dataset_name != dataset.dataset_name:
        await update_linked_iterations(dataset, updated_dataset)

    await dataset.update({"$set": updated_dataset.dict(exclude_unset=True)})
    await dataset.save()

    return dataset


@dataset_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(id: PydanticObjectId):
    """
    Delete dataset.

    Args:
    - **id (PydanticObjectId)**: Dataset id

    Returns:
    - **None**
    """

    dataset = await Dataset.get(id)
    if not dataset:
        raise dataset_not_found_exception()

    await update_linked_iterations(dataset)

    await dataset.delete()

    return None


async def update_linked_iterations(dataset: Dataset, updated_dataset: Optional[Dataset] = None) -> None:
    """
    Util function to update linked iterations when dataset is deleted or when dataset name is updated.

    Args:
    - **dataset (Dataset)**: Dataset
    - **updated_dataset (Optional[Dataset])**: Updated dataset (optional, used when updating dataset name)

    Returns:
    - **None**
    """
    if dataset.linked_iterations:
        for iteration, value in dataset.linked_iterations.items():
            project_id = value[0]
            experiment_id = value[1]

            project = await Project.get(project_id)
            if not project:
                raise project_not_found_exception()
            experiment = next((exp for exp in project.experiments if exp.id == experiment_id), None)
            if not experiment:
                raise experiment_not_found_exception()
            iteration = next((iter for iter in experiment.iterations if iter.id == PydanticObjectId(iteration)), None)
            if not iteration:
                raise iteration_not_found_exception()

            if updated_dataset:
                iteration.dataset.name = updated_dataset.dataset_name
            else:
                iteration.dataset = None

            await project.save()


async def validate_path(value):
    """
    Util function to validate path or URL.

    Args:
    - **value**: Path or URL

    Returns:
    - **value**: Path or URL
    """
    if not isinstance(value, str):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid path or URL")

    if value.strip() == "":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Path or URL is empty. "
                                                                          "Please, enter path or URL.")

    # if value is not url type, just return it as it is
    if not validators.url(value):
        return value

    try:
        response = requests.get(value)
        if response.ok:
            return value
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="URL is not accessible or "
                                                                              "returns an error.")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid URL or unable to connect to "
                                                                          "the URL.")


async def is_name_and_version_unique(name: str, version: str) -> bool:
    """
    Util function for checking if dataset name and version are unique.

    Args:
        name: Dataset name to check.
        version: Dataset version to check.

    Returns:
        True if are unique, False otherwise.
    """

    dataset = await Dataset.find_one(
        Dataset.dataset_name == name,
        Dataset.version == version
    )
    if dataset:
        return False
    return True
