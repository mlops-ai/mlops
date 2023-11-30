from requests import Response


def mail_request_failed_exception(response: Response):
    raise Exception(f"Mail not sent. Request failed with status code {response.status_code}: {response.reason}")