from fastapi import HTTPException, status

from app.models.monitored_model_chart import MonitoredModelInteractiveChart


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


def monitored_model_has_no_predictions_data_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Monitored model has no predictions data."
    )


def monitored_model_chart_column_bad_type_exception(chart_type: str, data_type: str, column_name: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid type for '{column_name}'. Must be {data_type} for chart type '{chart_type}'"
    )


def monitored_model_chart_bad_bin_method_exception(chart_type: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid bin method for chart type '{chart_type}'. Must be one "
               f"of {MonitoredModelInteractiveChart.Settings.bin_methods}")


def monitored_model_chart_bad_bin_type_or_value_exception(bin_method: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid type or value for 'bin_number'. Must be integer for bin method '{bin_method}'. "
               f"Must be greater than 1."
    )


def monitored_model_chart_bad_bin_method_type_exception(chart_type: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid value for 'bin_number'. Must be None for chart type '{chart_type}'.")


def monitored_model_chart_bad_bin_number_type_exception(chart_type: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid value for 'bin_number'. Must be None for chart type '{chart_type}'.")


def monitored_model_chart_columns_different_values_exception(chart_type: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"First column and second column must be different for chart type '{chart_type}'.")


def monitored_model_bad_values_exception(chart_type: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid value for 'first_column', 'second_column', 'bin_method' or 'bin_number'. Must be None for "
               f"chart type '{chart_type}'.")


def monitored_model_chart_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Monitored model interactive chart not found."
    )


def monitored_model_chart_existing_pair_of_columns_of_chart_type_exception(chart_type: str, first_column: str, second_column: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Chart type '{chart_type}' already exists for columns '{first_column}' and '{second_column}'."
    )


def monitored_model_chart_changing_columns_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Cannot change columns for existing chart."
    )