<img src="https://raw.githubusercontent.com/mlops-ai/mlops/develop/client/public/mlops.svg?sanitize=true" alt="MLOps logo" height="100">

# mlops
Open-source tool for **tracking** & **monitoring** machine learning models. 

![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?style=for-the-badge&logo=FastAPI&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![PyPI](https://img.shields.io/badge/PyPI-3775A9.svg?style=for-the-badge&logo=PyPI&logoColor=white)

[![PyPI version](https://badge.fury.io/py/mlops-ai.svg)](https://badge.fury.io/py/mlops-ai)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Table of Contents
- [Introduction](#introduction)
- [Explanatory video](#explanatory-video)
- [Installation & usage](#installation--usage)
- [Technologies](#technologies)
- [Documentation](#documentation)
- [Examples](#examples)
- [License](#license)
- [Contact](#contact)
- [References](#references)
- [To-Do](#to-do)

## Introduction

End-to-end machine learning projects require long-term lifecycles during which different models are evaluated,
with various hyperparameters or data representations. 
Then, out of all the experiments, a final model must be selected for deployment in the production environment.
There are some solutions available to manage the model creation process, such as [mlflow](https://mlflow.org/)
or [neptune.ai](https://neptune.ai/). However, none of them support the functionality of monitoring a deployed model in production.

As a part of the mlops project, we aim to create a ready-to-use tool for professionals in the Machine Learning industry 
allowing them not only to **manage experiments during model creation process (tracking module)**, 
but also **monitoring a deployed model working on real-world production data (monitoring module)** 
with an option to **setup email alerts using [MailGun](https://www.mailgun.com/) (email alerts module)**.

## Explanatory video
[![mlops-ai explanatory video](https://img.youtube.com/vi/eM1tSxPxrsU/maxresdefault.jpg)](https://www.youtube.com/watch?v=eM1tSxPxrsU)

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
## Technologies

Application consist of two main components:
- Main application (client + server) written in [React](https://reactjs.org/) and [FastAPI](https://fastapi.tiangolo.com/), 
which you can run using [Docker](https://www.docker.com/).
- [Python package](https://pypi.org/project/mlops-ai/) for communication with the application.

Additionally, we use [mongoDB](https://www.mongodb.com/) database for storing tracking module data.

## Documentation

You can find the detailed documentation of the application [here](https://mlops-ai.github.io/mlops/).

## Examples

The main end-to-end notebook that 
presents key features of the package can be found 
[here](https://github.com/mlops-ai/mlops/blob/develop/library/tests/notebooks/mlops-ai-library-showcase.ipynb).
Some other example notebooks are also provided inside the `library/tests/notebooks` directory. 

## License

Distributed under the open-source Apache 2.0 License. See `LICENSE` for more information.


## Contact

Project authors are (in alphabetical order):
- [Paweł Łączkowski (front-end)](https://github.com/dzikafoczka)
- [Kacper Pękalski (back-end, library)](https://github.com/kacperxxx)
- [Jędrzej Rybczyński (back-end, library)](https://github.com/directtt)
- [Kajetan Szal(back-end, library)](https://github.com/kajetsz/)

Feel free to contact us in case of any questions or suggestions.

## References

This project was created as a final BE project of Computer Science course at
[Faculty of Mathematics and Computer Science](https://wmi.amu.edu.pl/en) 
of [Adam Mickiewicz University](https://amu.edu.pl/en). 

## To-Do

Application is still under development.
Here is a list of features we plan to implement in the future:
- [x] Add support for the whole monitoring module
- [x] Add support for email alerts
- [x] AWS EC2 integration
- [ ] Add support for multiple users (optionally)
