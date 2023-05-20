import requests
from mlops.config.config import settings
from mlops.exceptions.tracking import request_failed_exception


class Dataset:
    """
    Class for logging datasets
    """

    def __init__(self, dataset_name: str, path_to_dataset: str, dataset_description: str = None, dataset_problem_type: str = None):
        self.dataset_name: str = dataset_name
        self.path_to_dataset: str = path_to_dataset
        self.dataset_description: str = dataset_description
        self.dataset_problem_type: str = dataset_problem_type

    def get_dataset_json(self) -> dict:

        dataset_dict = {
            "dataset_name": self.dataset_name,
            "path_to_dataset": self.path_to_dataset,
            "dataset_description": self.dataset_description,
            "dataset_problem_type": self.dataset_problem_type
        }

        return dataset_dict

    def create_dataset(self) -> dict:

        data = self.get_dataset_json()

        app_response = requests.post(f"{settings.url}/datasets/", json=data)

        response_json = app_response.json()

        if app_response.status_code == 200:
            return response_json
        else:
            raise request_failed_exception(app_response)