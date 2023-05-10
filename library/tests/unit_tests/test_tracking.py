import pytest

import mlops.tracking
from app.config.config import settings as app_settings
from mlops.config.config import settings as lib_settings
from app.database.init_mongo_db import drop_database
from mlops.src.iteration import Iteration


# Fixture to set up test environment
@pytest.fixture(scope="module")
async def setup():
    if not app_settings.TESTING:
        raise RuntimeError("Value of TESTING in ./back-end/.venv should be True")

    await drop_database()


@pytest.mark.asyncio
async def test_create_project_successful(setup):
    await drop_database()

    project_name = 'test project'
    response = mlops.tracking.create_project(project_name)

    assert response['title'] == project_name


@pytest.mark.asyncio
async def test_create_project_failure(setup):
    await drop_database()

    project_name = 'test project'
    response = mlops.tracking.create_project(project_name)

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.tracking.create_project(project_name)

    assert str(exc_info.value) == "Request failed with status code 400: Project with that title already exists."


def test_get_project(setup):
    with pytest.raises(Exception) as exc_info:
        response = mlops.tracking.get_project('wrong_project_id_that_should_never_pass')

    assert str(exc_info.value) == "Request failed with status code 422: [{'loc': ['path', 'id'], 'msg': 'Id " "must " \
                                  "be of type PydanticObjectId', 'type': 'type_error'}]"


# Test for set_active_project function
@pytest.mark.asyncio
async def test_set_active_project(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    mlops.tracking.set_active_project(project_id=project['_id'])

    assert lib_settings.active_project_id == project['_id']


# Test for get_experiment function
@pytest.mark.asyncio
async def test_get_experiment(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    response = mlops.tracking.get_experiment(experiment_id=experiment['id'], project_id=project['_id'])

    assert response['name'] == 'test_experiment'


# Test for create_experiment function
@pytest.mark.asyncio
async def test_create_experiment_success(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    assert experiment['name'] == 'test_experiment'


# Test for set_active_experiment function
@pytest.mark.asyncio
async def test_set_active_experiment(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    mlops.tracking.set_active_project(project_id=project['_id'])

    experiment = mlops.tracking.create_experiment(name='test_experiment')
    mlops.tracking.set_active_experiment(experiment_id=experiment['id'])

    assert lib_settings.active_experiment_id == experiment['id']


# Test for start_iteration function
@pytest.mark.asyncio
async def test_start_iteration(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        pass

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
