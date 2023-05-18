from pydantic import BaseModel, Field, validator, root_validator
from beanie import PydanticObjectId
from typing import List, Optional
from fastapi import HTTPException, status


class InteractiveChart(BaseModel):
    """
    Interactive chart model.

    Attributes:
    - **id (PydanticObjectId)**: Chart id.
    - **chart_name (str)**: Chart name.
    - **chart_type (str)**: Chart type.
    - **x_data(List[float])**: X data.
    - **y_data (List[float])**: Y data.
    - **x_label (Optional[str])**: X label.
    - **y_label (Optional[str])**: Y label.
    """

    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    chart_name: str = Field(..., description="Chart name", min_length=1, max_length=100)
    chart_type: str = Field(..., description="Chart type", min_length=1, max_length=100)
    x_data: List[float] = Field(..., description="X axis data")
    y_data: List[float] = Field(..., description="Y axis data")
    x_label: Optional[str] = Field(default="x", description="X label", min_length=1, max_length=100)
    y_label: Optional[str] = Field(default="y", description="Y label", min_length=1, max_length=100)

    @validator('chart_type')
    def validate_status(cls, v):
        chart_types = ['scatter', 'line', 'bar', 'pie', 'candlestick', 'heatmap', 'boxplot', 'histogram']
        if v not in chart_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status must be one of {chart_types}"
            )
        return v

    @root_validator()
    def validate_data_length(cls, values):
        chart_type = values.get('chart_type', '')
        if chart_type in ['scatter', 'line', 'bar', 'candlestick', 'heatmap', 'boxplot', 'histogram']:
            if len(values.get('x_data', [])) != len(values.get('y_data', [])):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Number of x_data and y_data must be the same for the selected chart type"
                )
        return values

    def __repr__(self) -> str:
        return f"<Interactive Chart {self.chart_name}>"

    def __str__(self) -> str:
        return self.chart_name

    def __hash__(self) -> int:
        return hash(self.chart_name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, InteractiveChart):
            return self.id == other.id
        return False

    class Settings:
        name = "InteractiveChart"

    class Config:
        schema_extra = {
            "example": {
                "chart_name": "Chart name",
                "chart_type": "Chart type",
                "x_data": [1, 2, 3],
                "y_data": [1, 2, 3],
                "x_label": "X label",
                "y_label": "Y label"
            }
        }
