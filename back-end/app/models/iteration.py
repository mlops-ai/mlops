import os
import getpass
from pydantic import Field, BaseModel, validator
from datetime import datetime
from typing import Optional
from beanie import PydanticObjectId


class Iteration(BaseModel):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    user_name: str = Field(default=getpass.getuser(), description="User name")
    iteration_name: str = Field(..., description="Iteration title", min_length=1, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)
    metrics: Optional[dict] = Field(default=None, description="Iteration metrics")
    parameters: Optional[dict] = Field(default=None, description="Iteration parameters")
    path_to_model: Optional[str] = Field(default='', description="Path to model")
    model_name: Optional[str] = Field(default=None, description="Model name", min_length=1, max_length=100)

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
                "model_name": "model"
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
