from requests import Response


def iteration_request_failed_exception(response: Response):
    detail = response.json()['detail']
    raise Exception(f"Iteration not created. Request failed with status code {response.status_code}: {detail}")


def model_path_not_exist_exception():
    raise FileNotFoundError("Provided model path does not exist.")


def monitored_model_encoding_pkl_file_exception(description: str):
    raise Exception(f"Cannot encode pkl file: {description}")