import requests
from datetime import datetime

url = "http://localhost:8000"


def get_project(project_id: str):

    '''
    Function for getting projects from mlops server

    Args:
        project_id: Id od the desired project, that will be retrieved from mlops app

    Returns:
        project: Mlops project json data
    '''

    app_response = requests.get(url + "/projects/" + project_id)

    project = app_response.json()

    return project

def create_project(title: str):

    data = {
        "title": title,
        "created_at": str(datetime.now)
    }

    response = requests.post(url + "/projects/", json=data)

    print(response.status_code)


def get_experiment(project_id: str, experiment_id: str):

    app_response = requests.get(url + "/" + project_id + "/"+ experiment_id + id)

    experiment = app_response.json()

    return experiment

def create_experiment(experiment_name: str, project_id: str, experiment_description: str):

    data = {
        "name": experiment_name,
        "description": experiment_description,
        "created_at": str(datetime.now)
    }
    
    request_path = url + "/projects/"+ project_id + "/experiments/"

    response = requests.post(request_path, json=data)


