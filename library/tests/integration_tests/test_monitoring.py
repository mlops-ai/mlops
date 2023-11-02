import os
import sys
sys.path.append('../../back-end')
sys.path.append('..')

import pytest

import mlops.monitoring
import mlops.tracking
from mlops.config.config import settings as lib_settings
from app.config.config import settings as app_settings
from app.database.init_mongo_db import drop_database


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

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    params = {'param1': 10, 'param2': 20, 'param3': 30}
    metrics = {'metric1': 0.90, 'metric2': 1.3, 'metric3': 1000}

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_regression_model')
        iteration.log_path_to_model(os.path.join(
            os.path.dirname(__file__), "linear_regression_model.pkl"
        ))
        iteration.log_parameters(params)
        iteration.log_metrics(metrics)

    iteration_dict = iteration.end_iteration()

    model_name = 'test_model'

    response = mlops.monitoring.create_model(model_name=model_name, iteration_dict=iteration_dict)

    assert response['model_name'] == model_name and response['model_status'] == 'active'



