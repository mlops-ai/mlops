from fastapi import HTTPException, status


def chart_name_in_iteration_not_unique_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Chart names in iteration must be unique"
    )
