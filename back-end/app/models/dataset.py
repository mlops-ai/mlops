import os
from datetime import datetime
from typing import Optional, Union
from pathlib import Path
from beanie import Document, Replace, Insert, before_event
from pydantic import Field, HttpUrl, validator
import requests


class Dataset(Document):
    dataset_name: str = Field(..., description="Dataset name", min_length=1, max_length=40)
    path_to_dataset: str = Field(default='', description="Path to dataset")
    dataset_description: Optional[str] = Field(default='', description="Dataset description", max_length=150)
    dataset_problem_type: Optional[str] = Field(default='', description="Dataset problem type")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)
    version: Optional[str] = Field(default='', description="Dataset version")

    @validator('path_to_dataset')
    def validate_path(cls, value):
        if isinstance(value, str):
            if not value:
                raise ValueError("Path or URL is empty. Please, enter path or URL.")
            if os.path.isfile(r'{}'.format(value)):
                return value
            else:
                os.chdir('/')
                if os.path.isfile(r'{}'.format(value)):
                    return value
            try:
                response = requests.head(value)
                if response.ok:
                    return value
                else:
                    raise ValueError("URL is not accessible or returns an error.")
            except requests.exceptions.RequestException:
                raise ValueError("Invalid URL or unable to connect to the URL.")
        raise ValueError("Invalid path or URL")

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

    @before_event([Insert, Replace])
    def update_updated_at(self):
        self.updated_at = datetime.now()

    class Settings:
        name = "dataset"

    class Config:
        schema_extra = {
            "example": {
                "dataset_name": "Titanic",
                "path_to_dataset": "https://www.kaggle.com/c/titanic/download/train.csv",
                "dataset_description": "Titanic dataset",
                "dataset_problem_type": "Classification",
                "version": "1.0.0"
            }
        }


class UpdateDataset(Dataset):
    dataset_name: Optional[str]
    path_to_dataset: Optional[Union[str, HttpUrl, Path]]
    dataset_description: Optional[str]
    dataset_problem_type: Optional[str]
    version: Optional[str]
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        schema_extra = {
            "example": {
                "dataset_name": "Titanic",
                "path_to_dataset": "https://www.kaggle.com/c/titanic/download/train.csv",
                "dataset_description": "Titanic dataset",
                "dataset_problem_type": "Classification",
                "version": "1.0.0"
            }
        }