---
layout: default
title: Iterations
nav_order: 3
parent: Server
---


# Iteration routers

### GET /projects/{project_id}/experiments/{experiment_id}/iterations/

Retrieve all iteration for selected experiment.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id

**Returns:**
- List[Iteration]: List of iterations

### POST /projects/{project_id}/experiments/{experiment_id}/iterations/

Add new iteration to experiment.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- iteration (Iteration): Iteration

**Returns:**
- Iteration: Iteration added to experiment

### GET /projects/{project_id}/experiments/{experiment_id}/iterations/{id}

Retrieve iteration by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- id (PydanticObjectId): Iteration id

**Returns:**
- Iteration: Iteration

### PUT /projects/{project_id}/experiments/{experiment_id}/iterations/{id}

Update iteration by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- id (PydanticObjectId): Iteration id
- updated_iteration (UpdateIteration): Updated iteration

**Returns:**
- Iteration: Updated iteration

### DELETE /projects/{project_id}/experiments/{experiment_id}/iterations/{id}

Delete iteration by id.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- id (PydanticObjectId): Iteration id

**Returns:**
- None

### GET /projects/{project_id}/experiments/{experiment_id}/iterations/name/{name}

Retrieve all iterations by name.

**Arguments:**
- project_id (PydanticObjectId): Project id
- experiment_id (PydanticObjectId): Experiment id
- name (str): Iteration name

**Returns:**
- List[Iteration]: List of iterations with selected name