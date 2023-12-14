---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: about
title: About
nav_order: 1
---

# **Welcome**

**mlops** is an open-source tool for **tracking** & **monitoring** machine learning models

![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?style=for-the-badge&logo=FastAPI&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![PyPI](https://img.shields.io/badge/PyPI-3775A9.svg?style=for-the-badge&logo=PyPI&logoColor=white)

[![PyPI version](https://badge.fury.io/py/mlops-ai.svg)](https://badge.fury.io/py/mlops-ai)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Table of Contents
- [Introduction](#introduction)
- [Technologies](#technologies)
- [Installation & usage](#installation--usage)
- [License](#license)
- [Contact](#contact)
- [References](#references)
- 
## Introduction

End-to-end machine learning projects require long-term lifecycles during which different models are evaluated,
with various hyperparameters or data representations. 
Then, out of all the experiments, a final model must be selected for deployment in the production environment.
There are some solutions available to manage the model creation process, such as [mlflow](https://mlflow.org/)
or [neptune.ai](https://neptune.ai/). However, none of them support the functionality of monitoring a deployed model in production.

As part of the mlops project, we aim to create a ready-to-use tool for professionals in the Machine Learning industry 
allowing them not only to **manage experiments during model creation process (tracking module)**, 
but also **monitoring a deployed model working on real-world production data (monitoring module)**

## Technologies

Application consist of two main components:
- Main application (client + server) written in [React](https://reactjs.org/) and [FastAPI](https://fastapi.tiangolo.com/), 
which you can run using [Docker](https://www.docker.com/).
- [Python package](https://pypi.org/project/mlops-ai/) for communication with the application.

Additionally, we use [mongoDB](https://www.mongodb.com/) database for storing tracking module data.

## Installation & usage

To install the application locally, you need to have [docker](https://docs.docker.com/get-docker/) and 
[docker-compose](https://docs.docker.com/compose/install/) installed on your machine. 
Then, you can run the following command:

```bash
docker-compose up
```

After that you can access the application at [http://localhost:3000](http://localhost:3000).


To install the python package make sure you have [Python >=3.9](https://www.python.org/downloads/) installed on your machine.
Then, you can install the package using pip:

```bash
pip install mlops-ai
```

You can find more information about the package in the [PyPI documentation](https://pypi.org/project/mlops-ai/).
Some example notebooks are also provided inside the `library/tests/notebooks` directory.


## License

Distributed under the open-source Apache 2.0 License. See `LICENSE` for more information.


## Contact

Project authors are (in alphabetical order):
- [Jędrzej Rybczyński (back-end, library)](https://github.com/directtt)
- [Kacper Pękalski (back-end, library)](https://github.com/kacperxxx)
- [Kajetan Szal(back-end, library)](https://github.com/kajetsz/)
- [Paweł Łączkowski (front-end)](https://github.com/dzikafoczka)

Feel free to contact us in case of any questions or suggestions.

## References

This project was created as a final BE project of Computer Science course at
[Faculty of Mathematics and Computer Science](https://wmi.amu.edu.pl/en) 
of [Adam Mickiewicz University](https://amu.edu.pl/en). 
