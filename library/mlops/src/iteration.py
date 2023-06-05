import requests
import os

from mlops.config.config import settings
from mlops.exceptions.tracking import request_failed_exception
from mlops.exceptions.iteration import iteration_request_failed_exception, model_path_not_exist_exception


class Iteration:
    """
    Class for logging iteration data.
    """

    def __init__(self, iteration_name: str, project_id: str = None, experiment_id: str = None):
        self.iteration_name: str = iteration_name
        self.project_id: str = project_id
        self.experiment_id: str = experiment_id
        self.user_name: str = settings.user_name
        self.model_name: str = None
        self.path_to_model: str = ""
        self.parameters: dict = {}
        self.metrics: dict = {}
        self.dataset_id: str = None
        self.dataset_name: str = None
        self.has_dataset: bool = False

    def format_path(self):
        self.path_to_model = self.path_to_model.replace('\f', '\\f').replace('\t', '\\t').replace(
            '\n', '\\n').replace('\r', '\\r').replace('\b', '\\b').replace('/', '\\')

    def path_to_model_exists(self):
        if os.path.exists(self.path_to_model) or self.path_to_model == "":
            return True
        else:
            raise model_path_not_exist_exception()

    def log_model_name(self, model_name: str):
        """
        Logging model name.

        Args:
            model_name: input model name
        """
        self.model_name = model_name

    def log_path_to_model(self, path_to_model: str):
        """
        Logging path to model.

        Args:
            path_to_model: input path to model
        """
        self.path_to_model = path_to_model
        self.format_path()

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

    def end_iteration(self) -> dict:
        """
        End iteration and send data to API.

        Returns:
            iteration: json data of created iteration
        """
        self.path_to_model_exists()

        if self.dataset_id:
            dataset = {"id": self.dataset_id}
        else:
            dataset = None

        data = {
            "user_name": self.user_name,
            "iteration_name": self.iteration_name,
            "metrics": self.metrics,
            "parameters": self.parameters,
            "path_to_model": self.path_to_model,
            "model_name": self.model_name,
            "dataset": dataset
        }

        app_response = requests.post(
            f'{settings.url}/projects/{self.project_id}/experiments/{self.experiment_id}/iterations/', json=data)

        response_json = app_response.json()

        if app_response.status_code == 201:
            return response_json
        else:
            raise iteration_request_failed_exception(app_response)