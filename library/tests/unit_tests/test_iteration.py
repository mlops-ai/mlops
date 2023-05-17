import pytest

from app.config.config import settings as app_settings
from app.database.init_mongo_db import drop_database
from mlops.src.iteration import Iteration


@pytest.fixture(scope="module")
async def setup():
    if not app_settings.TESTING:
        raise RuntimeError("Value of TESTING in ./back-end/.venv should be True")

    await drop_database()


def test_format_unix_path(setup):
    iteration = Iteration(
        iteration_name='test_iteration',
        project_id='test+project',
        experiment_id='test_experiment'
    )

    iteration.log_path_to_model('../mlops/library/tests/test_tracking.py')

    iteration.format_path()

    assert iteration.path_to_model == '..\\mlops\\library\\tests\\test_tracking.py'


def test_format_good_path(setup):
    iteration = Iteration(
        iteration_name='test_iteration',
        project_id='test+project',
        experiment_id='test_experiment'
    )

    iteration.log_path_to_model('..\\mlops\\library\\tests\\test_tracking.py')

    iteration.format_path()

    assert iteration.path_to_model == '..\\mlops\\library\\tests\\test_tracking.py'


def test_format_path_with_special_characters(setup):
    iteration = Iteration(
        iteration_name='test_iteration',
        project_id='test+project',
        experiment_id='test_experiment'
    )

    iteration.log_path_to_model('..\rlops\fibrary\tests\test_tracking.py')

    iteration.format_path()

    assert iteration.path_to_model == '..\\rlops\\fibrary\\tests\\test_tracking.py'


def test_single_backslash_path_formatting(setup):
    iteration = Iteration(
        iteration_name='test_iteration',
        project_id='test+project',
        experiment_id='test_experiment'
    )

    iteration.log_path_to_model('..\mlops\library\tests\test_tracking.py')

    iteration.format_path()

    assert iteration.path_to_model == '..\\mlops\\library\\tests\\test_tracking.py'
