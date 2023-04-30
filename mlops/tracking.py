import requests
from config.config import settings


def get_project(project_id: str = settings.active_project) -> dict:
    """
    Function for getting projects from mlops server

    Args:
        project_id: Id od the desired project, that will be retrieved from mlops app

    Returns:
        project: json data of the project
    """
    app_response = requests.get(f"{settings.url}/projects/{project_id}")
    response_json = app_response.json()

    if app_response.status_code == 200:
        return response_json
    else:
        detail = response_json['detail']
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")


def create_project(title: str, description: str = None,
                   status: str = 'not_started', archived: bool = False) -> dict:
    """
    Function for getting projects from mlops server

    Args:
        title: Title of the created project
        description: Description of the created project (optional)
        status: Status of the created project (optional)
        archived: Archived status of the created project (optional)

    Returns:
        project: json data of the created project
    """
    data = {
        "title": title,
        "description": description,
        "status": status,
        "archived": archived
    }

    app_response = requests.post(f"{settings.url}/projects/", json=data)
    response_json = app_response.json()

    if app_response.status_code == 201:
        return response_json
    else:
        detail = response_json['detail']
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")


def set_active_project(project_id: str) -> dict:
    """
    Function for setting active project

    Args:
        project_id: Id of the project, that will be set as active

    Returns:
        project: json data of the active project
    """
    try:
        project = get_project(project_id)
        settings.change_active_project(project_id)
        return project
    except Exception as e:
        raise Exception(f"Failed to set active project: {e}")


def get_experiment(experiment_id: str, project_id: str = settings.active_project) -> dict:
    """
    Function for getting projects from mlops server

    Args:
        experiment_id: Id of the experiment, that will be retrieved from mlops app
        project_id: Id of the project, that the experiment comes from (optional)

    Returns:
        experiment: json data of the experiment
    """
    app_response = requests.get(f"{settings.url}/projects/{project_id}/experiments/{experiment_id}")
    response_json = app_response.json()

    if app_response.status_code == 200:
        experiment = app_response.json()
        return experiment
    else:
        detail = response_json['detail']
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")


def create_experiment(name: str, description: str = None,
                      project_id: str = settings.active_project) -> dict:
    """
    Function for creating mlops app experiments

    Args:
        name: Name of the created experiment
        description: Description of the created experiment (optional)
        project_id: Id of the project, that the experiment comes from (optional)

    Returns:
        experiment: json data of the created experiment
    """
    data = {
        "name": name,
        "description": description,
    }

    app_response = requests.post(f"{settings.url}/projects/{project_id}/experiments/", json=data)
    response_json = app_response.json()

    if app_response.status_code == 201:
        return response_json
    else:
        detail = response_json['detail']
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")
