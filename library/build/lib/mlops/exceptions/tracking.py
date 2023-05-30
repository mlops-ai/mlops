from requests import Response


def project_id_is_none_exception():
    return ValueError('Project ID not specified')


def experiment_id_is_none_exception():
    return ValueError('Experiment ID not specified')


def failed_to_set_active_project_exception(e):
    return Exception(f"Failed to set active project: {e}")


def failed_to_set_active_experiment_exception(e):
    return Exception(f"Failed to set active experiment: {e}")


def request_failed_exception(response: Response):
    detail = response.json()['detail']
    return Exception(f"Request failed with status code {response.status_code}: {detail}")
