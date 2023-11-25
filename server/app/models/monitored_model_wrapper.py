import pandas as pd
import numpy as np
from torch import nn
import torch


class BaselineNN(nn.Module):
    def __init__(self, input_shape: int, hidden_units: int, output_shape: int):
        super().__init__()
        self.layer_stack = nn.Sequential(
            nn.Linear(in_features=input_shape, out_features=hidden_units),
            nn.ReLU(),
            nn.Linear(in_features=hidden_units, out_features=output_shape)
        )

    def forward(self, x):
        return self.layer_stack(x)


class MonitoredModelWrapper:
    """
    A wrapper for monitored model that does not have .predict() method from dataframe (like scikit-learn API).
    In this example, we will use a PyTorch model for Iris classification.
    """

    def __init__(self, model: BaselineNN):
        self.model: BaselineNN = model

    def predict(self, data: pd.DataFrame) -> np.array:
        """
        Predicts target values from input pandas dataframe.

        Args:
            data (pd.DataFrame): Input data.

        Returns:
            np.array: Predicted target values.
        """
        X_tensor = torch.tensor(data.values, dtype=torch.float32)

        with torch.inference_mode():
            y_logits = self.model(X_tensor)
            y_pred = torch.softmax(y_logits, dim=1).argmax(dim=1)

        return y_pred.numpy()
