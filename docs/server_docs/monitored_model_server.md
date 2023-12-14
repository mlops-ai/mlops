---
layout: default
title: Monitored Models
nav_order: 5
parent: Server
---


# Monitored Model routers

### GET /monitored-models/

Get all monitored models.

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all monitored models

### GET /monitored-models/non-archived

Get all non-archived monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all non-archived monitored models

### GET /monitored-models/archived

Get all archived monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all archived monitored models

### GET /monitored-models/active

Get all active monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all active monitored models

### GET /monitored-models/idle

Get all idle monitored models

**Arguments:**
- None

**Returns:**
- List[MonitoredModel]: List of all idle monitored models

### GET /monitored-models/name/{name}

Retrieve monitored model by name

**Arguments:**
- name (str): Monitored model name

**Returns:**
- MonitoredModel: Monitored model

### GET /monitored-models/id/{id}

Retrieve monitored model by id

**Arguments:**
- id (PydanticObjectId): Monitored model id

**Returns:**
- MonitoredModel: Monitored model

### POST /monitored-models/

Add new monitored model

**Arguments:**
- monitored_model (MonitoredModel): Monitored model to add

**Returns:**
- MonitoredModel: Added monitored model

### PUT /monitored-models/{id}

Update monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- monitored_model (MonitoredModel): Monitored model to update

**Returns:**
- MonitoredModel: Updated monitored model

### DELETE /monitored-models/{id}

Delete monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id

**Returns:**
- MonitoredModel: Deleted monitored model

### GET /monitored-models/{id}/ml-model-metadata

Get monitored model ml model metadata

**Arguments:**
- id (PydanticObjectId): Monitored model id

**Returns:**
- dict: Monitored model ml model metadata

### GET /monitored-models/{id}/predict

Make prediction using monitored model ml model. 
**NOTE:** ml model needs to be complied with scikit-learn API.

**Arguments:**
- id (PydanticObjectId): Monitored model id
- data (list[dict]): List of samples to make prediction on

**Returns:**
- list[PredictionData]: List of predictions data

### PUT /monitored-models/{id}/predictions/{prediction_id}

Set actual prediction value

**Arguments:**
- id (PydanticObjectId): Monitored model id
- prediction_id (str): Prediction id

**Returns:**
- PredictionData: Updated prediction

### DELETE /monitored-models/{id}/predictions/{prediction_id}/actual

Delete actual prediction value

**Arguments:**
- id (PydanticObjectId): Monitored model id
- prediction_id (str): Prediction id

**Returns:**
- PredictionData: Updated prediction

### POST /monitored-models/{id}/charts

Add chart to monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- chart (MonitoredModelInteractiveChart): Chart to add to monitored model

**Returns:**
- MonitoredModelInteractiveChart: Added chart

### GET /monitored-models/{id}/charts/{charts_id}

Get chart from monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- chart_id (PydanticObjectId): Chart id

**Returns:**
- MonitoredModelInteractiveChart: Chart

### DELETE /monitored-models/{id}/charts/{charts_id}

Delete chart from monitored model

**Arguments:**
- id (PydanticObjectId): Monitored model id
- chart_id (PydanticObjectId): Chart id

**Returns:**
- MonitoredModelInteractiveChart: Deleted chart