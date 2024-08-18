from app.models.experiment import Experiment
from app.models.iteration import Iteration
from app.services.iteration_service import IterationService

from typing import Literal, List


class ExperimentService:

    @staticmethod
    def update_experiment_columns_metadata(experiment: Experiment, iteration: Iteration = None,
                                           method=Literal['created', 'deleted']) -> None:
        """
        Update experiment columns metadata.

        Args:
        - **experiment (Experiment)**: Experiment
        - **iteration (Iteration)**: Iteration
        - **method (Literal['created', 'deleted'])**: Update method

        Returns:
        - **None**
        """
        # For backwards compatibility, check if columns_metadata is not present in experiment
        if not iteration and not experiment.columns_metadata:
            experiment.columns_metadata = {}

            for iteration in experiment.iterations:
                metrics = IterationService.get_metrics(iteration)
                parameters = IterationService.get_parameters(iteration)

                ExperimentService.__increment_columns_metadata(experiment, metrics, parameters)

        # If iteration is provided
        if iteration:
            # If method is created, increment count of columns
            if method == "created":
                metrics = IterationService.get_metrics(iteration)
                parameters = IterationService.get_parameters(iteration)

                ExperimentService.__increment_columns_metadata(experiment, metrics, parameters)

            # If method is deleted, decrement count of columns
            elif method == "deleted":
                metrics = IterationService.get_metrics(iteration)
                parameters = IterationService.get_parameters(iteration)

                ExperimentService.__decrement_columns_metadata(experiment, metrics, parameters)

    @staticmethod
    def __increment_columns_metadata(experiment: Experiment,
                                     metrics: List[str] = None,
                                     parameters: List[str] = None) -> None:
        """
        Increment experiment columns metadata.

        Args:
        - **experiment (Experiment)**: Experiment
        - **metrics (List[str])**: List of metrics
        - **parameters (List[str])**: List of parameters

        Returns:
        - **None**
        """
        if metrics:
            for metric in metrics:
                if metric not in experiment.columns_metadata:
                    experiment.columns_metadata[metric] = {"type": "metric", "count": 1}
                else:
                    experiment.columns_metadata[metric]["count"] += 1

        if parameters:
            for parameter in parameters:
                if parameter not in experiment.columns_metadata:
                    experiment.columns_metadata[parameter] = {"type": "parameter", "count": 1}
                else:
                    experiment.columns_metadata[parameter]["count"] += 1

    @staticmethod
    def __decrement_columns_metadata(experiment: Experiment,
                                     metrics: List[str] = None,
                                     parameters: List[str] = None) -> None:
        """
        Decrement experiment columns metadata.

        Args:
        - **experiment (Experiment)**: Experiment
        - **metrics (List[str])**: List of metrics
        - **parameters (List[str])**: List of parameters

        Returns:
        - **None**
        """
        if metrics:
            for metric in metrics:
                experiment.columns_metadata[metric]["count"] -= 1
                if experiment.columns_metadata[metric]["count"] == 0:
                    del experiment.columns_metadata[metric]

        if parameters:
            for parameter in parameters:
                experiment.columns_metadata[parameter]["count"] -= 1
                if experiment.columns_metadata[parameter]["count"] == 0:
                    del experiment.columns_metadata[parameter]
