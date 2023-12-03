from fastapi import HTTPException, status


def dataset_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Dataset not found."
    )


def dataset_name_and_version_not_unique_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Dataset name and version must be unique."
    )