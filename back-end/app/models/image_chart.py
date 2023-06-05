from pydantic import BaseModel, Field, validator
from beanie import PydanticObjectId
from typing import Optional


class ImageChart(BaseModel):
    """
    Class for storing image charts.

    Attributes:
    - **id (PydanticObjectId)**: Chart id.
    - **name (str)**: Chart name.
    - **encoded_image (str)**: base64 encoded chart image.
    - **comparable (Optional[bool])**: Is chart comparable.
    """

    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    name: str = Field(description="Chart name", min_length=1, max_length=100)
    encoded_image: str = Field(description="base64 encoded chart image")
    comparable: Optional[bool] = Field(default=True, description="Is chart comparable")

    def __repr__(self) -> str:
        return f"<Image Chart {self.name}>"

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, ImageChart):
            return self.id == other.id
        return False

    class Settings:
        name = "ImageChart"

    class Config:
        schema_extra = {
            "example": {
                "name": "Image chart v1",
                "encoded_image": "..."
            }
        }
