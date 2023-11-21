from fastapi import HTTPException, status


def iteration_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Iteration not found."
    )


def iteration_assigned_to_monitored_model_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Iteration is assigned to monitored model. Cannot delete it. Please delete monitored model first."
    )


def iteration_in_experiment_assigned_to_monitored_model_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Iteration in experiment is assigned to monitored model. Cannot delete it. Please delete monitored model first."
    )


def iteration_in_experiment_in_project_assigned_to_monitored_model_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Iteration in experiment in project is assigned to monitored model. Cannot delete it. Please delete monitored model first."
    )