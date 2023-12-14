---
layout: default
title: Datasets
nav_order: 4
parent: Server
---

# Dataset routers

### GET /datasets/

Retrieve all datasets.

**Arguments:**
- None

**Returns:**
- List[Dataset]: List of datasets

### POST /datasets/

Create dataset.

**Arguments:**
- dataset (Dataset): Dataset

**Returns:**
- Dataset: Dataset

### GET /datasets/non-archived

Get all non-archived datasets.

**Arguments:**
- None

**Returns:**
- List[Dataset]: List of all non-archived datasets

### GET /datasets/archived

Get all archived datasets.

**Arguments:**
- None

**Returns:**
- List[Dataset]: List of all archived datasets

### GET /datasets/name/{name}

Retrieve dataset by name.

**Arguments:**
- name (str): Dataset name

**Returns:**
- Dataset: Dataset

### GET /datasets/{id}

Retrieve dataset by id.

**Arguments:**
- id (PydanticObjectId): Dataset id

**Returns:**
- Dataset: Dataset

### PUT /datasets/{id}

Update dataset by id

**Arguments:**
- id (PydanticObjectId): Dataset id
- dataset (UpdateDataset): Dataset

**Returns:**
- Dataset: Dataset

### DELETE /datasets/{id}

Delete dataset by id

**Arguments:**
- id (PydanticObjectId): Dataset id

**Returns:**
- None