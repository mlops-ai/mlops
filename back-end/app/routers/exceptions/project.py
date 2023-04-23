from fastapi import HTTPException, status


def project_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Project not found."
    )


def project_title_not_unique_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Project with that title already exists."
    )


def project_has_remaining_experiments_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Project has remaining experiments."
    )
