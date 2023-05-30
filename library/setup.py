import pathlib
from setuptools import setup, find_packages

# The directory containing this file
HERE = pathlib.Path(__file__).parent

# The text of the README file
README = (HERE/"README.md").read_text()

setup(
   name="mlops-ai",
   version="1.0.1",
   description="Mlops-ai library for managing machine learning projects, experiments, iterations and datasets.",
   long_description=README,
   long_description_content_type="text/markdown",
   URL="https://github.com/kajetsz/mlops/tree/main/library",
   author="Kacper Pękalski, Kajetan Szal, Jędrzej Rybczyński",
   license="Apache License 2.0",
   classifiers=[
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",

   ],
   packages=find_packages(),
   includepackagedata=True,
   install_requires=["requests"],
 )