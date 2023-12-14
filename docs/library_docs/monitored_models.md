---
layout: default
title: Monitored models
nav_order: 1
parent: Monitoring module
grand_parent: Library
---

# Monitored models

Monitored models are mlops app objects that all of the monitoring module is based around. They represent a trained ml model that is ready to be used to make predictions. MLOps library provides the user with functionality to create models, download ml model information from the app and to make predictions using Pandas DataFrames and model registered in the MLOps app

### mlops.monitoring.create_model

Function creates monitored model within MLOps app

**Arguments:**

* **model_name:** string

    Unique name of the created name

* **model_description:** string, _optional_

    Description of monitored model

* **iteration_dict:** dictionary, _optional_

    Dictionary containing valid iteration data with a path to model. It is recommended to use the result of the iteration.end_iteration method

**Returns:**

* **monitored_model:** string

    Json data of monitored model

### mlops.monitoring.get_model_by_name

Function for retrieving mlops monitored model from database

**Arguments:**

* **model_name:** string

    Unique name of the monitored model to be retrieved

**Returns:**

* **monitored_model:** dictionary

    Json data of monitored model

### mlops.monitoring.set_active_model

Function for setting active model from monitored models

**Arguments:**

* **model_name:** string

    Name of monitored model, that will be set as active

**Returns:**

* **result:** string

    Information about new active model setup

### mlops.monitoring.send_prediction

Function to invoke a prediction from monitored model. Function accepts a Pandas dataframe, where every record is
taken as a separate prediction.

**Arguments:**

* **model_name:** string

    Name of monitored model that will be used in prediction

* **data:** Pandas Dataframe

    Pandas Dataframe containing data for prediction. Each row of data in the dataframe is used for a separate prediction

* **send_email:** bool,  _optional_

    If true email will be sent to email address specified in library settings. False by default.

**Returns:**

* **prediction:** list of dictionaries

    List of dictionaries containing results for each executed prediction
