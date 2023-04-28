import requests
from datetime import datetime

url = "http://localhost:8000"


def get_project(project_id: str) -> dict:

    '''
    Function for getting projects from mlops server

    Args:
        project_id: Id od the desired project, that will be retrieved from mlops app

    Returns:
        project: Mlops project json
    '''
    app_response = requests.get(f"{url}/projects/{project_id}")

    response_json = app_response.json()

    detail = response_json['detail']

    if app_response.status_code == 200:
        project = app_response.json()
        return project
    else: 
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")

def create_project(project_title: str) -> bool:

    '''
    Function for getting projects from mlops server

    Args:
        project_title: Id of theproject, that will be retrieved from mlops app

    Returns:
        True: project was created succesfully
        False: there was an error creating the object
    '''
    created_at = datetime.now()

    data = {
        "title": project_title,
        "created_at": created_at.strftime('%Y-%m-%d %H:%M:%S')
    }

    app_response = requests.post(f"{url}/projects/", json=data)
    
    response_json = app_response.json()

    if app_response.status_code == 201:
        return True
    else: 
        detail = response_json['detail']
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")


def get_experiment(project_id: str, experiment_id: str) -> dict:

    '''
    Function for getting projects from mlops server

    Args:
        project_id: Id of the project, that the experiment is the part of

        experiment_id: Id of the experiment, that will be retrived from mlops app

    Returns:
        experiment: Mlops experiment json data
    '''
    
    app_response = requests.get(f"{url}/projects/{project_id}/experiments/{experiment_id}")
    
    response_json = app_response.json()

    if app_response.status_code == 200:
        experiment = app_response.json()
        return experiment
    else:
        detail = response_json['detail']
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")

def create_experiment(experiment_name: str, project_id: str, experiment_description: str) -> bool:
    
    '''
    Function for creating mlops app experiments

    Args:
        experiment_name: Name of the created experiment
    
        project_id: Id od the desired project, that will be retrieved from mlops app

        experiment_description: Description of the created experiment

    Returns:
        True: experiment was created successfully 

        False: experiment wasn't created due to an error
    '''

    created_at = datetime.now()

    data = {
        "name": experiment_name,
        "description": experiment_description,
        "created_at": created_at.strftime('%Y-%m-%d %H:%M:%S')
    }

    app_response = requests.post(f"{url}/projects/{project_id}/experiments/", json=data)
    
    response_json = app_response.json()

    if app_response.status_code == 201:
        return True
    else:
        detail = response_json['detail']
        raise Exception(f"Request failed with status code {app_response.status_code}: {detail}")