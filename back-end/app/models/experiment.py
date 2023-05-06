from pydantic import Field, BaseModel
from datetime import datetime
from typing import Optional, List
from beanie import PydanticObjectId
from app.models.iteration import Iteration


class Experiment(BaseModel):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    name: str = Field(..., description="Experiment title", min_length=1, max_length=40)
    description: Optional[str] = Field(default="", description="Experiment description", max_length=150)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)
    iterations: List[Iteration] = []

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
                "description": "Predicting if the passenger survived the Titanic disaster.",
                "created_at": datetime.now()
            }
        }


class UpdateExperiment(Experiment):
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
