---
layout: default
title: Projects
nav_order: 1
parent: Tracking module
grand_parent: Library
---

# Projects

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

### mlops.tracking.set_active_project

Function sets the active project to given project id of an existing MLOps project

**Arguments:**

* **project_id:** string

    Id of the project, that will be set as active

**Returns:**

* **result:** string

    Message informing about the new active project
