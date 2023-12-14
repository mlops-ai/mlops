---
layout: default
title: Datasets
nav_order: 4
has_toc: true
parent: Tracking module
grand_parent: Library
---

# Datasets

MLOps provides a way to store dataset info in the app, below function allows for creation of the dataset objects straight from code.

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