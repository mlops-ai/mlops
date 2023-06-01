

class Chart:
    """
    Class for handling plots inside library
    """
    def __init__(self, chart_name: str, chart_type: str, x_data: list = [float], y_data: list = [float], x_label: str = None, y_label: str = None):
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
        self.chart_name = chart_name
        self.chart_type = chart_type
        self.x_data = x_data
        self.y_data = y_data
        self.x_label = x_label
        self.y_label = y_label

    def get_chart_dictionary(self):
        chart_dictionary = {
            "chart_name": self.chart_name,
            "chart_type": self.chart_type,
            "x_data": self.x_data,
            "y_data": self.y_data,
            "x_axis_name": self.x_label,
            "y_axis_name": self.y_label
        }

        return chart_dictionary
