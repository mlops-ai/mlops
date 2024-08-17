from app.models.iteration import Iteration

from typing import List


class IterationService:

    @staticmethod
    def get_metrics(iteration: Iteration) -> List[str]:
        """
        Get metrics from iteration.

        Args:
        - **iteration (Iteration)**: Iteration

        Returns:
        - **List[str]**: List of metrics
        """
        return list(iteration.metrics.keys()) if iteration.metrics else []

    @staticmethod
    def get_parameters(iteration: Iteration) -> List[str]:
        """
        Get parameters from iteration.

        Args:
        - **iteration (Iteration)**: Iteration

        Returns:
        - **List[str]**: List of parameters
        """
        return list(iteration.parameters.keys()) if iteration.parameters else []
