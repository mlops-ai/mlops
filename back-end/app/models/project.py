from beanie import Document
from pydantic import Field
from typing import Optional, List
from datetime import datetime

from app.models.experiment import Experiment


class Project(Document):
    title: str = Field(..., description="Project title", min_length=1, max_length=40)
    # description?
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    experiments: List[Experiment] = []  # TODO: List[Experiment]

    def __repr__(self) -> str:
        return f"<Project {self.title}>"

    def __str__(self) -> str:
        return self.title

    def __hash__(self) -> int:
        return hash(self.title)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Project):
            return self.id == other.id
        return False

    class Settings:
        name = "project"

    class Config:
        schema_extra = {
            "example": {
                "title": "Titanic",
                "created_at": datetime.now()
            }
        }
