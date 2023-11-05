import getpass
import pickle

from pydantic import Field, validator
from typing import Optional
from beanie import Document
from fastapi import HTTPException, status
from datetime import datetime

from app.models.iteration import Iteration


class MonitoredModel(Document):
    """
    Monitored model.

    Attributes:
    - **id (PydanticObjectId)**: Monitored model id.
    - **model_name (str)**: Monitored model name.
    - **model_description (str)**: Monitored model description.
    - **model_status (str)**: Monitored model status.
    - **iteration (Iteration)**: Related Iteration.
    - **pinned (bool)**: Monitored model pinned status.
    - **predictions_data (list[dict])**: Predictions data list of rows as dicts.
    - **ml_model (str)**: ML model
    - **created_at (datetime)**: Monitored model creation date.
    - **updated_at (datetime)**: Monitored model last update date.
    """
    model_name: str = Field(description="Model name", min_length=1, max_length=100)
    model_description: Optional[str] = Field(default="", description="Model description", max_length=600)
    model_status: str = Field(default='idle', description="Model status")
    iteration: Optional[Iteration] = Field(default=None, description="Iteration")
    pinned: bool = Field(default=False, description="Model pinned status")
    predictions_data: Optional[list[dict]] = Field(default=[], description="Predictions data")
    ml_model: Optional[str] = Field(default=None, description="Loaded ml model")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @validator('model_status')
    def validate_status(cls, v):
        if v not in cls.Settings.valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status must be one of {cls.Settings.valid_statuses}"
            )
        return v

    def __repr__(self) -> str:
        return f"<Monitored model {self.model_name}>"

    def __str__(self) -> str:
        return self.model_name

    def __hash__(self) -> int:
        return hash(self.model_name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, MonitoredModel):
            return self.id == other.id
        return False

    class Settings:
        name = "monitored_model"
        valid_statuses = ['active', 'idle', 'archived']

    class Config:
        schema_extra = {
            "example": {
                "model_name": "Approximate value of the plot",
                "model_description": "Predicting approximate value of the plot based on given parameters",
                "model_status": "active",
                "iteration": {
                    "id": "5f9b3b7e9c9d6c0a3c7b3b7e",
                    "experiment_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
                    "project_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
                    "experiment_name": "Experiment 1",
                    "project_title": "Project 1",
                    "user_name": getpass.getuser(),
                    "iteration_name": "Iteration 1",
                    "path_to_model": "model.pkl",
                    "image_charts": [
                        {
                            "name": "Chart 1",
                            "encoded_image": "..."
                        }
                    ]
                },
                "pinned": False,
                "predictions_data": []
            }
        }


class UpdateMonitoredModel(MonitoredModel):
    """
    Class for update monitored model.

    Attributes:
    - **model_name (str)**: Monitored model name.
    - **model_description (str)**: Monitored model description.
    - **model_status (str)**: Monitored model status.
    - **iteration (Iteration)**: Related Iteration.
    - **pinned (bool)**: Monitored model pinned status.
    - **predictions_data (list[dict])**: Predictions data list of rows as dicts.
    - **updated_at (datetime)**: Monitored model last update date.
    """
    model_name: Optional[str]
    model_description: Optional[str]
    model_status: Optional[str]
    iteration: Optional[Iteration]
    pinned: Optional[bool]
    predictions_data: Optional[list[dict]]
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        schema_extra = {
            "example": {
                "model_name": "Titanic",
                "model_description": "Titanic model",
                "model_status": "archived",
                "iteration": {
                    "id": "5f9b3b7e9c9d6c0a3c7b3b7e",
                    "experiment_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
                    "project_id": "5f9b3b7e9c9d6c0a3c7b3b7e",
                    "experiment_name": "Experiment 1",
                    "project_title": "Project 1",
                    "user_name": getpass.getuser(),
                    "iteration_name": "Iteration 1",
                    "path_to_model": "model.pkl",
                    "image_charts": [
                        {
                            "name": "Chart 1",
                            "encoded_image": "..."
                        }
                    ]
                },
                "pinned": False,
                "predictions_data": []
            }
        }
