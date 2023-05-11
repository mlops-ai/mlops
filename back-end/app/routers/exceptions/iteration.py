from fastapi import HTTPException, status


def iteration_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Iteration not found."
    )