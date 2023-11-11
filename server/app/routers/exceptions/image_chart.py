from fastapi import HTTPException, status


def image_path_not_exist_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Image path does not exist."
    )
