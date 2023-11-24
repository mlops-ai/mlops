import { BinMethod, ClassificationMetric, MonitoringChartType, RegressionMetric } from "@/types/monitoring-chart";
import { ProjectStatus } from "@/types/types";

export const projectStatusesMap = {
    completed: <p>Finished</p>,
    in_progress: <p>In&nbsp;progress</p>,
    not_started: <p>Not&nbsp;started</p>,
};

export const statuses = [
    ProjectStatus.NOT_STARTED,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.FINISHED,
];

export const modelStatusesMap = {
    active: <p>Active</p>,
    idle: <p>Idle</p>,
    archived: <p>Archived</p>,
};

export const monitoringChartTypesMap = {
    [MonitoringChartType.HISTOGRAM]: <p>Histogram</p>,
    [MonitoringChartType.TIMESERIES]: <p>Timeseries</p>,
    [MonitoringChartType.CLASSIFICATION_METRICS]: <p>Classification metrics</p>,
    [MonitoringChartType.REGRESSION_METRICS]: <p>Regression metrics</p>,
    [MonitoringChartType.COUNTPLOT]: <p>Countplot</p>,
    [MonitoringChartType.SCATTER]: <p>Scatter</p>,
    [MonitoringChartType.SCATTER_WITH_HISTOGRAMS]: <p>Scatter with histograms</p>,
    [MonitoringChartType.CONFUSION_MATRIX]: <p>Confusion matrix</p>,
}

export const binMethodsMap = {
    [BinMethod.SQUARE_ROOT]: <p>Square root rule</p>,
    [BinMethod.SCOTT]: <p>Scott rule</p>,
    [BinMethod.FREEDMAN_DIACONIS]: <p>Freedman-Diaconis rule</p>,
    [BinMethod.STURGES]: <p>Sturges rule</p>,
    [BinMethod.FIXED_NUMBER]: <p>Fixed number of bins</p>,
};

export const binMethodsChartMap = {
    [BinMethod.SQUARE_ROOT]: 'Square root rule',
    [BinMethod.SCOTT]: 'Scott rule',
    [BinMethod.FREEDMAN_DIACONIS]: 'Freedman-Diaconis rule',
    [BinMethod.STURGES]: 'Sturges rule',
    [BinMethod.FIXED_NUMBER]: 'Fixed number of bins',
};

export const classificationMetricsMap = {
    [ClassificationMetric.MCC]: "MCC (Matthews Correlation Coefficient)",
    [ClassificationMetric.ACCURACY]: "Accuracy",
    [ClassificationMetric.F1_SCORE]: "F1 Score",
    [ClassificationMetric.PRECISION]: "Precision",
    [ClassificationMetric.RECALL]: "Recall",
};

export const regressionMetricsMap = {
    [RegressionMetric.R2_SCORE]: "R2",
    [RegressionMetric.MEAN_ABSOLUTE_ERROR]: "MAE",
    [RegressionMetric.MEAN_SQUARED_ERROR]: "MSE",
    [RegressionMetric.ROOT_MEAN_SQUARED_ERROR]: "RMSE",
    [RegressionMetric.ROOT_MEAN_SQUARED_LOG_ERROR]: "RMSLE",
    [RegressionMetric.MEAN_SQUARED_LOG_ERROR]: "MSLE",
    [RegressionMetric.MEDIAN_ABSOLUTE_ERROR]: "MedianAE",
    [RegressionMetric.SYMMETRIC_MEAN_ABSOLUTE_PERCENTAGE_ERROR]: "SMAPE",
};