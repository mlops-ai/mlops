import requests
import requests
from contextlib import contextmanager
from mlops.config.config import settings
from mlops.src.iteration import Iteration
from mlops.src.dataset import Dataset
from mlops.exceptions.tracking import request_failed_exception
from mlops.exceptions.monitoring import failed_to_set_active_model_exception
from typing import ContextManager


def get_model(model_name: str) -> dict:

    app_response = requests.get(f"{settings.url}/monitored-models/name/{model_name}")
    response_json = app_response.json()

    if app_response.status_code == 200:
        return response_json
    else:
        raise request_failed_exception(app_response)


def create_model(model_name: str, model_description: str = None, iteration_dict: dict = None):

    if iteration_dict is None:
        model_status = "idle"
    else:
        model_status = "active"

    data = {
        "model_name": model_name,
        "model_description": model_description,
        "model_status": model_status,
        "iteration": iteration_dict
    }

    app_response = requests.post(f"{settings.url}/monitored-models/", json=data)
    response_json = app_response.json()

    if app_response.status_code == 201:
        return response_json
    else:
        raise request_failed_exception(app_response)


def set_active_model(model_name: str) -> str:
    try:
        model = get_model(model_name)
    except Exception as e:
        raise failed_to_set_active_model_exception(e)

    settings.change_active_model(model["model_name"])
    return f"Active model set to: {settings.active_model}"
