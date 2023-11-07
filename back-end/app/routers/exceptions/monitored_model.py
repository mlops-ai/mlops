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


def monitored_model_has_no_iteration_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Monitored model has no iteration. Model status must be 'idle' or 'archived'."
    )


def monitored_model_has_iteration_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Monitored model has iteration. Model status must be 'active' or 'archived'."
    )


def iteration_has_no_path_to_model_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Iteration has no path to model."
    )


def monitored_model_load_ml_model_exception(description: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Cannot load ml model: {description}"
    )


def monitored_model_prediction_exception(description: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Cannot make prediction: {description}"
    )


def monitored_model_encoding_pkl_file_exception(description: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Cannot encode pkl file: {description}"
    )


def monitored_model_no_ml_model_to_decode_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="No ml model to decode."
    )


def monitored_model_decoding_pkl_file_exception(description: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Cannot decode pkl file: {description}"
    )


def monitored_model_has_no_iteration_to_check_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Monitored model has no iteration."
    )


def iteration_is_assigned_to_monitored_model_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Iteration is assigned to monitored model."
    )