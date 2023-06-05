from pydantic import BaseModel, Field, validator, root_validator
from beanie import PydanticObjectId
from typing import List, Optional
from fastapi import HTTPException, status


class InteractiveChart(BaseModel):
    """
    Interactive chart model.

    Attributes:
    - **id (PydanticObjectId)**: Chart id.
    - **chart_type (str)**: Chart type.
    - **name (str)**: Logical name of chart.
    - **chart_title (str)**: Chart title.
    - **chart_subtitle (Optional[str])**: Chart subtitle.
    - **x_data(List[float])**: X data.
    - **y_data (List[float])**: Y data.
    - **y_data_names (Optional[List[str]])**: Y data names.
    - **x_label (Optional[str])**: X label.
    - **y_label (Optional[str])**: Y label.
    - **x_min (Optional[float])**: X axis minimum value.
    - **x_max (Optional[float])**: X axis maximum value.
    - **y_min (Optional[float])**: Y axis minimum value.
    - **y_max (Optional[float])**: Y axis maximum value.
    - **comparable (Optional[bool])**: Is comparable.
    """

    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="id")
    chart_type: str = Field(description="Chart type", min_length=1, max_length=100)
    name: str = Field(description="Logical name of chart", min_length=1, max_length=100)
    chart_title: str = Field(description="Chart title", min_length=1, max_length=100)
    chart_subtitle: Optional[str] = Field(description="Chart subtitle", min_length=1, max_length=100)
    x_data: List[List] = Field(description="X axis data")
    y_data: List[List] = Field(description="Y axis data")
    y_data_names: Optional[List[str]] = Field(default=[], description="Y axis data names")
    x_label: Optional[str] = Field(default="x", description="X label", min_length=1, max_length=100)
    y_label: Optional[str] = Field(default="y", description="Y label", min_length=1, max_length=100)
    x_min: Optional[float] = Field(default=None, description="X axis minimum value")
    x_max: Optional[float] = Field(default=None, description="X axis maximum value")
    y_min: Optional[float] = Field(default=None, description="Y axis minimum value")
    y_max: Optional[float] = Field(default=None, description="Y axis maximum value")
    comparable: Optional[bool] = Field(default=False, description="Is comparable")

    @validator('chart_type')
    def validate_status(cls, v):
        if v not in cls.Settings.chart_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status must be one of {cls.Settings.chart_types}"
            )
        return v

    @root_validator()
    def validate_data(cls, values):
        chart_type = values.get('chart_type', '')
        x_data_list = values.get('x_data', [])
        y_data_list = values.get('y_data', [])

        if chart_type in ['scatter', 'line']:
            if not check_nested_data_type(x_data_list) or not check_nested_data_type(y_data_list):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="x_data and y_data must be a list of lists of float or int"
                )
            if len(x_data_list) == 1 and len(y_data_list) > 1:
                for y_data in y_data_list:
                    if len(x_data_list[0]) != len(y_data):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Length of x_data and y_data must be equal"
                        )
            else:
                for x_data, y_data in zip(x_data_list, y_data_list):
                    if len(x_data) != len(y_data):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Length of x_data and y_data must be equal"
                        )
        elif chart_type == 'bar':
            if len(x_data_list) != 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="x_data can only have one list of data"
                )
            for y_data in y_data_list:
                if len(x_data_list[0]) != len(y_data):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Length of x_data and y_data must be equal"
                    )
        elif chart_type == 'pie':
            if len(x_data_list) != 1 or len(y_data_list) != 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="x_data and y_data can only have one list of data"
                )
            if len(x_data_list[0]) != len(y_data_list[0]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Length of x_data and y_data must be equal"
                )
        elif chart_type == 'boxplot':
            if len(x_data_list) != 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="x_data can only have one list of data"
                )
            if len(x_data_list[0]) != len(y_data_list):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Error: For each element in x_data, there must be a list of y_data"
                )
            if any(len(y_data) != 5 for y_data in y_data_list):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Length of y_data must contain 5 values: min, q1, median, q3, max"
                )

        y_data_names = values.get('y_data_names', [])
        if len(y_data_names):
            if len(y_data_names) != len(y_data_list):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Length of y_data_names and y_data must be equal"
                )

        return values

    def __repr__(self) -> str:
        return f"<Interactive Chart {self.chart_title}>"

    def __str__(self) -> str:
        return self.chart_title

    def __hash__(self) -> int:
        return hash(self.chart_title)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, InteractiveChart):
            return self.id == other.id
        return False

    class Settings:
        name = "InteractiveChart"
        chart_types = ['scatter', 'line', 'bar', 'pie', 'boxplot']

    class Config:
        schema_extra = {
            "example": {
                "name": "Chart name used for logical identification",
                "chart_title": "Chart title",
                "chart_type": "Chart type",
                "x_data": [[1, 2, 3]],
                "y_data": [[1, 2, 3]],
                "y_data_names": ["Y data name 1", "Y data name 2", "Y data name 3"],
                "x_label": "X label",
                "y_label": "Y label",
                "x_min": 0,
                "x_max": 10,
                "y_min": 0,
                "y_max": 10,
                "comparable": False
            }
        }


def check_nested_data_type(data_list):
    return all(isinstance(value, (float, int)) for sublist in data_list for value in sublist)
