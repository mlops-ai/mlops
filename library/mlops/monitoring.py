import requests
from mlops.config.config import settings
from mlops.src.mailgun import MailGun
from mlops.exceptions.tracking import request_failed_exception
from mlops.exceptions.monitoring import failed_to_set_active_model_exception
import pandas as pd


def get_model_by_name(model_name: str) -> dict:
    """
    Function for retrieving mlops monitored model from database

    Args:
        model_name: unique name of the monitored model to be retrieved

    Returns:
        monitored_model: json data of monitored model
    """
    app_response = requests.get(f"{settings.url}/monitored-models/name/{model_name}")
    response_json = app_response.json()

    if app_response.status_code == 200:
        return response_json
    else:
        raise request_failed_exception(app_response)


def create_model(model_name: str, model_description: str = None, iteration_dict: dict = None) -> dict:
    """
    Function for creating mlops monitored model

    Args:
        model_name: unique name of the created name
        model_description: description of monitored model
        iteration_dict: dictionary containing valid iteration data with a path to model

    Returns:
        monitored_model: json data of monitored model
    """
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
    """
    Function for setting active model from monitored models

    Args:
        model_name: Name of monitored model, that will be set as active

    Returns:
        Information about new active model setup
    """
    try:
        model = get_model_by_name(model_name)
    except Exception as e:
        raise failed_to_set_active_model_exception(e)

    settings.change_active_model(model["model_name"])
    return f"Active model set to: {settings.active_model}"


def send_prediction(model_name: str, data: pd.DataFrame, send_email: bool = False) -> dict:
    """
    Function to invoke a prediction from monitored model. Function takes a pandas dataframe, where every record is
    taken as a separate prediction.

    Args:
        send_email: Email alert flag
        model_name: Name of monitored model that will be used in prediction
        data: Pandas Dataframe containing data for prediction

    Returns:
        List of dictionaries containing results for each executed prediction
    """
    model = get_model_by_name(model_name)

    if send_email or settings.send_emails:
        mailgun = MailGun()

    data_json = data.to_dict(orient="records")

    app_response = requests.post(f"{settings.url}/monitored-models/{model['_id']}/predict", json=data_json)

    prediction = app_response.json()

    if app_response.status_code == 200:
        if send_email or settings.send_emails:
            mailgun.send_prediction_success(prediction)
        return prediction
    else:
        if send_email or settings.send_emails:
            mailgun.send_prediction_failure(request_failed_exception(app_response))
        raise request_failed_exception(app_response)
