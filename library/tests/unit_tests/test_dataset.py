import pytest

import mlops.tracking
from app.config.config import settings as app_settings
from app.database.init_mongo_db import drop_database
from mlops.src.iteration import Iteration
from mlops.src.dataset import Dataset


@pytest.fixture(scope="module")
async def setup():
    if not app_settings.TESTING:
        raise RuntimeError("Value of TESTING in ./back-end/.venv should be True")

    await drop_database()


def test_create_dataset_success():
    dataset = Dataset(dataset_name='test_dataset', path_to_dataset='https://www.kaggle.com/c'
                                                                   '/titanic/download/train.csv')
    result = dataset.create_dataset_in_app()

    assert result['dataset_name'] == 'test_dataset'
