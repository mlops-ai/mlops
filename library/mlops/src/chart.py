

class Chart:
    """
    Class for handling plots inside library
    """
    def __init__(self, chart_name: str, chart_type: str, chart_title: str, chart_subtitle: str = None,  x_data: list = [list],
                 y_data: list = [list], y_data_names: [str] = [], x_label: str = "x", y_label: str = "y",
                 x_min: float = None, x_max: float = None, y_min: float = None, y_max: float = None, comparable: bool = False):
        """
        Interactive chart model.

        Attributes:
        - **id (PydanticObjectId)**: Chart id.
        - **chart_name (str)**: Chart name.
        - **chart_type (str)**: Chart type.
        - **x_data(List[float])**: X data.
        - **y_data (List[float])**: Y data.
        - **y_data_names (List[str])**: List of y data names
        - **x_label (Optional[str])**: X label.
        - **y_label (Optional[str])**: Y label.
        - **x_min (Optional float)**: Minimal value of x.
        - **y_min (Optional float)**: Minimal value of y.
        - **x_max (Optional float)**: Maximum value of x.
        - **y_max (Optional float)**: Maximum value of y.
        - **comperable (Optional bool)**: Determines whether chart can be compared with other charts
        """

        self.chart_name = chart_name
        self.chart_title = chart_title
        self.chart_subtitle = chart_subtitle
        self.chart_type = chart_type
        self.x_data = x_data
        self.y_data = y_data
        self.y_data_names = y_data_names
        self.x_label = x_label
        self.y_label = y_label
        self.x_min = x_min
        self.x_max = x_max
        self.y_min = y_min
        self.y_max = y_max
        self.comparable = comparable

    def get_chart_dictionary(self):
        chart_dictionary = {
            "name": self.chart_name,
            "chart_title": self.chart_title,
            "chart_subtitle": self.chart_subtitle,
            "chart_type": self.chart_type,
            "x_data": self.x_data,
            "y_data": self.y_data,
            "y_data_names": self.y_data_names,
            "x_label": self.x_label,
            "y_label": self.y_label,
            "x_min": self.x_min,
            "x_max": self.x_max,
            "y_min": self.y_min,
            "y_max": self.y_max,
            "comparable": self.comparable
        }

        return chart_dictionary
