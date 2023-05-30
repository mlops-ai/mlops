import requests
from mlops.config.config import settings
from mlops.exceptions.tracking import request_failed_exception


class Dataset:
    """
    Class for logging datasets
    """

    def __init__(self, dataset_name: str, path_to_dataset: str, dataset_description: str = None,
                 tags: str = None, version: str = None):
        self.dataset_name: str = dataset_name
        self.path_to_dataset: str = path_to_dataset
        self.dataset_description: str = dataset_description
        self.tags: str = tags
        self.version: str = version

    def get_dataset_json(self) -> dict:
        """
        Transform dataset values into dictionary to be used in http request body
        Returns:
            dataset_dict: dictionary containing dataset parameters
        """
        dataset_dict = {
            "dataset_name": self.dataset_name,
            "path_to_dataset": self.path_to_dataset,
            "dataset_description": self.dataset_description,
            "tags": self.tags,
            "version": self.version
        }

        return dataset_dict

    def create_dataset_in_app(self) -> dict:
        """
        Create dataset in webapp.

        Returns:
            dataset: json data of the created dataset
        """
        data = self.get_dataset_json()

        app_response = requests.post(f"{settings.url}/datasets/", json=data)

        response_json = app_response.json()

        if app_response.status_code == 201:
            return response_json
        else:
            raise request_failed_exception(app_response)
