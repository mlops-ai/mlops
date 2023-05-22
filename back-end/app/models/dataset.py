from datetime import datetime
from typing import Optional, Union, Dict
from pathlib import Path
from beanie import Document
from pydantic import Field, HttpUrl


class Dataset(Document):
    """
    Dataset model

    Attributes:
    -----------
    - **id** dataset_name (str): Dataset name
    - **path_to_dataset** (str): Path to dataset
    - **dataset_description** (str): Dataset description
    - **tags** (str): Dataset tags
    - **archived** (bool): Dataset status
    - **created_at** (datetime): Date and time of dataset creation
    - **updated_at** (datetime): Date and time of dataset update
    - **version** (str): Dataset version
    - **linked_iterations** (Dict): Linked iterations (key - iteration id, value - (project_id, experiment_id)
    """

    dataset_name: str = Field(description="Dataset name", min_length=1, max_length=40)
    path_to_dataset: str = Field(default='', description="Path to dataset")
    dataset_description: Optional[str] = Field(default='', description="Dataset description", max_length=150)
    tags: Optional[str] = Field(default='', description="Dataset tags")
    archived: bool = Field(default=False, description="Dataset status")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)
    version: Optional[str] = Field(default='', description="Dataset version")
    linked_iterations: Optional[Dict] = Field(default_factory=dict, description="Linked iterations")

    def __repr__(self) -> str:
        return f"<Dataset {self.dataset_name}>"

    def __str__(self) -> str:
        return self.dataset_name

    def __hash__(self) -> int:
        return hash(self.dataset_name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Dataset):
            return self.id == other.id
        return False

    class Settings:
        name = "dataset"

    class Config:
        schema_extra = {
            "example": {
                "dataset_name": "Titanic",
                "path_to_dataset": "https://www.kaggle.com/c/titanic/download/train.csv",
                "dataset_description": "Titanic dataset",
                "tags": "Classification, Titanic",
                "archived": False,
                "version": "1.0.0"
            }
        }


class UpdateDataset(Dataset):
    """
    Dataset model for update

    Attributes:
    - **dataset_name (str)**: Dataset name
    - **path_to_dataset (str)**: Path to dataset
    - **dataset_description (str)**: Dataset description
    - **tags (str)**: Dataset tags
    - **archived (bool)**: Dataset status
    - **version (str)**: Dataset version
    - **updated_at (datetime)**: Date and time of dataset update
    """

    dataset_name: Optional[str]
    path_to_dataset: Optional[Union[str, HttpUrl, Path]]
    dataset_description: Optional[str]
    tags: Optional[str]
    archived: Optional[bool]
    version: Optional[str]
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        schema_extra = {
            "example": {
                "dataset_name": "Titanic",
                "path_to_dataset": "https://www.kaggle.com/c/titanic/download/train.csv",
                "dataset_description": "Titanic dataset",
                "tags": "Classification, Titanic",
                "archived": False,
                "version": "1.0.0"
            }
        }