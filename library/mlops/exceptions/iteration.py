from requests import Response


def iteration_request_failed_exception(response: Response):
    detail = response.json()['detail']
    return Exception(f"Iteration not created. Request failed with status code {response.status_code}: {detail}")


def model_path_not_exist_exception():
    return FileNotFoundError("Provided model path does not exist.")
