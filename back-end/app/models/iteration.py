import os
import getpass
from pydantic import Field, BaseModel, validator
from datetime import datetime
from typing import Optional, Dict
from beanie import PydanticObjectId
from app.models.dataset import Dataset


class DatasetInIteration(BaseModel):
    id: PydanticObjectId
    name: Optional[str] = None


class Iteration(BaseModel):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    experiment_id: PydanticObjectId = Field(default=None,  alias="experiment_id")
    project_id: PydanticObjectId = Field(default=None, alias="project_id")
    experiment_name: str = Field(default=None, description="Experiment name", min_length=1, max_length=40)
    project_title: str = Field(default=None, description="Project title", min_length=1, max_length=40)
    user_name: str = Field(default=getpass.getuser(), description="User name")
    iteration_name: str = Field(..., description="Iteration title", min_length=1, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)
    metrics: Optional[dict] = Field(default=None, description="Iteration metrics")
    parameters: Optional[dict] = Field(default=None, description="Iteration parameters")
    path_to_model: Optional[str] = Field(default='', description="Path to model")
    model_name: Optional[str] = Field(default=None, description="Model name", min_length=1, max_length=100)
    dataset: Optional[DatasetInIteration] = Field(default=None, description="Dataset")

    @validator('path_to_model')
    def path_to_model_exists(cls, path):
        if not path:
            return path
        path = r'{}'.format(path)
        if os.path.isfile(path):
            return path
        else:
            # Change the current working directory to the root directory
            os.chdir('/')
            if os.path.isfile(path):
                return path
            else:
                raise ValueError('File does not exist')

    def __repr__(self) -> str:
        return f"<Iteration {self.iteration_name}>"

    def __str__(self) -> str:
        return self.iteration_name

    def __hash__(self) -> int:
        return hash(self.iteration_name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Iteration):
            return self.id == other.id
        return False

    class Settings:
        name = "iteration"

    class Config:
        schema_extra = {
            "example": {
                "user_name": getpass.getuser(),
                "iteration_name": "Iteration 1",
                "metrics": {"accuracy": 0.9},
                "parameters": {"batch_size": 32},
                "path_to_model": "model.pkl",
                "model_name": "model",
                "dataset": {
                    "id": "5f9b3b7e9c9d6c0a3c7b3b7e",
                    "name": "Dataset Titanic"
                }
            }
        }


class UpdateIteration(Iteration):
    iteration_name: Optional[str]

    class Config:
        schema_extra = {
                    "example": {
                        "iteration_name": "New name"
                    }
                }
