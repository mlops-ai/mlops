from pydantic import BaseModel, Field, validator
from beanie import PydanticObjectId
from typing import Optional, List
from fastapi import HTTPException, status


class MonitoredModelInteractiveChart(BaseModel):
    """
    Interactive chart model for monitored models.

    Attributes:
    - **id (PydanticObjectId)**: Interactive chart id.
    - **monitored_model_id (PydanticObjectId)**: Monitored model id.
    - **chart_type (str)**: Chart type.
    - **x_axis_column (str)**: X axis column.
    - **second_column (Optional[List[str]])**: List of columns for Y axis.
    - **bin_method (Optional[str])**: Bin method.
    - **bin_number (Optional[int])**: Bin number.
    """
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    monitored_model_id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="monitored_model_id")
    chart_type: str = Field(description="Chart type", min_length=1, max_length=100)
    x_axis_column: Optional[str] = Field(default=None, description="X axis column", min_length=1, max_length=100)
    y_axis_columns: Optional[List[str]] = Field(default=None, description="List of columns for y axis", min_length=1, max_length=100)
    bin_method: Optional[str] = Field(default=None, description="Bin method", min_length=1, max_length=100)
    bin_number: Optional[int] = Field(default=None, description="Bin number")
    metrics: Optional[List[str]] = Field(default=None, description="List of metrics for regression and classification", min_length=1, max_length=100)

    @validator('chart_type')
    def validate_chart_type(cls, v):
        if v not in cls.Settings.chart_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Chart type must be one of {cls.Settings.chart_types}"
            )
        return v

    def __repr__(self):
        return f"<MonitoredModelInteractiveChart {self.id}>"

    def __str__(self) -> str:
        return self.chart_type

    def __hash__(self) -> int:
        return hash(self.chart_type)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, MonitoredModelInteractiveChart):
            return self.id == other.id
        return False

    class Settings:
        name = "MonitoredModelInteractiveChart"
        chart_types = ["histogram", "countplot", "scatter", "scatter_with_histograms", "timeseries",
                       "regression_metrics", "classification_metrics", "confusion_matrix"]
        bin_methods = ["squareRoot", "scott", "freedmanDiaconis", "sturges", "fixedNumber"]
        metrics = {
            "regression": ["r2", "mae", "mse", "rmse", "medae", "msle", "rmsle", "smape"],
            "classification": ["accuracy", "precision", "recall", "f1score", "mmc"]
        }

    class Config:
        schema_extra = {
            "example": {
                "chart_type": "histogram",
                "first_column": "x",
                "second_column": "y",
                "bin_method": "squareRoot",
                "bin_number": 10
            }
        }
