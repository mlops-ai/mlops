---
layout: default
title: Projects
nav_order: 1
parent: Server
---


# Project routers

### GET /projects/

Get all projects

**Arguments:**
- None

**Returns:**
- List[Project]: List of all projects

### GET /projects/{id}

Get project by id

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- Project: Project with given id

### POST /projects/

Add new project

**Arguments:**
- project(Project): Project to add

**Returns:**
- Project: Added project

### GET /projects/base

Get base information about all projects.

**Arguments:**
- None

**Returns:**
- List[DisplayProject]: List of base information about all projects

### GET /projects/{id}/base

Get base information about project by id.

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- DisplayProject: Base information about project.

### GET /projects/archived

Get all archived projects.

**Arguments:**
- None

**Returns:**
- List[Project]: List of all archived projects

### GET /projects/non-archived

Get all non-archived projects.

**Arguments:**
- None

**Returns:**
- List[Project]: List of all non-archived projects

### PUT /projects/{id}

Update project by id.

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- Project: Updated project.

### DELETE /projects/{id}

Delete project by id.

**Arguments:**
- id (PydanticObjectId): Project id

**Returns:**
- None

### GET /projects/title/{title}

Get project by title.

**Arguments:**
- title (str): Project title

**Returns:**
- Project: Project with given title.