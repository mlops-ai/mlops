import pytest

from server.app.config.config import settings as app_settings
from server.app.database.init_mongo_db import drop_database
from mlops.src.dataset import Dataset


@pytest.fixture(scope="module")
async def setup():
    if not app_settings.TESTING:
        raise RuntimeError("Value of TESTING in ./server/.venv should be True")

    await drop_database()


def test_create_dataset_success():
    dataset = Dataset(dataset_name='test_dataset', path_to_dataset="https://archive.ics.uci.edu/dataset/53/iris")
    result = dataset.create_dataset_in_app()

    assert result['dataset_name'] == 'test_dataset'
