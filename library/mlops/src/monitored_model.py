from mlops.src.iteration import Iteration


class MonitoredModel:
    """
    Monitored model.

    Attributes:
    - **id (PydanticObjectId)**: Monitored model id.
    - **model_name (str)**: Monitored model name.
    - **model_description (str)**: Monitored model description.
    - **model_status (str)**: Monitored model status.
    - **iteration (Iteration)**: Related Iteration.
    """

    def __init__(self, model_name: str, model_description: str = None, iteration: Iteration = None):
        self.model_name: str = model_name
        self.model_description: str = model_description
        self.iteration: Iteration = iteration
