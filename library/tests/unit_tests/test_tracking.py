import pytest

import mlops.tracking
from app.config.config import settings as app_settings
from mlops.config.config import settings as lib_settings
from app.database.init_mongo_db import drop_database
from mlops.src.chart import Chart


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


@pytest.mark.asyncio
async def test_get_project(setup):
    with pytest.raises(Exception) as exc_info:
        response = mlops.tracking.get_project('wrong_project_id_that_should_never_pass')

    assert str(exc_info.value) == "Request failed with status code 422: [{'loc': ['path', 'id'], 'msg': 'Id " "must " \
                                  "be of type PydanticObjectId', 'type': 'type_error'}]"


@pytest.mark.asyncio
async def test_get_project_by_name(setup):
    # Test for project that does not exist
    with pytest.raises(Exception) as exc_info:
        raise mlops.tracking.get_project_by_name('wrong_project_name_that_should_never_pass')

    assert str(exc_info.value) == "Request failed with status code 404: Project not found."

    # Test for project that exists
    response_success = mlops.tracking.get_project_by_name('test project')
    assert response_success['title'] == 'test project'


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


@pytest.mark.asyncio
async def test_get_experiment_by_name(setup):
    project = mlops.tracking.get_project_by_name('test_project')
    assert project['title'] == 'test_project'

    # test for experiment that does not exist
    with pytest.raises(Exception) as exc_info:
        raise mlops.tracking.get_experiment_by_name('wrong_experiment_name', project['_id'])

    assert str(exc_info.value) == "Request failed with status code 404: Experiment not found."

    # test for experiment that exists
    experiment = mlops.tracking.get_experiment_by_name('test_experiment', project['_id'])
    assert experiment['name'] == 'test_experiment'


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


@pytest.mark.asyncio
async def test_create_dataset_success(setup):
    await drop_database()

    dataset = mlops.tracking.create_dataset(dataset_name='test_dataset', path_to_dataset='https://www.kaggle.com/c'
                                                                                         '/titanic/download/train.csv')

    assert dataset['dataset_name'] == 'test_dataset'


# Test for start_iteration function
@pytest.mark.asyncio
async def test_start_iteration(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}


@pytest.mark.asyncio
async def test_start_iteration_with_active_project(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    mlops.tracking.set_active_project(project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', experiment_id=experiment['id']) as iteration:
        pass

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert lib_settings.active_project_id == project['_id']


@pytest.mark.asyncio
async def test_start_iteration_with_active_experiment(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    mlops.tracking.set_active_project(project_id=project['_id'])
    mlops.tracking.set_active_experiment(experiment['id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id']) as iteration:
        pass

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert lib_settings.active_experiment_id == experiment['id']


@pytest.mark.asyncio
async def test_start_iteration_with_multiple_params_and_metrics(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameters(params)
        iteration.log_metrics(metrics)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == params
    assert result['metrics'] == metrics


@pytest.mark.asyncio
async def test_start_iteration_with_dataset(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])
    dataset = mlops.tracking.create_dataset(dataset_name='test_dataset', path_to_dataset='https://www.kaggle.com/c'
                                                                                         '/titanic/download/train.csv')

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_dataset(dataset['_id'])

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}
    assert result['dataset']['name'] == 'test_dataset'


@pytest.mark.asyncio
async def test_start_iteration_with_chart(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])
    chart = Chart(chart_name="Chart 1", chart_type="line", x_data=[1, 2, 3], y_data=[1, 2, 3], x_label="Age", y_label="Survived")

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_chart(chart)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}
