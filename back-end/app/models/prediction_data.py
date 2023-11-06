from datetime import datetime
from typing import Union
from beanie import PydanticObjectId
from pydantic import BaseModel, Field


class PredictionData(BaseModel):
    """
    Prediction data model.

    Attributes:
    - **prediction_date (datetime)**: Prediction date.
    - **input_data (dict)**: Input data.
    - **prediction (Union[float, int])**: Prediction.
    """
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    prediction_date: datetime = Field(default_factory=datetime.now)
    input_data: dict
    prediction: Union[float, int]

    def __repr__(self) -> str:
        return f"<PredictionData {self.prediction_date} {self.input_data} {self.prediction}>"

    def __str__(self) -> str:
        return f"{self.prediction_date} {self.input_data} {self.prediction}"

    def __hash__(self) -> int:
        return hash(self.prediction_date)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, PredictionData):
            return self.id == other.id
        return False

    class Settings:
        name = "PredictionData"
