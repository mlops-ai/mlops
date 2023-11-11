from fastapi import HTTPException, status


def experiment_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Experiment not found."
    )


def experiment_name_not_unique_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Experiment name already exists."
    )


def experiment_has_remaining_iterations_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Experiment has remaining iterations."
    )
