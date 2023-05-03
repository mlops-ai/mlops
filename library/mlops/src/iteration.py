from mlops.config.config import settings


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
        # TODO: we need to take as an input path with single backslashes (e.g. "C:\mlops-inzynierka\LICENSE") and
        # use some regex to parse it to double backslashes, because JSON doesn't accept single ones
        raise NotImplementedError

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

    def end_iteration(self):
        """
        End iteration and send data to API.
        """
        data = {
            "user_name": self.user_name,
            "iteration_name": self.iteration_name,
            "metrics": self.metrics,
            "parameters": self.parameters,
            "path_to_model": self.path_to_model,
            "model_name": self.model_name
        }

        print(data)
        # TODO: send data to API here
