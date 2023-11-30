import pytest
import os
import sys

sys.path.append('../../server')
sys.path.append('..')

from server.app.config.config import settings as app_settings
from server.app.database.init_mongo_db import drop_database
from mlops.src.mailgun import MailGun
from mlops.config.config import settings as lib_settings
from unittest.mock import patch

import mlops.tracking
import mlops.monitoring

@pytest.fixture(scope="module")
async def setup():
    if not app_settings.TESTING:
        raise RuntimeError("Value of TESTING in ./server/.venv should be True")


@patch('requests.post')
def mailgun_post_tracking_success(mock_post):
    mock_post.return_value.status_code = 200

    mailgun = MailGun()

    iteration_dict = {'test1': 10, 'test2': 20, 'test3': 30}

    response = mailgun.send_tracking_success(iteration_dict)

    return response


@patch('requests.post')
def mailgun_post_tracking_success_exception(mock_post):
    mock_post.return_value.text = 'mailgun_test_error'
    mock_post.return_value.status_code = 400

    mailgun = MailGun()

    iteration_dict = {'test1': 10, 'test2': 20, 'test3': 30}

    response = mailgun.send_tracking_success(iteration_dict)

    return response

@patch('requests.post')
def mailgun_post_tracking_failure(mock_post):
    mock_post.return_value.status_code = 200

    mailgun = MailGun()

    iteration_exception_message = 'test_exception_message'

    response = mailgun.send_tracking_failure(iteration_exception_message)

    return response

@patch('requests.post')
def mailgun_post_tracking_failure_exception(mock_post):
    mock_post.return_value.text = 'mailgun_test_error'
    mock_post.return_value.status_code = 400

    mailgun = MailGun()

    iteration_exception_message = 'test_exception_message'

    response = mailgun.send_tracking_failure(iteration_exception_message)

    return response

@patch('requests.post')
def mailgun_post_prediction_success(mock_post):
    mock_post.return_value.status_code = 200

    mailgun = MailGun()

    prediction_data = {'test1': 10, 'test2': 20, 'test3': 30}

    response = mailgun.send_prediction_success(prediction_data)

    return response

@patch('requests.post')
def mailgun_post_prediction_success_exception(mock_post):
    mock_post.return_value.text = 'mailgun_test_error'
    mock_post.return_value.status_code = 400

    mailgun = MailGun()

    prediction_data = {'test1': 10, 'test2': 20, 'test3': 30}

    response = mailgun.send_prediction_success(prediction_data)

    return response


@patch('requests.post')
def mailgun_post_prediction_failure(mock_post):
    mock_post.return_value.status_code = 200

    mailgun = MailGun()

    prediction_exception_message = 'test_exception_message'

    response = mailgun.send_prediction_failure(prediction_exception_message)

    return response


@patch('requests.post')
def mailgun_post_prediction_failure_exception(mock_post):
    mock_post.return_value.text = 'mailgun_test_error'
    mock_post.return_value.status_code = 400

    mailgun = MailGun()

    prediction_exception_message = 'test_exception_message'

    response = mailgun.send_prediction_failure(prediction_exception_message)

    return response


@pytest.mark.asyncio
async def test_send_tracking_success(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    response = mailgun_post_tracking_success()

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_send_tracking_success_exception(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    with pytest.raises(Exception) as exc_info:
        failed_response = mailgun_post_tracking_success_exception()

    assert 'Mail not sent. Request failed with status code 400' in str(exc_info.value)

@pytest.mark.asyncio
async def test_send_tracking_failure(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    response = mailgun_post_tracking_failure()

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_send_tracking_success_exception(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    with pytest.raises(Exception) as exc_info:
        failed_response = mailgun_post_tracking_failure_exception()

    assert 'Mail not sent. Request failed with status code 400' in str(exc_info.value)


@pytest.mark.asyncio
async def test_send_prediction_success(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    response = mailgun_post_prediction_success()

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_send_prediction_success_exception(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    with pytest.raises(Exception) as exc_info:
        failed_response = mailgun_post_prediction_success_exception()

    assert 'Mail not sent. Request failed with status code 400' in str(exc_info.value)


@pytest.mark.asyncio
async def test_send_prediction_failure(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    response = mailgun_post_tracking_failure()

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_send_prediction_failure_exception(setup):

    lib_settings.set_mailgun_domain('test_domain')
    lib_settings.set_mailgun_api_key('test_key')
    lib_settings.set_user_email('test_email')

    with pytest.raises(Exception) as exc_info:
        failed_response = mailgun_post_prediction_failure_exception()

    assert 'Mail not sent. Request failed with status code 400' in str(exc_info.value)

