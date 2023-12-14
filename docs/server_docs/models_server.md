---
layout: default
title: Object Models
nav_order: 6
parent: Server
---

# Project model

**Attributes:**

* **id (str)**: Project ID.
* **title (str)**: Project title.
* **description (str)**: Project description.
* **status (str)**: Project status.
* **archived (bool)**: Project archived status.
* **created_at (datetime)**: Project creation date.
* **updated_at (datetime)**: Project last update date.
* **experiments (List[Experiment])**: List of experiments in the project.
* **pinned (bool)**: Project pinned status.

## UpdateProject model

**Attributes:**

* **title (str)**: Project title.
* **description (str)**: Project description.
* **status (str)**: Project status.
* **archived (bool)**: Project archived status.
* **updated_at (datetime)**: Project last update date.
* **pinned (bool)**: Project pinned status.

## DisplayProject model

**Attributes:**

* **id (str)**: Project ID.
* **title (str)**: Project title.
* **description (str)**: Project description.
* **status (str)**: Project status.
* **archived (bool)**: Project archived status.
* **created_at (datetime)**: Project creation date.
* **updated_at (datetime)**: Project last update date.
* **experiments (List[str])**: List of experiments in the project.

## Experiment model

**Attributes:**

* **id (PydanticObjectId)**: Experiment ID.
* **project_id (PydanticObjectId)**: Project ID.
* **name (str)**: Experiment title.
* **description (Optional[str])**: Experiment description.
* **created_at (datetime)**: Experiment creation date.
* **updated_at (Optional[datetime])**: Experiment last update date.
* **iterations (List[Iteration])**: Experiment iterations.

## UpdateExperiment model

**Attributes:**

* **name (Optional[str])**: Experiment title.
* **description (Optional[str])**: Experiment description.
* **updated_at (datetime)**: Experiment last update date.

## Iteration model

**Attributes:**

* **id (PydanticObjectId)**: Iteration id.
* **experiment_id (PydanticObjectId)**: Experiment id.
* **project_id (PydanticObjectId)**: Project id.
* **experiment_name (str)**: Experiment name.
* **project_title (str)**: Project title.
* **user_name (str)**: User name.
* **iteration_name (str)**: Iteration title.
* **created_at (datetime)**: Iteration creation date.
* **metrics (Optional[dict])**: Iteration metrics.
* **parameters (Optional[dict])**: Iteration parameters.
* **path_to_model (Optional[str])**: Path to model.
* **dataset (Optional[DatasetInIteration])**: Dataset.
* **interactive_charts (Optional[List[InteractiveChart]])**: Interactive charts list.
* **image_charts (Optional[List[ImageChart]])**: Image charts list.
* **assigned_monitored_model_id (Optional[PydanticObjectId])**: Assigned monitored model id.
* **assigned_monitored_model_name (Optional[str])**: Assigned monitored model name.

## UpdateIteration model

**Attributes:**

* **iteration_name (str)**: Iteration title.
* **assigned_monitored_model_id (Optional[PydanticObjectId])**: Assigned monitored model id.
* **assigned_monitored_model_name (Optional[str])**: Assigned monitored model name.

## ImageChart model

**Attributes:**

* **id (PydanticObjectId)**: Chart id.
* **name (str)**: Chart name.
* **encoded_image (str)**: base64 encoded chart image.
* **comparable (Optional[bool])**: Is chart comparable.

## InteractiveChart model

**Attributes:**

* **id (PydanticObjectId)**: Chart id.
* **chart_type (str)**: Chart type.
* **name (str)**: Logical name of chart.
* **chart_title (str)**: Chart title.
* **chart_subtitle (Optional[str])**: Chart subtitle.
* **x_data(List[float])**: X data.
* **y_data (List[float])**: Y data.
* **y_data_names (Optional[List[str]])**: Y data names.
* **x_label (Optional[str])**: X label.
* **y_label (Optional[str])**: Y label.
* **x_min (Optional[float])**: X axis minimum value.
* **x_max (Optional[float])**: X axis maximum value.
* **y_min (Optional[float])**: Y axis minimum value.
* **y_max (Optional[float])**: Y axis maximum value.
* **comparable (Optional[bool])**: Is comparable.

## Dataset model

**Attributes:**

* **id dataset_name (str)**: Dataset name
* **path_to_dataset (str)**: Path to dataset
* **dataset_description (str)**: Dataset description
* **tags (str)**: Dataset tags
* **archived (bool)**: Dataset status
* **created_at (datetime)**: Date and time of dataset creation
* **updated_at (datetime)**: Date and time of dataset update
* **version (str)**: Dataset version
* **linked_iterations (Dict)**: Linked iterations (key - iteration id, value - (project_id, experiment_id)
* **pinned** (bool): Dataset pinned status

## DatasetInIteration model

**Attributes:**

* **id (PydanticObjectId)**: Dataset id.
* **name (Optional[str])**: Dataset name.
* **version (Optional[str])**: Dataset version.

## UpdateDataset model

**Attributes:**

* **dataset_name (str)**: Dataset name
* **path_to_dataset (str)**: Path to dataset
* **dataset_description (str)**: Dataset description
* **tags (str)**: Dataset tags
* **archived (bool)**: Dataset status
* **version (str)**: Dataset version
* **updated_at (datetime)**: Date and time of dataset update
* **pinned** (bool): Dataset pinned status

## MonitoredModel model

**Attributes:**

* **id (PydanticObjectId)**: Monitored model id.
* **model_name (str)**: Monitored model name.
* **model_description (str)**: Monitored model description.
* **model_status (str)**: Monitored model status.
* **iteration (Iteration)**: Related Iteration.
* **pinned (bool)**: Monitored model pinned status.
* **predictions_data (list[dict])**: Predictions data list of rows as dicts.
* **ml_model (str)**: ML model
* **interactive_charts (list[MonitoredModelInteractiveChart])**: Interactive charts
* **interactive_charts_existed (set[tuple[str, Optional[str], Optional[str]]])**: Interactive charts existed pairs of columns
* **created_at (datetime)**: Monitored model creation date.
* **updated_at (datetime)**: Monitored model last update date.

## UpdateMonitoredModel model

**Attributes:**

* **model_name (str)**: Monitored model name.
* **model_description (str)**: Monitored model description.
* **model_status (str)**: Monitored model status.
* **iteration (Iteration)**: Related Iteration.
* **pinned (bool)**: Monitored model pinned status.
* **predictions_data (list[dict])**: Predictions data list of rows as dicts.
* **updated_at (datetime)**: Monitored model last update date.

## PredictionData model

**Attributes:**

* **prediction_date (datetime)**: Prediction date.
* **input_data (dict)**: Input data.
* **prediction (Union[float, int])**: Prediction.
* **actual (Union[float, int])**: Actual.

## UpdatePredictionData model

**Attributes:**

* **actual (Union[float, int])**: actual prediction value.

## MonitoredModelInteractiveChart model

**Attributes:**

* **id (PydanticObjectId)**: Interactive chart id.
* **monitored_model_id (PydanticObjectId)**: Monitored model id.
* **chart_type (str)**: Chart type.
* **first_column (str)**: First column name.
* **second_column (Optional[str])**: Second column name.
* **bin_method (Optional[str])**: Bin method.
* **bin_number (Optional[int])**: Bin number.
