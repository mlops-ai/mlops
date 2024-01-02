import requests
from contextlib import contextmanager
from mlops.config.config import settings
from mlops.src.iteration import Iteration
from mlops.src.dataset import Dataset
from mlops.src.mailgun import MailGun
from mlops.exceptions.tracking import project_id_is_none_exception, experiment_id_is_none_exception, \
    failed_to_set_active_project_exception, failed_to_set_active_experiment_exception, request_failed_exception
from typing import ContextManager


def get_project(project_id: str = None) -> dict:
    """
    Function for getting projects from mlops server

    Args:
        project_id: Id od the desired project, that will be retrieved from mlops app

    Returns:
        project: json data of the project
    """
    project_id = settings.active_project_id if not project_id else project_id

    if project_id is None:
        raise project_id_is_none_exception()

    app_response = requests.get(f"{settings.url}/projects/{project_id}")
    response_json = app_response.json()

    if app_response.status_code == 200:
        return response_json
    else:
        raise request_failed_exception(app_response)


def get_project_by_name(project_title: str) -> dict:
    """
    Function for getting projects from mlops server by name

    Args:
        project_title: name od the desired project, that will be retrieved from mlops app

    Returns:
        project: json data of the project
    """
    app_response = requests.get(f"{settings.url}/projects/title/{project_title}")
    response_json = app_response.json()

    if app_response.status_code == 200:
        return response_json
    else:
        raise request_failed_exception(app_response)


def create_project(title: str, description: str = None,
                   status: str = 'not_started', archived: bool = False) -> dict:
    """
    Function for creating mlops projects

    Args:
        title: Title of the created project
        description: Description of the created project (optional)
        status: Status of the created project (optional)
        archived: Archived status of the created project (optional)

    Returns:
        project: JSON data of the created project
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
        raise request_failed_exception(app_response)


def set_active_project(project_id: str) -> str:
    """
    Function for setting active project

    Args:
        project_id: Id of the project, that will be set as active

    Returns:
        project: JSON data of the active project
    """
    try:
        project = get_project(project_id)
    except Exception as e:
        raise failed_to_set_active_project_exception(e)

    settings.change_active_project(project_id)

    return f"Active project set to: {settings.active_project_id}"


def get_experiment(experiment_id: str = None, project_id: str = None) -> dict:
    """
    Function for getting projects from mlops server

    Args:
        experiment_id: Id of the experiment, that will be retrieved from mlops app
        project_id: Id of the project, that the experiment comes from (optional)

    Returns:
        experiment: json data of the experiment
    """
    experiment_id = settings.active_experiment_id if not experiment_id else experiment_id
    project_id = settings.active_project_id if not project_id else project_id

    if project_id is None:
        raise project_id_is_none_exception()
    if experiment_id is None:
        raise experiment_id_is_none_exception()

    app_response = requests.get(f"{settings.url}/projects/{project_id}/experiments/{experiment_id}")

    if app_response.status_code == 200:
        experiment = app_response.json()
        return experiment
    else:
        raise request_failed_exception(app_response)


def get_experiment_by_name(experiment_name: str, project_id: str = None) -> dict:
    """
    Function for getting projects from mlops server by name

    Args:
        experiment_name: Name of the experiment, that will be retrieved from mlops app
        project_id: Id of the project, that the experiment comes from (optional)

    Returns:
        experiment: json data of the experiment
    """
    project_id = settings.active_project_id if not project_id else project_id

    if project_id is None:
        raise project_id_is_none_exception()

    app_response = requests.get(f"{settings.url}/projects/{project_id}/experiments/name/{experiment_name}")

    if app_response.status_code == 200:
        experiment = app_response.json()
        return experiment
    else:
        raise request_failed_exception(app_response)


def create_experiment(name: str, description: str = None,
                      project_id: str = None) -> dict:
    """
    Function for creating mlops experiments

    Args:
        name: Name of the created experiment
        description: Description of the created experiment (optional)
        project_id: Id of the project, that the experiment comes from (optional)

    Returns:
        experiment: json data of the created experiment
    """
    project_id = settings.active_project_id if not project_id else project_id

    if project_id is None:
        raise project_id_is_none_exception()

    data = {
        "name": name,
        "description": description,
    }

    app_response = requests.post(f"{settings.url}/projects/{project_id}/experiments/", json=data)
    response_json = app_response.json()

    if app_response.status_code == 201:
        return response_json
    else:
        raise request_failed_exception(app_response)


def set_active_experiment(experiment_id: str) -> str:
    """
    Function for setting active experiment

    Args:
        experiment_id: Id of the experiment, that will be set as active

    Returns:
        experiment: json data of the active experiment
    """
    try:
        experiment = get_experiment(experiment_id, settings.active_project_id)
    except Exception as e:
        raise failed_to_set_active_experiment_exception(e)

    settings.change_active_experiment(experiment_id)
    return f"Active experiment set to: {settings.active_experiment_id}"


def create_dataset(dataset_name: str, path_to_dataset: str, dataset_description: str = None,
                   tags: str = '', version: str = None) -> dict:
    """
    Function for creating mlops datasets

    Args:
        dataset_name: name of the created dataset
        path_to_dataset: path to dataset files
        dataset_description: short description of the dataset displayed in the app
        tags: tags for dataset
        version: version of the dataset

    Returns:
        dataset: json data of created dataset
    """

    dataset = Dataset(dataset_name, path_to_dataset, dataset_description, tags, version)

    app_response = dataset.create_dataset_in_app()

    return app_response


def get_dataset(dataset_name: str, dataset_version: str):
    """
    Function for getting mlops datasets based on name and version

    Args:
        dataset_name: name of the dataset
        dataset_version: version of the dataset

    Returns:
        dataset: json data of the dataset
    """
    app_response = requests.get(f"{settings.url}/datasets/name/{dataset_name}/version/{dataset_version}")

    if app_response.status_code == 200:
        dataset = app_response.json()
        return dataset
    else:
        raise request_failed_exception(app_response)


@contextmanager
def start_iteration(iteration_name: str, project_id: str = None,
                    experiment_id: str = None, send_email: bool = False) -> ContextManager[Iteration]:
    """
    Function for creating mlops iteration

    Args:
        iteration_name: name of the created iteration
        project_id: if passed id of the project, else active project_id from settings
        experiment_id: if passed id of the experiment, else active experiment_id from settings
        send_email: if True, email will be sent after iteration ends

    Returns:
        Iteration.end_iteration() method output
    """
    project_id = settings.active_project_id if not project_id else project_id
    experiment_id = settings.active_experiment_id if not experiment_id else experiment_id

    if project_id is None:
        raise project_id_is_none_exception()
    if experiment_id is None:
        raise experiment_id_is_none_exception()

    iteration = Iteration(
        iteration_name=iteration_name,
        project_id=project_id,
        experiment_id=experiment_id,
        send_email=send_email
    )
    mailgun = MailGun()
    exception_occurred = False

    try:
        yield iteration
    except Exception as e:
        exception_occurred = True
        if send_email or settings.send_emails:
            mailgun.send_tracking_failure(str(e))
        raise e
    finally:
        if not exception_occurred:
            output = iteration.end_iteration()
            if send_email or settings.send_emails:
                mailgun.send_tracking_success(output)
