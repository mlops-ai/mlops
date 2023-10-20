import getpass
from pydantic import Field, validator
from typing import Optional
from beanie import Document
from fastapi import HTTPException, status

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
    - **ml_model (object)**: ML model. ---- TODO: add coded pkl file
    """

    model_name: str = Field(default=None, description="Model name", min_length=1, max_length=100)
    model_description: Optional[str] = Field(default="", description="Model description", max_length=150)
    model_status: str = Field(default='idle', description="Model status")
    iteration: Optional[Iteration] = Field(default=None, description="Iteration")
    #ml_model: Optional[str] = Field(default=None, description="path to model")

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
                    "model_name": "model",
                    "image_charts": [
                        {
                            "name": "Chart 1",
                            "encoded_image": "..."
                        }
                    ]
                }
            }
        }
