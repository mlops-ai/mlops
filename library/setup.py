import pathlib
from setuptools import setup, find_packages

# The directory containing this file
HERE = pathlib.Path(__file__).parent.parent

# The text of the README file
README = (HERE/"README.md").read_text()

setup(
   name="mlops-ai",
   version="1.3.3",
   description="Mlops-ai library for managing machine learning projects, experiments, iterations and datasets.",
   long_description=README,
   long_description_content_type="text/markdown",
   url="https://mlops-ai.github.io/mlops/",
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
   install_requires=["requests==2.29.0", "scikit-learn==1.3.0", "torch==2.1.1", "json2html==1.3.0"],
   project_urls={
        "Documentation": "https://mlops-ai.github.io/mlops/library_docs/library_overview.html",
        "Repository": "https://github.com/mlops-ai/mlops",
    },
 )
