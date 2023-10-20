from fastapi import HTTPException, status


def monitored_model_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Monitored model not found."
    )


def monitored_model_name_not_unique_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Monitored model name already exists."
    )
