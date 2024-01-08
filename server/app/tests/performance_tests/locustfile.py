import base64
import pickle

from fastapi import HTTPException, status
from locust import HttpUser, between, task
import random
import string
import os


def monitored_model_encoding_pkl_file_exception(description: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Cannot encode pkl file: {description}"
    )


class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if name == 'MonitoredModelWrapper':
            from app.models.monitored_model_wrapper import MonitoredModelWrapper
            return MonitoredModelWrapper
        if name == 'BaselineNN':
            from app.models.monitored_model_wrapper import BaselineNN
            return BaselineNN
        return super().find_class(module, name)


class MyUser(HttpUser):
    wait_time = between(1, 2)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_id = None
        self.created_project_id = None
        self.created_experiment_id = None

    @staticmethod
    def load_ml_model_from_file_and_encode(pkl_file_path) -> str:

        """
        Load ml model from file and encode it to base64.

        Args:
            pkl_file_path: Path to pkl file.

        Returns:
            ml_model: Encoded ml model.
        """
        try:
            # Load the model from the file
            ml_model = CustomUnpickler(open(pkl_file_path, 'rb')).load()

            # Serialize the model
            ml_model = pickle.dumps(ml_model)

            # Encode the serialized model as base64
            ml_model = base64.b64encode(ml_model).decode("utf-8")

            return ml_model

        except Exception as e:
            # Handle any exceptions or errors that may occur
            raise monitored_model_encoding_pkl_file_exception(str(e))

    @staticmethod
    def generate_unique_project_name(user_id):
        random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        return f"TestProject_{user_id}_{random_suffix}"

    @staticmethod
    def generate_unique_experiment_name(user_id):
        random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        return f"TestExperiment_{user_id}_{random_suffix}"

    @staticmethod
    def generate_unique_model_name(user_id):
        random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        return f"TestModel_{user_id}_{random_suffix}"

    @task(10)
    def create_tasks(self):
        user_id = self.user_id
        project_name = self.generate_unique_project_name(user_id)
        project = {"title": project_name}
        headers = {"Content-Type": "application/json"}
        response = self.client.post("/projects/", json=project, headers=headers)
        assert response.status_code == 201

        self.created_project_id = response.json()["_id"]

        response = self.client.get("/projects/")
        projects = response.json()
        if projects:
            project_id = self.created_project_id
            user_id = self.user_id
            experiment_name = self.generate_unique_experiment_name(user_id)
            experiment = {"name": experiment_name}
            headers = {"Content-Type": "application/json"}
            response = self.client.post(f"/projects/{project_id}/experiments/", json=experiment, headers=headers)
            assert response.status_code == 201

            self.created_experiment_id = response.json()["id"]

            experiment_name = self.generate_unique_experiment_name(user_id)
            experiment = {"name": experiment_name}
            headers = {"Content-Type": "application/json"}
            response = self.client.post(f"/projects/{project_id}/experiments/", json=experiment, headers=headers)
            assert response.status_code == 201

            experiment_name = self.generate_unique_experiment_name(user_id)
            experiment = {"name": experiment_name}
            headers = {"Content-Type": "application/json"}
            response = self.client.post(f"/projects/{project_id}/experiments/", json=experiment, headers=headers)
            assert response.status_code == 201

            experiment_name = self.generate_unique_experiment_name(user_id)
            experiment = {"name": experiment_name}
            headers = {"Content-Type": "application/json"}
            response = self.client.post(f"/projects/{project_id}/experiments/", json=experiment, headers=headers)
            assert response.status_code == 201

            experiment_name = self.generate_unique_experiment_name(user_id)
            experiment = {"name": experiment_name}
            headers = {"Content-Type": "application/json"}
            response = self.client.post(f"/projects/{project_id}/experiments/", json=experiment, headers=headers)
            assert response.status_code == 201

        response = self.client.get("/projects/")
        projects = response.json()
        if projects:
            project_id = self.created_project_id
            response = self.client.get(f"/projects/{project_id}/experiments/")
            experiments = response.json()
            if experiments:
                experiment_id = self.created_experiment_id
                test_file_path = os.path.join(os.path.dirname(__file__), "test_files", "test_iteration_file.pkl")
                iteration = {
                    "iteration_name": "Test iteration 1",
                    "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
                    "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001},
                    "path_to_model": test_file_path,
                    "encoded_ml_model": self.load_ml_model_from_file_and_encode(os.path.join(os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"))
                }
                headers = {"Content-Type": "application/json"}
                response = self.client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration, headers=headers)
                assert response.status_code == 201
                assert response.json()['iteration_name'] == iteration['iteration_name']

                iteration = {
                    "iteration_name": "Test iteration 2",
                    "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
                    "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001},
                    "path_to_model": test_file_path,
                    "encoded_ml_model": self.load_ml_model_from_file_and_encode(os.path.join(os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"))
                }
                headers = {"Content-Type": "application/json"}
                response = self.client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration, headers=headers)
                assert response.status_code == 201
                assert response.json()['iteration_name'] == iteration['iteration_name']

                iteration = {
                    "iteration_name": "Test iteration 3",
                    "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
                    "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001},
                    "path_to_model": test_file_path,
                    "encoded_ml_model": self.load_ml_model_from_file_and_encode(os.path.join(os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"))
                }
                headers = {"Content-Type": "application/json"}
                response = self.client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration, headers=headers)
                assert response.status_code == 201
                assert response.json()['iteration_name'] == iteration['iteration_name']

                iteration = {
                    "iteration_name": "Test iteration 4",
                    "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
                    "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001},
                    "path_to_model": test_file_path,
                    "encoded_ml_model": self.load_ml_model_from_file_and_encode(os.path.join(os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"))
                }
                headers = {"Content-Type": "application/json"}
                response = self.client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration, headers=headers)
                assert response.status_code == 201
                assert response.json()['iteration_name'] == iteration['iteration_name']

                iteration = {
                    "iteration_name": "Test iteration 5",
                    "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
                    "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001},
                    "path_to_model": test_file_path,
                    "encoded_ml_model": self.load_ml_model_from_file_and_encode(os.path.join(os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"))
                }
                headers = {"Content-Type": "application/json"}
                response = self.client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/", json=iteration, headers=headers)
                assert response.status_code == 201
                assert response.json()['iteration_name'] == iteration['iteration_name']

        response = self.client.get("/projects/")
        projects = response.json()
        if projects:
            project_id = self.created_project_id
            response = self.client.get(f"/projects/{project_id}/experiments/")
            experiments = response.json()
            if experiments:
                experiment_id = self.created_experiment_id
                test_file_path = os.path.join(os.path.dirname(__file__), "test_files", "test_iteration_file.pkl")
                iteration = {
                    "iteration_name": "Test iteration to build monitored model",
                    "metrics": {"accuracy": 0.9, "precision": 0.8, "recall": 0.7, "f1": 0.6},
                    "parameters": {"batch_size": 32, "epochs": 10, "learning_rate": 0.001},
                    "path_to_model": test_file_path,
                    "encoded_ml_model": self.load_ml_model_from_file_and_encode(os.path.join(os.path.dirname(__file__), "test_files", "linear_regression_model.pkl"))
                }
                headers = {"Content-Type": "application/json"}
                response = self.client.post(f"/projects/{project_id}/experiments/{experiment_id}/iterations/",
                                            json=iteration, headers=headers)

                assert response.status_code == 201
                assert response.json()['iteration_name'] == iteration['iteration_name']
                iteration_added = response.json()
                if iteration_added:
                    iteration_id = iteration_added["id"]
                    monitored_model = {
                        "model_name": self.generate_unique_model_name(self.user_id),
                        "model_description": "Test monitored model description",
                        "model_status": "idle"
                    }
                    response = self.client.post("/monitored-models/", json=monitored_model)
                    assert response.status_code == 201
                    assert response.json()["model_name"] == monitored_model["model_name"]
                    assert response.json()["model_description"] == monitored_model["model_description"]
                    assert response.json()["model_status"] == "idle"

                    monitored_model_id = response.json()["_id"]

                    monitored_model_changed = {
                        "model_status": "active",
                        "iteration": iteration_added
                    }

                    response = self.client.put(f"/monitored-models/{monitored_model_id}",
                                               json=monitored_model_changed)
                    assert response.status_code == 200
                    assert response.json()["model_status"] == "active"
                    assert response.json()['model_name'] == monitored_model['model_name']
                    assert response.json()['iteration']['assigned_monitored_model_name'] == monitored_model[
                        'model_name']

                    data = [
                        {
                            "X1": 1.0,
                            "X2": 2.0
                        }
                    ]
                    response = self.client.post(f"/monitored-models/{monitored_model_id}/predict", json=data)
                    assert response.status_code == 200
                    assert round(response.json()[0]["prediction"], 6) == round(7.89043535267264, 6)
                    assert response.json()[0]["input_data"]["X1"] == 1.0

    def on_start(self):
        self.user_id = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        self.created_project_id = None
        self.created_experiment_id = None
