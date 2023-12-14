# mlops-library

# MLOps Tracking Module

Tracking module is used to track machine learning module during the process of their creation, training and evaluation. It allows users to store the most important information about the model (model name, dataset, parameters etc.) and later displays the information in MLOps App to provide insight.

## Projects

An MLOps Project is a single machine learning project that consists of multiple experiments and models run as iterations

### mlops.tracking.create_project

Function creates a project based on the unique title.

**Arguments:**

* **title:** string

  Title of the created project

* **description:** string, _optional_

  Description of the created project.

* **status**: string, _optional_

  Status of the created project

* **archived**: bool, _optional_
  
  Archived status of the created project

**Returns:**

* **project**: dictionary
  
  JSON data of the created project

### mlops.tracking.get_project

Function retrieves an existing project from MLOps App

**Arguments:**

* **project_id:**

    Id od the desired project, that will be retrieved from MLOps app

**Returns:**

* **project:** dictionary

    JSON data of the project

## Experiments

MLOps experiment is a machine learning experiment that can contain many iterations

### mlops.tracking.get_experiment

Function retrieves an experiment from MLOps App

**Arguments:**

* **experiment_id:** string

    Id of the experiment, that will be retrieved from MLOps app

* **project_id:** string, _optional_

    Id of the project, that the experiment comes from. By default value is the active project

**Returns:**

* **experiment:** dictionary

    JSON data of the experiment

### mlops.tracking.create_experiment

Function creates a new experiment

**Arguments:**
* **name:** string

    Name of the created experiment

* **description:** string, _optional_

    Description of the created experiment

* **project_id:** string, _optional_

    Id of the project, that the experiment comes from

**Returns:**

* **experiment:** dictionary

    JSON data of the created experiment

### mlops.tracking.create_dataset

Function creates new mlops dataset

**Arguments**

* **dataset_name**: name of the created dataset

* **path_to_dataset**: path to dataset files

* **dataset_description**: short description of the dataset displayed in the app

* **tags**: tags for dataset

* **version**: version of the dataset

**Returns**:

* **dataset**: json data of created dataset

## Iterations

MLOps Iterations contain informations of a single machine learning model run

### mlops.tracking.start_iteration

Function creates an instance of Iteration

**Arguments:**

* **iteration_name:** string

    name of the created iteration

* **project_id:** string, _optional_

    Id of the target project. By default value is the id of the active project

* **experiment_id:** string, _optional_

    Id of the target experiment. By default value is the id of the active experiment

**Returns:**

* **iteration** dictionary
    JSON data of the created iteration


### iteration.log_path_to_model

Function logs the path to model file

**Arguments:**

* **path_to_model:** string

    Path to the file containing the tracked model

### iteration.log_metric

Function logs a single metric along with it's value

**Arguments:**

* **metric_name:** string

    Name of the logged metric

* **value:**

    Value of the logged metric

### iteration.log_metrics

Function logs multiple metrics at once

**Arguments:**

* **metrics**: dictionary

    Dictionary containing metric: value pairs that are going to be logged

### iteration.log_parameter

Function logs a single parameter along with it's value

**Arguments:**

* **parameter_name:**

    Name of the logged parameter

* **value:**

    Value of the logged parameter

### iteration.log_parameters

Function logs multiple parameters at once

**Arguments:**

* **parameters:** dictionary

    Dictionary containing parameter: value pairs that are going to be logged

### iteration.log_dataset

Function logs an existing dataset with an iteration.

**Arguments:**

* **dataset_id:** string
    
    Id of an existing dataset in webapp

### iteration.end_iteration

Function ends the iteration and sends the logged data to the MLOps App

**Returns:**

* **iteration:** dictionary

    JSON data of created iteration

## Settings

Tracking module contains local settings that can specify active project and experiment

### mlops.tracking.set_active_project

Function sets the active project to given project id of an existing MLOps project

**Arguments:**

* **project_id:** string

    Id of the project, that will be set as active

**Returns:**

* **result:** string

    Message informing about the new active project

### mlops.tracking.set_active_experiment

Function sets the active experiment to given experiment id of an existing MLOps experiment

**Arguments:**

* **experiment_id:** string

    Id of the experiment, that will be set as active

**Returns:**

* **result:** string

    Message informing about the new active experiment
