from requests import Response


def failed_to_set_active_model_exception(e):
    return Exception(f"Failed to set active model: {e}")
