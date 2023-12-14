---
layout: default
title: Experiments
nav_order: 2
parent: Server
---


# Experiment routers

### GET /projects/{project_id}/experiments/

Retrieve all experiments.

**Arguments:**
- project_id (PydanticObjectId): Project id

**Returns:**
- List[Experiment]: List of experiments for the project

### POST /projects/{project_id}/experiments/

Add new experiment.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment (Experiment): Experiment

**Returns:**
- Experiment: Experiment

### GET /projects/{project_id}/experiments/{id}

Retrieve experiment by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- id (PydanticObjectId): Experiment id

**Returns:**
- Experiment: Experiment

### PUT /projects/{project_id}/experiments/{id}

Update experiment by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- id (PydanticObjectId): Experiment id
- updated_experiment (UpdateExperiment): Updated experiment

**Returns:**
- Experiment: Experiment

### DELETE /projects/{project_id}/experiments/{id}

Delete experiment by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- id (PydanticObjectId): Experiment id

**Returns:**
- None

### GET /projects/{project_id}/experiments/name/{name}

Retrieve experiment by name.

**Arguments:**
- project_id (PydanticObjectId): Project id
- name (str): Experiment name

**Returns:**
- Experiment: Experiment

### POST /projects/{project_id}/experiments/delete_iterations

Delete iterations by ids.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_dict (Dict[PydanticObjectId, List[PydanticObjectId]]): Dictionary with experiment id as key and list of iteration ids as value

**Returns:**
- None