import os
import sys
sys.path.append('../../back-end')
sys.path.append('..')

import pytest
import base64

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
async def test_start_iteration_with_path_to_model(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration')
        iteration.log_path_to_model('../mlops/tracking.py')

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['path_to_model'] == '..\\mlops\\tracking.py'


@pytest.mark.asyncio
async def test_start_iteration_with_invalid_path_to_model(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with pytest.raises(FileNotFoundError) as exc_info:
        with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                            experiment_id=experiment['id']) as iteration:
            iteration.log_model_name('test_iteration')
            iteration.log_path_to_model('INVALID PATH')

        result = iteration.end_iteration()

    assert str(exc_info.value) == 'Provided model path does not exist.'


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
async def test_start_iteration_with_image_charts(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    input_image_path = os.path.join(os.path.dirname(__file__), "..", "test_files", "test_image_chart.png")
    print(input_image_path)

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_image_chart('test_chart', input_image_path)

    result = iteration.end_iteration()

    assert result['image_charts'][0]['name'] == 'test_chart'
    assert result['image_charts'][0]['encoded_image'] != ''

    output_image_path = os.path.join(os.path.dirname(__file__), "..", "test_files", "output_image_chart.png")
    with open(output_image_path, "wb") as output_image:
        output_image.write(base64.b64decode(result["image_charts"][0]["encoded_image"]))

    assert open(input_image_path, "rb").read() == open(output_image_path, "rb").read()


@pytest.mark.asyncio
async def test_start_iteration_with_image_charts_failure_invalid_path(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with pytest.raises(FileNotFoundError) as exc_info:
        with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                            experiment_id=experiment['id']) as iteration:
            iteration.log_model_name('test_iteration.py')
            iteration.log_parameter('test_parameter', 100)
            iteration.log_metric('test_accuracy', 0.98)
            iteration.log_image_chart('test_chart', "fake_image_path")

        result = iteration.end_iteration()

    assert str(exc_info.value) == "[Errno 2] No such file or directory: 'fake_image_path'"


@pytest.mark.asyncio
async def test_start_iteration_with_image_charts_failure_missing_argument(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with pytest.raises(TypeError) as exc_info:
        with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                            experiment_id=experiment['id']) as iteration:
            iteration.log_model_name('test_iteration.py')
            iteration.log_parameter('test_parameter', 100)
            iteration.log_metric('test_accuracy', 0.98)
            iteration.log_image_chart(name='test_chart')

        result = iteration.end_iteration()

    assert str(exc_info.value) == "log_image_chart() missing 1 required positional argument: 'image_path'"


@pytest.mark.asyncio
async def test_start_iteration_with_line_chart(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_chart(chart_name="Chart 1", chart_type="line", x_data=[[1, 2, 3]], y_data=[[1, 2, 3]], x_label="Age", y_label="Survived", chart_title='test', comparable=False)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}

@pytest.mark.asyncio
async def test_start_iteration_with_pie_chart(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_chart(chart_name="Chart 1", chart_type="pie", x_data=[[1, 2, 3]], y_data=[[1, 2, 3]], x_label="Age", y_label="Survived", chart_title='test', comparable=False)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}

@pytest.mark.asyncio
async def test_start_iteration_with_bar_chart(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_chart(chart_name="Chart 1", chart_type="bar", x_data=[[1, 2, 3]], y_data=[[1, 2, 3]], x_label="Age", y_label="Survived", chart_title='test', comparable=False)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}

@pytest.mark.asyncio
async def test_start_iteration_with_scatter_chart(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_chart(chart_name="Chart 1", chart_type="scatter", x_data=[[1, 2, 3]], y_data=[[1, 2, 3]], x_label="Age", y_label="Survived", chart_title='test', comparable=False)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}

@pytest.mark.asyncio
async def test_start_iteration_with_box_chart(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                        experiment_id=experiment['id']) as iteration:
        iteration.log_model_name('test_iteration.py')
        iteration.log_parameter('test_parameter', 100)
        iteration.log_metric('test_accuracy', 0.98)
        iteration.log_chart(chart_name="Chart 1", chart_type="boxplot", x_data=[[1, 2, 3]], y_data=[[1, 2, 3, 4, 5],[1, 2, 3, 4, 5],[1, 2, 3, 4, 5]],y_data_names=["1","2","3"], x_label="Age", y_label="Survived", chart_title='test', comparable=False)

    result = iteration.end_iteration()

    assert result['iteration_name'] == 'test_iteration'
    assert result['parameters'] == {'test_parameter': 100}

@pytest.mark.asyncio
async def test_start_iteration_with_box_chart_failed(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with pytest.raises(Exception) as exc_info:
        with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                            experiment_id=experiment['id']) as iteration:
            iteration.log_model_name('test_iteration.py')
            iteration.log_parameter('test_parameter', 100)
            iteration.log_metric('test_accuracy', 0.98)
            iteration.log_chart(chart_name="Chart 1", chart_type="boxplot", x_data=[[1, 2, 3]], y_data=[[1, 2, 3]], x_label="Age", y_label="Survived", chart_title='test', comparable=False)

        result = iteration.end_iteration()

    assert str(exc_info.value) == "Iteration not created. Request failed with status code 400: Error: For each element in x_data, there must be a list of y_data"

@pytest.mark.asyncio
async def test_start_iteration_with_box_chart_failed_with_wrong_y_data_format(setup):
    await drop_database()

    project = mlops.tracking.create_project(title='test_project')
    experiment = mlops.tracking.create_experiment(name='test_experiment', project_id=project['_id'])

    with pytest.raises(Exception) as exc_info:
        with mlops.tracking.start_iteration('test_iteration', project_id=project['_id'],
                                            experiment_id=experiment['id']) as iteration:
            iteration.log_model_name('test_iteration.py')
            iteration.log_parameter('test_parameter', 100)
            iteration.log_metric('test_accuracy', 0.98)
            iteration.log_chart(chart_name="Chart 1", chart_type="boxplot", x_data=[[1, 2, 3]], y_data=[[1, 2, 3],[1, 2, 3],[1, 2, 3]], x_label="Age", y_label="Survived", chart_title='test', comparable=False)

        result = iteration.end_iteration()

    assert str(exc_info.value) == "Iteration not created. Request failed with status code 400: Length of y_data must contain 5 values: min, q1, median, q3, max"