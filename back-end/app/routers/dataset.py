from datetime import datetime
from typing import List

from fastapi import APIRouter, status
from beanie import PydanticObjectId, Link

from app.models.dataset import Dataset, UpdateDataset
from app.models.project import Project

from app.routers.exceptions.dataset import dataset_not_found_exception

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
    print(datasets)

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


@dataset_router.post("/", response_model=Dataset, status_code=status.HTTP_201_CREATED)
async def create_dataset(dataset: Dataset) -> Dataset:
    """
    Create dataset.

    Args:
    - **dataset (Dataset)**: Dataset

    Returns:
    - **Dataset**: Dataset
    """

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

    updated_dataset.updated_at = datetime.now()

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

    # target_projects = await Project.find_all("experiments.iterations.dataset" == dataset.id).to_list()
    #
    # for project in target_projects:
    #     for experiment in project.experiments:
    #         for iteration in experiment.iterations:
    #             if iteration.dataset == dataset:
    #                 iteration.dataset = None
    #
    #     await project.save()

    await dataset.delete()

    return None
