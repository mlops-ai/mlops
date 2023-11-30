# MLOps - Backend

## Routers

### Project routers

#### GET /projects/

Get all projects

**Arguments:**
- None

**Returns:**
- List[Project]: List of all projects

#### GET /projects/{id}

Get project by id

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- Project: Project with given id

#### POST /projects/

Add new project

**Arguments:**
- project(Project): Project to add

**Returns:**
- Project: Added project

#### GET /projects/base

Get base information about all projects.

**Arguments:**
- None

**Returns:**
- List[DisplayProject]: List of base information about all projects

#### GET /projects/{id}/base

Get base information about project by id.

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- DisplayProject: Base information about project.

#### GET /projects/archived

Get all archived projects.

**Arguments:**
- None

**Returns:**
- List[Project]: List of all archived projects

#### GET /projects/non-archived

Get all non-archived projects.

**Arguments:**
- None

**Returns:**
- List[Project]: List of all non-archived projects

#### PUT /projects/{id}

Update project by id.

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- Project: Updated project.

#### DELETE /projects/{id}

Delete project by id.

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- None

#### GET /projects/title/{title}

Get project by title.

**Arguments:**
- title (str): Project title

**Returns:**
- Project: Project with given title.

### Experiment routers

#### GET /projects/{project_id}/experiments/

Retrieve all experiments.

**Arguments:**
- project_id (PydanticObjectId): Project id

**Returns:**
- List[Experiment]: List of experiments for the project

#### POST /projects/{project_id}/experiments/

Add new experiment.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment (Experiment): Experiment

**Returns:**
- Experiment: Experiment

#### GET /projects/{project_id}/experiments/{id}

Retrieve experiment by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- id (PydanticObjectId): Experiment id

**Returns:**
- Experiment: Experiment

#### PUT /projects/{project_id}/experiments/{id}

Update experiment by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- id (PydanticObjectId): Experiment id
- updated_experiment (UpdateExperiment): Updated experiment

**Returns:**
- Experiment: Experiment

#### DELETE /projects/{project_id}/experiments/{id}

Delete experiment by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- id (PydanticObjectId): Experiment id

**Returns:**
- None

#### GET /projects/{project_id}/experiments/name/{name}

Retrieve experiment by name.

**Arguments:**
- project_id (PydanticObjectId): Project id
- name (str): Experiment name

**Returns:**
- Experiment: Experiment

#### POST /projects/{project_id}/experiments/delete_iterations

Delete iterations by ids.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_dict (Dict[PydanticObjectId, List[PydanticObjectId]]): Dictionary with experiment id as key and list of iteration ids as value

**Returns:**
- None

### Iteration routers

#### GET /projects/{project_id}/experiments/{experiment_id}/iterations/

Retrieve all iteration for selected experiment.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id

**Returns:**
- List[Iteration]: List of iterations

#### POST /projects/{project_id}/experiments/{experiment_id}/iterations/

Add new iteration to experiment.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- iteration (Iteration): Iteration

**Returns:**
- Iteration: Iteration added to experiment

#### GET /projects/{project_id}/experiments/{experiment_id}/iterations/{id}

Retrieve iteration by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- id (PydanticObjectId): Iteration id

**Returns:**
- Iteration: Iteration

#### PUT /projects/{project_id}/experiments/{experiment_id}/iterations/{id}

Update iteration by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- id (PydanticObjectId): Iteration id
- updated_iteration (UpdateIteration): Updated iteration

**Returns:**
- Iteration: Updated iteration

#### DELETE /projects/{project_id}/experiments/{experiment_id}/iterations/{id}

Delete iteration by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- id (PydanticObjectId): Iteration id

**Returns:**
- None

#### GET /projects/{project_id}/experiments/{experiment_id}/iterations/name/{name}

Retrieve all iterations by name.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- name (str): Iteration name

**Returns:**
- List[Iteration]: List of iterations with selected name

### Dataset routers

#### GET /datasets/

Retrieve all datasets.

**Arguments:**
- None

**Returns:**
- List[Dataset]: List of datasets

#### POST /datasets/

Create dataset.

**Arguments:**
- dataset (Dataset): Dataset

**Returns:**
- Dataset: Dataset

#### GET /datasets/non-archived

Get all non-archived datasets.

**Arguments:**
- None

**Returns:**
- List[Dataset]: List of all non-archived datasets

#### GET /datasets/archived

Get all archived datasets.

**Arguments:**
- None

**Returns:**
- List[Dataset]: List of all archived datasets

#### GET /datasets/name/{name}

Retrieve dataset by name.

**Arguments:**
- name (str): Dataset name

**Returns:**
- Dataset: Dataset

#### GET /datasets/{id}

Retrieve dataset by id.

**Arguments:**
- id (PydanticObjectId): Dataset id

**Returns:**
- Dataset: Dataset

#### PUT /datasets/{id}

Update dataset by id

**Arguments:**
- id (PydanticObjectId): Dataset id
- dataset (UpdateDataset): Dataset

**Returns:**
- Dataset: Dataset

#### DELETE /datasets/{id}

Delete dataset by id

**Arguments:**
- id (PydanticObjectId): Dataset id

**Returns:**
- None

### Monitored Model routers

#### GET /monitored-models/

Get all monitored models.

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all monitored models

#### GET /monitored-models/non-archived

Get all non-archived monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all non-archived monitored models

#### GET /monitored-models/archived

Get all archived monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all archived monitored models

#### GET /monitored-models/active

Get all active monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all active monitored models

#### GET /monitored-models/idle

Get all idle monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all idle monitored models

#### GET /monitored-models/name/{name}

Retrieve monitored model by name

**Arguments:**
- name (str): Monitored model name

**Returns:**
- MonitoredModel: Monitored model

#### GET /monitored-models/id/{id}

Retrieve monitored model by id

**Arguments:**
- id (PydanticObjectId): Monitored model id

**Returns:**
- MonitoredModel: Monitored model

#### POST /monitored-models/

Add new monitored model

**Arguments:**
- monitored_model (MonitoredModel): Monitored model to add

**Returns:**
- MonitoredModel: Added monitored model

#### PUT /monitored-models/{id}

Update monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- monitored_model (MonitoredModel): Monitored model to update

**Returns:**
- MonitoredModel: Updated monitored model

#### DELETE /monitored-models/{id}

Delete monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id

**Returns:**
- MonitoredModel: Deleted monitored model

#### GET /monitored-models/{id}/ml-model-metadata

Get monitored model ml model metadata

**Arguments:**
- id (PydanticObjectId): Monitored model id

**Returns:**
- dict: Monitored model ml model metadata

#### GET /monitored-models/{id}/predict

Make prediction using monitored model ml model. 
**NOTE:** ml model needs to be complied with scikit-learn API.

**Arguments:**
- id (PydanticObjectId): Monitored model id
- data (list[dict]): List of samples to make prediction on

**Returns:**
- list[PredictionData]: List of predictions data

#### PUT /monitored-models/{id}/predictions/{prediction_id}

Set actual prediction value

**Arguments:**
- id (PydanticObjectId): Monitored model id
- prediction_id (str): Prediction id

**Returns:**
- PredictionData: Updated prediction

#### DELETE /monitored-models/{id}/predictions/{prediction_id}/actual

Delete actual prediction value

**Arguments:**
- id (PydanticObjectId): Monitored model id
- prediction_id (str): Prediction id

**Returns:**
- PredictionData: Updated prediction

#### POST /monitored-models/{id}/charts

Add chart to monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- chart (MonitoredModelInteractiveChart): Chart to add to monitored model

**Returns:**
- MonitoredModelInteractiveChart: Added chart

#### GET /monitored-models/{id}/charts/{charts_id}

Get chart from monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- chart_id (PydanticObjectId): Chart id

**Returns:**
- MonitoredModelInteractiveChart: Chart

#### DELETE /monitored-models/{id}/charts/{charts_id}

Delete chart from monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- chart_id (PydanticObjectId): Chart id

**Returns:**
- MonitoredModelInteractiveChart: Deleted chart

## Model

### Project model

**Attributes:**
- id (str): Project ID.
- title (str): Project title.
- description (str): Project description.
- status (str): Project status.
- archived (bool): Project archived status.
- created_at (datetime): Project creation date.
- updated_at (datetime): Project last update date.
- experiments (List[Experiment]): List of experiments in the project.
- pinned (bool): Project pinned status.

### UpdateProject model

**Attributes:**
- title (str): Project title.
- description (str): Project description.
- status (str): Project status.
- archived (bool): Project archived status.
- updated_at (datetime): Project last update date.
- pinned (bool): Project pinned status.

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
