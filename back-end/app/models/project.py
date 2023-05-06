from beanie import Document, before_event, Replace, Insert
from pydantic import Field, validator
from typing import Optional, List
from datetime import datetime
from fastapi import HTTPException, status

from app.models.experiment import Experiment


class Project(Document):
    title: str = Field(description="Project title", min_length=1, max_length=40)
    description: Optional[str] = Field(default="", description="Project description", max_length=150)
    status: str = Field(default='not_started', description="Project status")
    archived: bool = Field(default=False, description="Project status")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    experiments: List[Experiment] = []

    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['not_started', 'in_progress', 'completed']
        if v not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status must be one of {valid_statuses}"
            )
        return v

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

    @before_event([Insert, Replace])
    def update_updated_at(self):
        self.updated_at = datetime.now()

    class Settings:
        name = "project"

    class Config:
        schema_extra = {
            "example": {
                "title": "Titanic",
                "created_at": datetime.now()
            }
        }


class UpdateProject(Project):
    title: Optional[str]
    description: Optional[str]
    status: Optional[str]
    archived: Optional[bool]
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        schema_extra = {
            "example": {
                "title": "Titanic",
                "description": "Titanic dataset",
                "status": "not_started",
                "archived": False
            }
        }