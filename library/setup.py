import pathlib
from setuptools import setup, find_packages

# The directory containing this file
HERE = pathlib.Path(__file__).parent

# The text of the README file
README = (HERE/"README.md").read_text()

setup(
   name="mlops-ai",
   version="1.2.5",
   description="Mlops-ai library for managing machine learning projects, experiments, iterations and datasets.",
   long_description=README,
   long_description_content_type="text/markdown",
   URL="https://github.com/kajetsz/mlops/tree/main/library",
   author="Kacper Pękalski, Kajetan Szal, Jędrzej Rybczyński",
   author_email="kac.pekalski1@gmail.com",
   license="Apache License 2.0",
   classifiers=[
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",

   ],
   packages=find_packages(exclude=["tests*"]),
   include_package_data=True,
   install_requires=["requests==2.29.0", "scikit-learn==1.3.0", "torch==2.1.1"],
 )
