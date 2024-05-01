import os
import base64
import pickle
from pathlib import Path

import requests

from mlops.config.config import settings
from mlops.src.chart import Chart
from mlops.src.mailgun import MailGun
from mlops.exceptions.tracking import request_failed_exception
from mlops.exceptions.iteration import (
    iteration_request_failed_exception,
    model_path_not_exist_exception, monitored_model_encoding_pkl_file_exception
)


class Iteration:
    """
    Class for logging iteration data.
    """

    def __init__(
            self, iteration_name: str,
            project_id: str = None,
            experiment_id: str = None,
            send_email: bool = False
    ):
        self.iteration_name: str = iteration_name
        self.project_id: str = project_id
        self.experiment_id: str = experiment_id
        self.user_name: str = settings.user_name
        self.send_email: bool = send_email
        self.path_to_model: str = ''
        self.encoded_ml_model: str = None
        self.parameters: dict = {}
        self.metrics: dict = {}
        self.dataset_id: str = None
        self.charts: list = []
        self.dataset_name: str = None
        self.has_dataset: bool = False
        self.image_charts: list = []

    def format_path(self):
        self.path_to_model = Path(r'' + self.path_to_model).as_posix()

    def path_to_model_exists(self) -> bool:
        """
        Checking if path to model exists.

        Returns:
            True if path to model exists, Exception otherwise.
        """
        if os.path.exists(self.path_to_model):
            return True
        else:
            raise model_path_not_exist_exception()

    def log_path_to_model(self, path_to_model: str):
        """
        Logging path to model.

        Args:
            path_to_model: input path to model
        """
        self.path_to_model = path_to_model
        self.format_path()
        self.path_to_model_exists()

        try:
            # Load the model from the file
            _, file_extension = os.path.splitext(self.path_to_model)

            if file_extension in ['.pkl', '.pickle']:
                self.encoded_ml_model = self.__encode_ml_model(self.path_to_model)
            else:
                raise monitored_model_encoding_pkl_file_exception("It is not a pickle file.")

        except Exception as e:
            # Handle any exceptions or errors that may occur
            raise monitored_model_encoding_pkl_file_exception(str(e))

    def log_metric(self, metric_name: str, value):
        """
        Logging single metric.

        Args:
            metric_name: name of the logged metric
            value: value of the logged metric
        """
        self.metrics[metric_name] = value

    def log_metrics(self, metrics: dict):
        """
        Logging multiple metrics.

        Args:
            metrics: dictionary of metrics
        """
        self.metrics.update(metrics)

    def log_parameter(self, parameter_name: str, value):
        """
        Logging single parameter.

        Args:
            parameter_name: name of the logged parameter
            value: value of the logged parameter
        """
        self.parameters[parameter_name] = value

    def log_parameters(self, parameters: dict):
        """
        Logging multiple parameters.

        Args:
            parameters: dictionary of parameters
        """
        self.parameters.update(parameters)

    def log_dataset(self, dataset_id: str):
        """
        Logging dataset

        Args:
            dataset_id: string containing dataset id
        """

        app_response = requests.get(f"{settings.url}/datasets/{dataset_id}")

        response_json = app_response.json()

        if app_response.status_code == 200:
            self.dataset_name = response_json["dataset_name"]
            self.dataset_id = dataset_id
            self.has_dataset = True
        else:
            raise request_failed_exception(app_response)

    def log_chart(self, chart_name: str, chart_type: str, chart_title: str, chart_subtitle: str = None,
                  x_data: list = [list],
                  y_data: list = [list], y_data_names: [str] = [], x_label: str = "x", y_label: str = "y",
                  x_min: float = None, x_max: float = None, y_min: float = None, y_max: float = None,
                  comparable: bool = False):
        """
        Logging a single chart

        Args:
            **chart_name (str)**: Chart name.
            **chart_type (str)**: Chart type.
            **x_data(List[float])**: X data.
            **y_data (List[float])**: Y data.
            **y_data_names (List[str])**: List of y data names
            **x_label (Optional[str])**: X label.
            **y_label (Optional[str])**: Y label.
            **x_min (Optional float)**: Minimal value of x.
            **y_min (Optional float)**: Minimal value of y.
            **x_max (Optional float)**: Maximum value of x.
            **y_max (Optional float)**: Maximum value of y.
            **comparable (Optional bool)**: Determines whether chart can be compared with other charts
        """

        chart = Chart(chart_name=chart_name, chart_type=chart_type, chart_title=chart_title,
                      chart_subtitle=chart_subtitle, x_data=x_data,
                      y_data=y_data, y_data_names=y_data_names, x_label=x_label, y_label=y_label,
                      x_min=x_min, x_max=x_max, y_min=y_min, y_max=y_max, comparable=comparable)

        self.charts.append(chart)

    def transform_charts_to_dictionary(self):
        """

        Returns:

        """

        interactive_charts = []

        for chart in self.charts:
            interactive_charts.append(chart.get_chart_dictionary())

        return interactive_charts

    def log_image_chart(self, name: str, image_path: str):
        """
        Logging image chart

        Args:
            image_path: path to the image chart
            name: name of the image chart
        """
        with open(image_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

        self.image_charts.append({"name": name, "encoded_image": encoded_image})

    def end_iteration(self) -> dict or None:
        """
        End iteration and send data to API.

        Returns:
            iteration: json data of created iteration
        """
        if self.dataset_id:
            dataset = {"id": self.dataset_id}
        else:
            dataset = None

        if self.charts:
            interactive_charts = self.transform_charts_to_dictionary()
        else:
            interactive_charts = None

        data = {
            "user_name": self.user_name,
            "iteration_name": self.iteration_name,
            "metrics": self.metrics,
            "parameters": self.parameters,
            "path_to_model": self.path_to_model,
            "encoded_ml_model": self.encoded_ml_model,
            "dataset": dataset,
            "image_charts": self.image_charts,
            "interactive_charts": interactive_charts
        }

        app_response = requests.post(
            f'{settings.url}/projects/{self.project_id}/experiments/{self.experiment_id}/iterations/', json=data)

        response_json = app_response.json()

        if app_response.status_code == 201:
            return response_json
        else:
            # this is a bit confusing, but mailgun for exception needs to be invoked twice
            # one is for the Iteration class exceptions itself, it is invoked inside tracking start_iteration() function
            # and the other one here is for the exceptions after sending the request to the API
            mailgun = MailGun()
            detail = response_json['detail']
            if self.send_email or settings.send_emails:
                mailgun.send_tracking_failure(
                    f"Request failed with status code {app_response.status_code}: {detail}"
                )

            raise iteration_request_failed_exception(app_response)

    @staticmethod
    def __encode_ml_model(path_to_model: str):
        """
        Encode ml model.

        Args:
            path_to_model: Path to model.
        """

        try:
            # Load the model from the file
            _, file_extension = os.path.splitext(path_to_model)

            if file_extension in ['.pkl', '.pickle']:

                ml_model = pickle.load(open(path_to_model, 'rb'))

                # Serialize the model
                ml_model = pickle.dumps(ml_model)

                # Encode the serialized model as base64
                ml_model = base64.b64encode(ml_model).decode("utf-8")

                return ml_model
            else:
                raise monitored_model_encoding_pkl_file_exception("It is not a pickle file.")

        except Exception as e:
            # Handle any exceptions or errors that may occur
            raise monitored_model_encoding_pkl_file_exception(str(e))
