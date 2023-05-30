from requests import Response


def iteration_request_failed_exception(response: Response):
    detail = response.json()['detail']
    return Exception(f"Iteration not created. Request failed with status code {response.status_code}: {detail}")