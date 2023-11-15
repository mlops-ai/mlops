import os
import sys

import pandas as pd
import pytest
sys.path.append('../../back-end')
sys.path.append('..')

import mlops.tracking
import mlops.monitoring
from mlops.config.config import settings as lib_settings
from server.app.config.config import settings as app_settings
from server.app.database.init_mongo_db import drop_database


# Fixture to set up test environment
@pytest.fixture(scope="module")
async def setup():
    if not app_settings.TESTING:
        raise RuntimeError("Value of TESTING in ./back-end/.venv should be True")

    await drop_database()


@pytest.mark.asyncio
async def test_create_model_successful(setup):
    await drop_database()

    model_name = 'test model'
    response = mlops.monitoring.create_model(model_name)

    assert response['model_name'] == model_name


@pytest.mark.asyncio
async def test_create_model_failure(setup):
    await drop_database()

    model_name = 'test model'
    response = mlops.monitoring.create_model(model_name)

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.monitoring.create_model(model_name)

    assert str(exc_info.value) == "Request failed with status code 400: Monitored model name already exists."


@pytest.mark.asyncio
async def test_get_model(setup):
    await drop_database()

    model = mlops.monitoring.create_model(model_name='test_model')

    response = mlops.monitoring.get_model(model_name='test_model')

    assert response['model_name'] == 'test_model'


@pytest.mark.asyncio
async def test_set_active_model(setup):
    await drop_database()

    model = mlops.monitoring.create_model(model_name='test_model')
    mlops.monitoring.set_active_model(model_name='test_model')

    assert lib_settings.active_model == 'test_model'


@pytest.mark.asyncio
async def test_create_model_with_iteration(setup):
    await drop_database()

    if os.getenv('GITHUB_ACTIONS') == 'true':
        assert True

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "../test_files/linear_regression_model.pkl"
        ))
        iteration.log_parameters(params)
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()
    model_name = 'test_model'

    response = mlops.monitoring.create_model(model_name=model_name, iteration_dict=iteration_dict)
    assert response['model_name'] == model_name and response['model_status'] == 'active'


@pytest.mark.asyncio
async def test_create_model_with_iteration_no_path_to_model(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_parameters(params)
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()
    model_name = 'test_model'

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.monitoring.create_model(model_name=model_name, iteration_dict=iteration_dict)

    assert str(exc_info.value) == "Request failed with status code 400: Cannot encode pkl file: [Errno 2] No such " \
                                  "file or directory: ''"


@pytest.mark.asyncio
async def test_predict_success(setup):
    await drop_database()

    if os.getenv('GITHUB_ACTIONS') == 'true':
        assert True

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_parameters(params)
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "../test_files/linear_regression_model.pkl"
        ))
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()
    model_name = 'test_model'

    mlops.monitoring.create_model(model_name=model_name, iteration_dict=iteration_dict)

    data = pd.DataFrame.from_dict(data={
        "X1": [1.0],
        "X2": [2.0]
    }, orient="columns")

    data_dict = data.to_dict(orient="records")

    response = mlops.monitoring.predict(model_name=model_name, data=data)

    prediction = response[0]

    assert prediction["input_data"] == data_dict[0]

@pytest.mark.asyncio
async def test_predict_failure(setup):
    await drop_database()

    if os.getenv('GITHUB_ACTIONS') == 'true':
        assert True

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_parameters(params)
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "../test_files/linear_regression_model.pkl"
        ))
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()
    model_name = 'test_model'

    mlops.monitoring.create_model(model_name=model_name, iteration_dict=iteration_dict)

    data = pd.DataFrame.from_dict(data={
        "X1": [1.0],
        "X2": ['hello']
    }, orient="columns")

    data_dict = data.to_dict(orient="records")

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.monitoring.predict(model_name=model_name, data=data)

    assert str(exc_info.value) == "Request failed with status code 400: Cannot make prediction: could not " \
                                  "convert string to float: 'hello'"

@pytest.mark.asyncio
async def test_predict_multiple_success(setup):
    await drop_database()

    if os.getenv('GITHUB_ACTIONS') == 'true':
        assert True

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_parameters(params)
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "../test_files/linear_regression_model.pkl"
        ))
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()
    model_name = 'test_model'

    mlops.monitoring.create_model(model_name=model_name, iteration_dict=iteration_dict)

    data = pd.DataFrame.from_records(data=[
        {"X1": 1.0, "X2": 2.0},
        {"X1": 1.0, "X2": 4.0},
        {"X1": 1.0, "X2": 3.0}
    ])

    num_of_predictions = len(data)

    response = mlops.monitoring.predict(model_name=model_name, data=data)

    assert len(response) == num_of_predictions


@pytest.mark.asyncio
async def test_predict_multiple_failure_incorect_data_types(setup):
    await drop_database()

    if os.getenv('GITHUB_ACTIONS') == 'true':
        assert True

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_parameters(params)
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "../test_files/linear_regression_model.pkl"
        ))
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()
    model_name = 'test_model'

    mlops.monitoring.create_model(model_name=model_name, iteration_dict=iteration_dict)

    data = pd.DataFrame.from_records(data=[
        {"X1": 1.0, "X2": 2.0},
        {"X1": 1.0, "X2": 'wrong data'},
        {"X1": [1, 2, 3], "X2": 3.0}
    ])

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.monitoring.predict(model_name=model_name, data=data)

    assert 'Request failed with status code 400' in str(exc_info.value)


@pytest.mark.asyncio
async def test_create_monitored_model_with_iteration_in_another_model(setup):
    await drop_database()

    if os.getenv('GITHUB_ACTIONS') == 'true':
        assert True

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "../test_files/linear_regression_model.pkl"
        ))
        iteration.log_parameters(params)
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()

    test_model = mlops.monitoring.create_model(model_name='test_model', iteration_dict=iteration_dict)

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.monitoring.create_model(model_name='test_model2', iteration_dict=iteration_dict)

    assert 'Request failed with status code 400: Iteration is assigned to monitored model.' in str(exc_info.value)

@pytest.mark.asyncio
async def test_create_monitored_model_no_ml_model_to_encode(setup):
    await drop_database()

    if os.getenv('GITHUB_ACTIONS') == 'true':
        assert True

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_not_a_model')
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "../test_files/test_file.txt"
        ))
        iteration.log_parameters(params)
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.monitoring.create_model(model_name='test_model', iteration_dict=iteration_dict)

    assert 'Request failed with status code 400: Cannot encode pkl file: could not find MARK' in str(exc_info.value)

@pytest.mark.asyncio
async def test_create_monitored_model_no_ml_model_to_decode(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_parameters(params)
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()
    model_name = 'test_model'

    mlops.monitoring.create_model(model_name=model_name)

    data = pd.DataFrame.from_dict(data={
        "X1": [1.0],
        "X2": [2.0]
    }, orient="columns")

    with pytest.raises(Exception) as exc_info:
        failed_response = mlops.monitoring.predict(model_name=model_name, data=data)

    assert "Request failed with status code 400: Monitored model has no iteration. Model status must be 'idle' or " \
           "'archived'." in str(exc_info.value)
