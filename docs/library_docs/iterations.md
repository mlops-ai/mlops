---
layout: default
title: Iterations
nav_order: 3
has_toc: true
parent: Tracking module
grand_parent: Library
---

# Iterations

MLOps Iterations contain information about a single machine learning model run

### mlops.tracking.start_iteration

Function creates an instance of Iteration

**Arguments:**

* **iteration_name:** string

    name of the created iteration

* **project_id:** string, _optional_

    Id of the target project. By default value is the id of the active project

* **experiment_id:** string, _optional_

    Id of the target experiment. By default value is the id of the active experiment

* **send_email:** bool,  _optional_

    If true email will be sent to email address specified in library settings. False by default.

**Returns:**

* **iteration** dictionary
    JSON data of the created iteration

### iteration.log_model_name

Function logs the model name in the currently running iteration.

**Arguments:**

* **model_name:** string

    Name of the model that's being tracked

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
