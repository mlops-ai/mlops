import base64

import pandas as pd
from typing import List, Union
import pickle
from datetime import datetime
from beanie import PydanticObjectId
from fastapi import APIRouter, status

from app.models.iteration import Iteration
from app.models.monitored_model import MonitoredModel, UpdateMonitoredModel
from app.models.monitored_model_chart import MonitoredModelInteractiveChart
from app.models.prediction_data import PredictionData, UpdatePredictionData
from app.models.project import Project
from app.routers.exceptions.experiment import experiment_not_found_exception
from app.routers.exceptions.iteration import iteration_not_found_exception
from app.routers.exceptions.monitored_model import monitored_model_not_found_exception, \
    monitored_model_name_not_unique_exception, monitored_model_has_no_iteration_exception, \
    monitored_model_has_iteration_exception, iteration_has_no_path_to_model_exception, \
    monitored_model_load_ml_model_exception, monitored_model_prediction_exception, \
    monitored_model_encoding_pkl_file_exception, monitored_model_no_ml_model_to_decode_exception, \
    monitored_model_decoding_pkl_file_exception, monitored_model_has_no_iteration_to_check_exception, \
    iteration_is_assigned_to_monitored_model_exception, monitored_model_has_no_predictions_data_exception, \
    monitored_model_chart_column_bad_type_exception, monitored_model_chart_bad_bin_method_exception, \
    monitored_model_chart_bad_bin_type_or_value_exception, monitored_model_chart_bad_bin_number_type_exception, \
    monitored_model_chart_bad_bin_method_type_exception, monitored_model_chart_columns_different_values_exception, \
    monitored_model_bad_values_exception, monitored_model_chart_not_found_exception, \
    monitored_model_chart_existing_pair_of_columns_of_chart_type_exception, \
    monitored_model_chart_changing_columns_exception, monitored_model_prediction_not_found_exception
from app.routers.exceptions.project import project_not_found_exception

monitored_model_router = APIRouter()


@monitored_model_router.get("/", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_all_monitored_models() -> List[MonitoredModel]:
    """
    Get all monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all monitored models.
    """

    monitored_models = await MonitoredModel.find_all().to_list()
    return monitored_models


@monitored_model_router.get("/non-archived", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_non_archived_monitored_models() -> List[MonitoredModel]:
    """
    Get all non-archived monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all non-archived monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status != 'archived').to_list()
    return monitored_models


@monitored_model_router.get("/archived", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_archived_monitored_models() -> List[MonitoredModel]:
    """
    Get all archived monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all archived monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status == 'archived').to_list()
    return monitored_models


@monitored_model_router.get("/active", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_active_monitored_models() -> List[MonitoredModel]:
    """
    Get all active monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all active monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status == 'active').to_list()
    return monitored_models


@monitored_model_router.get("/idle", response_model=List[MonitoredModel], status_code=status.HTTP_200_OK)
async def get_idle_monitored_models() -> List[MonitoredModel]:
    """
    Get all idle monitored models.

    Args:
    - **None**

    Returns:
    - **List[MonitoredModel]**: List of all idle monitored models.
    """

    monitored_models = await MonitoredModel.find(MonitoredModel.model_status == 'idle').to_list()
    return monitored_models


@monitored_model_router.get('/name/{name}', response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def get_monitored_model_by_name(name: str) -> MonitoredModel:
    """
    Retrieve monitored model by name.

    Args:
    - **name (str)**: Monitored model name

    Returns:
    - **MonitoredModel**: Monitored model
    """

    monitored_model = await MonitoredModel.find_one(MonitoredModel.model_name == name)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    return monitored_model


@monitored_model_router.get('/id/{id}', response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def get_monitored_model_by_id(id: PydanticObjectId) -> MonitoredModel:
    """
    Retrieve monitored model by id.

    Args:
    - **id (str)**: Monitored model id

    Returns:
    - **MonitoredModel**: Monitored model
    """

    monitored_model = await MonitoredModel.find_one(MonitoredModel.id == id)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    return monitored_model


@monitored_model_router.post("/", response_model=MonitoredModel, status_code=status.HTTP_201_CREATED)
async def create_monitored_model(monitored_model: MonitoredModel) -> MonitoredModel:
    """
    Add new monitored model.

    Args:
    - **monitored_model** (MonitoredModel): Monitored model to add.

    Returns:
    - **MonitoredModel**: Added monitored model.
    """
    unique_name = await is_name_unique(monitored_model.model_name)
    if not unique_name:
        raise monitored_model_name_not_unique_exception()

    if monitored_model.iteration is None and monitored_model.model_status not in ('idle', 'archived'):
        raise monitored_model_has_no_iteration_exception()
    elif monitored_model.iteration is not None and monitored_model.model_status == 'idle':
        raise monitored_model_has_iteration_exception()

    if monitored_model.iteration is not None:
        iteration_to_check = await get_iteration_from_monitored_model(monitored_model)
        if iteration_to_check.assigned_monitored_model_id is not None and \
                iteration_to_check.assigned_monitored_model_name is not None:
            raise iteration_is_assigned_to_monitored_model_exception()

    monitored_model = await monitored_model.insert()
    if monitored_model.iteration is not None:
        iteration_with_assigned_model = await update_assigned_model_in_iteration(monitored_model.iteration,
                                                                                 monitored_model.id,
                                                                                 monitored_model.model_name)
        monitored_model.iteration = iteration_with_assigned_model
        encoded_ml_model = await update_ml_model_to_encoded_in_monitored_model(monitored_model.iteration)
        monitored_model.ml_model = encoded_ml_model

    await monitored_model.save()

    return monitored_model


@monitored_model_router.put("/{id}", response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def update_monitored_model(id: PydanticObjectId, updated_monitored_model: UpdateMonitoredModel) -> MonitoredModel:
    """
    Update monitored model.

    Args:
    - **id (PydanticObjectId)**: Monitored model id
    - **monitored_model (MonitoredModel)**: Monitored model to update

    Returns:
    - **MonitoredModel**: Updated monitored model
    """

    monitored_model = await MonitoredModel.get(id)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    if updated_monitored_model.model_name is not None:
        unique_name = await is_name_unique(updated_monitored_model.model_name)
        if not unique_name:
            raise monitored_model_name_not_unique_exception()

    if updated_monitored_model.iteration is not None:
        # check if iteration has model path
        if not updated_monitored_model.iteration.path_to_model:
            raise iteration_has_no_path_to_model_exception()
        if updated_monitored_model.model_status == 'idle':
            raise monitored_model_has_iteration_exception()
        elif updated_monitored_model.model_status is None:
            if monitored_model.model_status == 'idle':
                raise monitored_model_has_iteration_exception()
    elif updated_monitored_model.iteration is None:
        if monitored_model.iteration is not None:
            if updated_monitored_model.model_status is not None:
                if updated_monitored_model.model_status not in ('active', 'archived'):
                    raise monitored_model_has_iteration_exception()
        else:
            if updated_monitored_model.model_status is not None:
                if updated_monitored_model.model_status not in ('idle', 'archived'):
                    raise monitored_model_has_no_iteration_exception()

    if updated_monitored_model.iteration is not None:
        if monitored_model.iteration is not None:
            # Remove the association from the old iteration if there was one
            await update_assigned_model_in_iteration(monitored_model.iteration, None, None)
            # Update the new iteration with the model ID and get the updated iteration
            if updated_monitored_model.model_name is not None:
                iteration_with_assigned_model = await update_assigned_model_in_iteration(
                    updated_monitored_model.iteration,
                    monitored_model.id,
                    updated_monitored_model.model_name)
            else:
                iteration_with_assigned_model = await update_assigned_model_in_iteration(
                    updated_monitored_model.iteration,
                    monitored_model.id,
                    monitored_model.model_name)
            # Update monitored_model's iteration with the updated iteration
            updated_monitored_model.iteration = iteration_with_assigned_model
        elif monitored_model.iteration is None:
            # This is a new assignment, update the new iteration with the model ID and get the updated iteration
            if updated_monitored_model.model_name is not None:
                iteration_with_assigned_model = await update_assigned_model_in_iteration(
                    updated_monitored_model.iteration,
                    monitored_model.id,
                    updated_monitored_model.model_name)
            else:
                iteration_with_assigned_model = await update_assigned_model_in_iteration(
                    updated_monitored_model.iteration,
                    monitored_model.id,
                    monitored_model.model_name)
            # Update monitored_model's iteration with the updated iteration
            updated_monitored_model.iteration = iteration_with_assigned_model

        encoded_ml_model = await update_ml_model_to_encoded_in_monitored_model(updated_monitored_model.iteration)
        updated_monitored_model.ml_model = encoded_ml_model

    updated_monitored_model.updated_at = datetime.now()
    await monitored_model.update({"$set": updated_monitored_model.dict(exclude_unset=True)})
    monitored_model = await MonitoredModel.get(id)
    await monitored_model.save()

    return monitored_model


@monitored_model_router.delete("/{id}", response_model=MonitoredModel, status_code=status.HTTP_200_OK)
async def delete_monitored_model(id: PydanticObjectId) -> MonitoredModel:
    """
    Delete monitored model.

    Args:
    - **id (PydanticObjectId)**: Monitored model id

    Returns:
    - **MonitoredModel**: Deleted monitored model
    """

    monitored_model = await MonitoredModel.find_one(MonitoredModel.id == id)
    if not monitored_model:
        raise monitored_model_not_found_exception()

    if monitored_model.iteration is not None:
        await update_assigned_model_in_iteration(monitored_model.iteration, None, None)

    await monitored_model.delete()
    return monitored_model


@monitored_model_router.get('/{id}/ml-model-metadata', response_model=dict, status_code=status.HTTP_200_OK)
async def get_monitored_model_ml_model_metadata(id: PydanticObjectId) -> dict:
    """
    Get monitored model ml model metadata.

    Args:
    - **id (str)**: Monitored model id

    Returns:
    - **dict**: Monitored model ml model metadata.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()
    if not monitored_model.iteration:
        raise monitored_model_has_no_iteration_exception()

    try:
        ml_model = await load_ml_model(monitored_model)
    except Exception as e:
        raise monitored_model_load_ml_model_exception(str(e))

    return {
        'response_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'ml_model': str(ml_model)
    }


@monitored_model_router.post('/{id}/predict', response_model=list[PredictionData], status_code=status.HTTP_200_OK)
async def monitored_model_predict(id: PydanticObjectId, data: list[dict]) -> list[PredictionData]:
    """
    Make prediction using monitored model ml model. <br>
    **NOTE:** ml model needs to be complied with scikit-learn API.

    Args:
    - **id (str)**: Monitored model id
    - **data (list[dict])**: List of samples to make prediction on.

    Returns:
    - **list[PredictionData]**: List of predictions data.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()
    if not monitored_model.iteration:
        raise monitored_model_has_no_iteration_exception()

    try:
        ml_model = await load_ml_model(monitored_model)
    except Exception as e:
        raise monitored_model_load_ml_model_exception(str(e))

    predictions_data = []
    for sample in data:
        try:
            prediction = ml_model.predict(pd.DataFrame([sample]))[0]
            prediction_data = PredictionData(
                input_data=sample,
                prediction=prediction
            )
            predictions_data.append(prediction_data)
            monitored_model.predictions_data.append(prediction_data)
            await monitored_model.save()
        except Exception as e:
            raise monitored_model_prediction_exception(str(e))

    return predictions_data


@monitored_model_router.put('/{id}/predictions/{prediction_id}', response_model=PredictionData, status_code=status.HTTP_200_OK)
async def monitored_model_set_actual_prediction_value(id: PydanticObjectId, prediction_id: PydanticObjectId, updated_prediction: UpdatePredictionData) -> PredictionData:
    """
    Set actual prediction value.

    Args:
    - **id (str)**: Monitored model id
    - **prediction_id (str)**: Prediction id.

    Returns:
    - **PredictionData**: Updated prediction.
    """

    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()

    prediction = next((prediction for prediction in monitored_model.predictions_data if prediction.id == prediction_id), None)
    if not prediction:
        monitored_model_prediction_not_found_exception()

    prediction.actual = updated_prediction.actual
    await monitored_model.save()

    return prediction


@monitored_model_router.delete('/{id}/predictions/{prediction_id}/actual', response_model=PredictionData, status_code=status.HTTP_200_OK)
async def monitored_model_delete_prediction_actual(id: PydanticObjectId, prediction_id: PydanticObjectId) -> PredictionData:
    """
    Delete actual prediction value.

    Args:
    - **id (str)**: Monitored model id
    - **prediction_id (str)**: Prediction id.

    Returns:
    - **PredictionData**: Updated prediction.
    """

    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()

    prediction = next((prediction for prediction in monitored_model.predictions_data if prediction.id == prediction_id), None)
    if not prediction:
        monitored_model_prediction_not_found_exception()

    prediction.actual = None
    await monitored_model.save()

    return prediction


@monitored_model_router.post('/{id}/charts', response_model=MonitoredModelInteractiveChart,
                             status_code=status.HTTP_201_CREATED)
async def add_chart_to_monitored_model(id: PydanticObjectId,
                                       chart: MonitoredModelInteractiveChart) -> MonitoredModelInteractiveChart:
    """
    Add chart to monitored model.

    Args:
    - **id (str)**: Monitored model id
    - **chart (MonitoredModelInteractiveChart)**: Chart to add to monitored model.

    Returns:
    - **MonitoredModelInteractiveChart**: Added chart.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()

    if not monitored_model.predictions_data:
        raise monitored_model_has_no_predictions_data_exception()

    data = pd.DataFrame([{**prediction.input_data, 'prediction': prediction.prediction, 'actual': prediction.actual} for
                         prediction in monitored_model.predictions_data])

    if (chart.chart_type, chart.first_column, chart.second_column) in monitored_model.interactive_charts_existed:
        raise monitored_model_chart_existing_pair_of_columns_of_chart_type_exception(chart.chart_type,
                                                                                     chart.first_column,
                                                                                     chart.second_column)

    validated_chart = validate_chart(chart, data)
    if validated_chart:
        chart.monitored_model_id = monitored_model.id
        monitored_model.interactive_charts.append(chart)
        monitored_model.interactive_charts_existed.add((chart.chart_type, chart.first_column, chart.second_column))

    await monitored_model.save()

    return chart


@monitored_model_router.get('/{id}/charts/{chart_id}', response_model=MonitoredModelInteractiveChart)
async def get_chart_from_monitored_model(id: PydanticObjectId, chart_id: PydanticObjectId) \
        -> MonitoredModelInteractiveChart:
    """
    Get chart from monitored model.

    Args:
    - **id (str)**: Monitored model id
    - **chart_id (str)**: Chart id.

    Returns:
    - **MonitoredModelInteractiveChart**: Chart.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()

    chart = next((chart for chart in monitored_model.interactive_charts if chart.id == chart_id), None)
    if not chart:
        raise monitored_model_chart_not_found_exception()

    return chart


@monitored_model_router.put('/{id}/charts/{chart_id}', response_model=MonitoredModelInteractiveChart, status_code=status.HTTP_200_OK)
async def update_chart_from_monitored_model(id: PydanticObjectId, chart_id: PydanticObjectId, updated_chart: MonitoredModelInteractiveChart) -> MonitoredModelInteractiveChart:
    """
    Update chart from monitored model.

    Args:
    - **id (str)**: Monitored model id
    - **chart_id (str)**: Chart id.
    - **chart (MonitoredModelInteractiveChart)**: Chart to update.

    Returns:
    - **MonitoredModelInteractiveChart**: Updated chart.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()

    chart = next((chart for chart in monitored_model.interactive_charts if chart.id == chart_id), None)
    if not chart:
        raise monitored_model_chart_not_found_exception()

    data = pd.DataFrame([{**prediction.input_data, 'prediction': prediction.prediction} for prediction in
                         monitored_model.predictions_data])

    if chart.chart_type == updated_chart.chart_type and chart.first_column == updated_chart.first_column and chart.second_column == updated_chart.second_column:
        validated_chart = validate_chart(updated_chart, data)
        updated_chart.monitored_model_id = monitored_model.id
        chart = updated_chart
    else:
        raise monitored_model_chart_changing_columns_exception()

    await monitored_model.save()

    return chart


@monitored_model_router.delete('/{id}/charts/{chart_id}', response_model=MonitoredModelInteractiveChart)
async def delete_chart_from_monitored_model(id: PydanticObjectId, chart_id: PydanticObjectId) -> MonitoredModelInteractiveChart:
    """
    Delete chart from monitored model.

    Args:
    - **id (str)**: Monitored model id
    - **chart_id (str)**: Chart id.

    Returns:
    - **MonitoredModelInteractiveChart**: Deleted chart.
    """
    monitored_model = await MonitoredModel.get(id)

    if not monitored_model:
        raise monitored_model_not_found_exception()

    chart = next((chart for chart in monitored_model.interactive_charts if chart.id == chart_id), None)
    if not chart:
        raise monitored_model_chart_not_found_exception()

    monitored_model.interactive_charts_existed.remove((chart.chart_type, chart.first_column, chart.second_column))
    monitored_model.interactive_charts.remove(chart)
    await monitored_model.save()

    return chart


async def is_name_unique(name: str) -> bool:
    """
    Util function for checking if monitored model name is unique.

    Args:
        name: Monitored model name to check.

    Returns:
        True if name is unique, False otherwise.
    """

    monitored_model = await MonitoredModel.find_one(
        MonitoredModel.model_name == name
    )
    if monitored_model:
        return False
    return True


async def update_assigned_model_in_iteration(iteration_to_found: Iteration, monitored_model_id: PydanticObjectId,
                                             monitored_model_name: str):
    """
    Util function for getting iteration and assigning to assigned_monitored_model_id parameter to monitored_model_id.

    Args:
        iteration_to_found: Iteration to get.
        monitored_model_id: Monitored model id.
        monitored_model_name: Monitored model name.
    Returns:
        Iteration.
    """
    project = await Project.get(iteration_to_found.project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == iteration_to_found.experiment_id),
                      None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration = next((iter for iter in experiment.iterations if iter.id == iteration_to_found.id), None)
    if not iteration:
        raise iteration_not_found_exception()

    iteration.assigned_monitored_model_id = monitored_model_id
    iteration.assigned_monitored_model_name = monitored_model_name
    await project.save()

    return iteration


async def update_ml_model_to_encoded_in_monitored_model(iteration_to_found: Iteration):
    """
    Util function for getting iteration and assigning to ml_model MonitoredModel parameter encoded pkl file.

    Args:
        iteration_to_found: Iteration to get.
        monitored_model_id: Monitored model id.

    Returns:
        None
    """
    project = await Project.get(iteration_to_found.project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == iteration_to_found.experiment_id),
                      None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration = next((iter for iter in experiment.iterations if iter.id == iteration_to_found.id), None)
    if not iteration:
        raise iteration_not_found_exception()

    encoded_ml_model = await load_ml_model_from_file_and_encode(iteration.path_to_model)

    return encoded_ml_model


async def load_ml_model_from_file_and_encode(pkl_file_path) -> str:
    """
    Load ml model from file and encode it to base64.

    Args:
        pkl_file_path: Path to pkl file.

    Returns:
        ml_model: Encoded ml model.
    """
    try:
        # Load the model from the file
        ml_model = pickle.load(open(pkl_file_path, 'rb'))

        # Serialize the model
        ml_model = pickle.dumps(ml_model)

        # Encode the serialized model as base64
        ml_model = base64.b64encode(ml_model).decode("utf-8")

        return ml_model

    except Exception as e:
        # Handle any exceptions or errors that may occur
        raise monitored_model_encoding_pkl_file_exception(str(e))


async def load_and_decode_pkl(monitored_model: MonitoredModel) -> object:
    """
    Load and decode pkl file.

    Args:
        monitored_model: Monitored model to load and decode pkl file.

    Returns:
        decoded_model: Decoded model.
    """
    try:
        if monitored_model.ml_model:
            # Load and deserialize the pickled model from ml_model
            model_data = base64.b64decode(monitored_model.ml_model.encode("utf-8"))
            decoded_model = pickle.loads(model_data)

            # Now, loaded_model contains your decoded model
            return decoded_model
        else:
            raise monitored_model_no_ml_model_to_decode_exception()

    except Exception as e:
        # Handle any exceptions or errors that may occur during decoding
        raise monitored_model_decoding_pkl_file_exception(str(e))


async def load_ml_model(monitored_model: MonitoredModel) -> object:
    """
    Load ml model from path using pickle.

    Args:
        monitored_model: Monitored model to load ml model from path.

    Returns:
        Loaded ml model instance.
    """
    ml_model = await load_and_decode_pkl(monitored_model)

    return ml_model


async def get_iteration_from_monitored_model(monitored_model: MonitoredModel) -> Iteration:
    """
    Get iteration from monitored model.

    Args:
        monitored_model: Monitored model to get iteration from.

    Returns:
        Iteration.
    """
    project = await Project.get(monitored_model.iteration.project_id)
    if not project:
        raise project_not_found_exception()

    experiment = next((exp for exp in project.experiments if exp.id == monitored_model.iteration.experiment_id),
                      None)
    if not experiment:
        raise experiment_not_found_exception()

    iteration = next((iter for iter in experiment.iterations if iter.id == monitored_model.iteration.id), None)
    if not iteration:
        raise iteration_not_found_exception()

    return iteration


def validate_chart(chart: MonitoredModelInteractiveChart, data: pd.DataFrame) -> MonitoredModelInteractiveChart:
    if chart.chart_type == 'histogram':
        if not pd.api.types.is_numeric_dtype(data[chart.first_column]):
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'numeric', 'first_column')
        if chart.second_column is not None:
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'None', 'second_column')
        if chart.bin_method not in MonitoredModelInteractiveChart.Settings.bin_methods:
            raise monitored_model_chart_bad_bin_method_exception(chart.chart_type)
        if chart.bin_method == 'fixedNumber':
            if not isinstance(chart.bin_number, int) or chart.bin_number <= 1:
                raise monitored_model_chart_bad_bin_type_or_value_exception(chart.bin_method)
        else:
            if chart.bin_number is not None:
                raise monitored_model_chart_bad_bin_number_type_exception(chart.chart_type)
    elif chart.chart_type == 'countplot':
        if not pd.api.types.is_string_dtype(data[chart.first_column]) and not pd.api.types.is_numeric_dtype(
                data[chart.first_column]):
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'string or numeric', 'first_column')
        if chart.second_column is not None:
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'None', 'second_column')
        if chart.bin_method is not None:
            raise monitored_model_chart_bad_bin_method_type_exception(chart.chart_type)
        if chart.bin_number is not None:
            raise monitored_model_chart_bad_bin_number_type_exception(chart.chart_type)
    elif chart.chart_type == 'scatter':
        if not pd.api.types.is_numeric_dtype(data[chart.first_column]) or not pd.api.types.is_numeric_dtype(data[chart.second_column]):
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'numeric', 'first_column or second_column')
        if chart.first_column == chart.second_column:
            raise monitored_model_chart_columns_different_values_exception(chart.chart_type)
        if chart.bin_method is not None:
            raise monitored_model_chart_bad_bin_method_type_exception(chart.chart_type)
        if chart.bin_number is not None:
            raise monitored_model_chart_bad_bin_number_type_exception(chart.chart_type)
    elif chart.chart_type == 'scatter_with_histograms':
        if not pd.api.types.is_numeric_dtype(data[chart.first_column]) or not pd.api.types.is_numeric_dtype(data[chart.second_column]):
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'numeric', 'first_column or second_column')
        if chart.first_column == chart.second_column:
            raise monitored_model_chart_columns_different_values_exception(chart.chart_type)
        if chart.bin_method not in MonitoredModelInteractiveChart.Settings.bin_methods:
            raise monitored_model_chart_bad_bin_method_exception(chart.chart_type)
        if chart.bin_method == 'fixedNumber':
            if not isinstance(chart.bin_number, int) or chart.bin_number <= 1:
                raise monitored_model_chart_bad_bin_type_or_value_exception(chart.bin_method)
        else:
            if chart.bin_number is not None:
                raise monitored_model_chart_bad_bin_number_type_exception(chart.chart_type)
    elif chart.chart_type == 'timeseries':
        if not pd.api.types.is_numeric_dtype(data[chart.first_column]):
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'numeric', 'first_column')
        if chart.second_column is not None:
            raise monitored_model_chart_column_bad_type_exception(chart.chart_type, 'None', 'second_column')
        if chart.bin_method is not None:
            raise monitored_model_chart_bad_bin_method_type_exception(chart.chart_type)
        if chart.bin_number is not None:
            raise monitored_model_chart_bad_bin_number_type_exception(chart.chart_type)
    elif chart.chart_type == 'regression_metrics':
        if chart.first_column is not None or chart.second_column is not None or chart.bin_method is not None or chart.bin_number is not None:
            raise monitored_model_bad_values_exception(chart.chart_type)
    elif chart.chart_type == 'classification_metrics':
        if chart.first_column is not None or chart.second_column is not None or chart.bin_method is not None or chart.bin_number is not None:
            raise monitored_model_bad_values_exception(chart.chart_type)

    return chart
