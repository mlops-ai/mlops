import getpass
from pydantic import Field, BaseModel
from datetime import datetime
from typing import Optional, List
from beanie import PydanticObjectId
from app.models.chart import InteractiveChart
from app.models.image_chart import ImageChart


class DatasetInIteration(BaseModel):
    """
    Dataset in iteration model.

    Attributes:
    - **id (PydanticObjectId)**: Dataset id.
    - **name (Optional[str])**: Dataset name.
    - **version (Optional[str])**: Dataset version.
    """
    id: PydanticObjectId = Field(..., description="Dataset id")
    name: Optional[str] = Field(default=None, description="Dataset name")
    version: Optional[str] = Field(default=None, description="Dataset version")


class Iteration(BaseModel):
    """
    Iteration model.

    Attributes:
    - **id (PydanticObjectId)**: Iteration id.
    - **experiment_id (PydanticObjectId)**: Experiment id.
    - **project_id (PydanticObjectId)**: Project id.
    - **experiment_name (str)**: Experiment name.
    - **project_title (str)**: Project title.
    - **user_name (str)**: Username.
    - **iteration_name (str)**: Iteration title.
    - **created_at (datetime)**: Iteration creation date.
    - **metrics (Optional[dict])**: Iteration metrics.
    - **parameters (Optional[dict])**: Iteration parameters.
    - **path_to_model (Optional[str])**: Path to model.
    - **dataset (Optional[DatasetInIteration])**: Dataset.
    - **interactive_charts (Optional[List[InteractiveChart]])**: Interactive charts list.
    - **image_charts (Optional[List[ImageChart]])**: Image charts list.
    - **assigned_monitored_model_id (Optional[PydanticObjectId])**: Assigned monitored model id.
    """

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
    dataset: Optional[DatasetInIteration] = Field(default=None, description="Dataset")
    interactive_charts: Optional[List[InteractiveChart]] = Field(default=[], description="Interactive charts list")
    image_charts: Optional[List[ImageChart]] = Field(default=[], description="Image charts list")
    assigned_monitored_model_id: Optional[PydanticObjectId] = Field(default=None, alias="assigned_monitored_model_id")

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
                "dataset": {
                    "id": "5f9b3b7e9c9d6c0a3c7b3b7e"
                },
                "interactive_charts": [
                    {
                        "name": "Chart name used for logical identification",
                        "chart_title": "Chart title",
                        "chart_type": "scatter",
                        "x_data": [[1, 2, 3]],
                        "y_data": [[1, 2, 3]],
                        "x_label": "X label",
                        "y_label": "Y label",
                        "comparable": False
                    }
                ],
                "image_charts": [
                    {
                        "name": "Chart 1",
                        "encoded_image": "..."
                    }
                ]
            }
        }


class UpdateIteration(Iteration):
    """
    Update iteration model.

    Attributes:
    - **iteration_name (str)**: Iteration title.
    """

    iteration_name: Optional[str]
    assigned_monitored_model_id: Optional[PydanticObjectId]

    class Config:
        schema_extra = {
                    "example": {
                        "iteration_name": "New name",
                        "assigned_monitored_model_id": "5f9b3b7e9c9d6c0a3c7b3b7e"
                    }
                }
