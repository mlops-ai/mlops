import { BinMethods, MonitoringChartType } from "@/types/monitoring_chart";
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
    [MonitoringChartType.SCATTER_WITH_HISTOGRAMS]: <p>Scatter with histograms</p>
}

export const binMethodsMap = {
    [BinMethods.SQUARE_ROOT]: <p>Square root rule</p>,
    [BinMethods.SCOTT]: <p>Scott rule</p>,
    [BinMethods.FREEDMAN_DIACONIS]: <p>Freedman-Diaconis rule</p>,
    [BinMethods.STURGES]: <p>Sturges rule</p>,
    [BinMethods.FIXED_NUMBER]: <p>Fixed number of bins</p>,
};

export const binMethodsChartMap = {
    [BinMethods.SQUARE_ROOT]: 'Square root rule',
    [BinMethods.SCOTT]: 'Scott rule',
    [BinMethods.FREEDMAN_DIACONIS]: 'Freedman-Diaconis rule',
    [BinMethods.STURGES]: 'Sturges rule',
    [BinMethods.FIXED_NUMBER]: 'Fixed number of bins',
};