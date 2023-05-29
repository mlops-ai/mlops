from pydantic import BaseModel, Field, validator
from beanie import PydanticObjectId
from typing import Optional
import os
import base64

from app.routers.exceptions.image_chart import image_path_not_exist_exception


class ImageChart(BaseModel):
    """
    Class for storing image charts.

    Attributes:
    - **id (PydanticObjectId)**: Chart id.
    - **name (str)**: Chart name.
    - **image_path (str)**: Path to the dataset
    - **encoded_image (str)**: base64 encoded chart image
    """

    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    name: str = Field(description="Chart name", min_length=1, max_length=100)
    image_path: str = Field(description="Path to the encoded image")
    encoded_image: Optional[str] = Field(default="", description="base64 encoded chart image")

    @validator('image_path')
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
                raise image_path_not_exist_exception()

    def encode_image_from_path(self):
        """
        Function for encoding image into base64 from provided image path.

        Returns:
            None
        """
        with open(self.image_path, "rb") as image_file:
            self.encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

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
                "image_path": "image.jpg",
            }
        }
