from pydantic import Field, BaseModel
from datetime import datetime
from typing import Optional, List
from beanie import PydanticObjectId
from app.models.iteration import Iteration


class Experiment(BaseModel):
    """
    Experiment model.

    Attributes:
    - **id (PydanticObjectId)**: Experiment ID.
    - **project_id (PydanticObjectId)**: Project ID.
    - **name (str)**: Experiment title.
    - **description (Optional[str])**: Experiment description.
    - **created_at (datetime)**: Experiment creation date.
    - **updated_at (Optional[datetime])**: Experiment last update date.
    - **iterations (List[Iteration])**: Experiment iterations.
    - **columns_metadata (dict)**: Experiment's iterations columns metadata.
    """

    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    project_id: PydanticObjectId = Field(default=None, alias="project_id")
    name: str = Field(..., description="Experiment title", min_length=1, max_length=40)
    description: Optional[str] = Field(default="", description="Experiment description", max_length=600)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)
    iterations: List[Iteration] = []
    columns_metadata: dict = {}

    def __repr__(self) -> str:
        return f"<Experiment {self.name}>"

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Experiment):
            return self.id == other.id
        return False

    class Settings:
        name = "experiment"

    class Config:
        schema_extra = {
            "example": {
                "name": "Is the passenger survived?",
                "description": "Predicting if the passenger survived the Titanic disaster."
            }
        }


class UpdateExperiment(Experiment):
    """
    Update experiment model.

    Attributes:
    - **name (Optional[str])**: Experiment title.
    - **description (Optional[str])**: Experiment description.
    - **updated_at (datetime)**: Experiment last update date.
    """

    name: Optional[str]
    description: Optional[str]
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        schema_extra = {
            "example": {
                "name": "Is the passenger survived?",
                "description": "Predicting if the passenger survived the Titanic disaster."
            }
        }
