---
layout: default
title: Experiments
nav_order: 2
parent: Tracking module
grand_parent: Library
---

# Experiments

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

### mlops.tracking.set_active_experiment

Function sets the active experiment to given experiment id of an existing MLOps experiment

**Arguments:**

* **experiment_id:** string

    Id of the experiment, that will be set as active

**Returns:**

* **result:** string

    Message informing about the new active experiment