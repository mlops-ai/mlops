export enum MonitoringChartType {
    HISTOGRAM = "histogram",
    COUNTPLOT = "countplot",
    SCATTER = "scatter",
    SCATTER_WITH_HISTOGRAMS = "scatter_with_histograms",
    TIMESERIES = "timeseries",
    REGRESSION_METRICS = "regression_metrics",
    CLASSIFICATION_METRICS = "classification_metrics",
}

export enum BinMethods {
    SQUARE_ROOT = "squareRoot",
    STURGES = "sturges",
    FREEDMAN_DIACONIS = "freedmanDiaconis",
    SCOTT = "scott",
    FIXED_NUMBER = "fixedNumber",
}

export interface MonitoringChart {
    id: string;
    monitored_model_id: string;

    chart_type: MonitoringChartType;

    first_column?: string;
    second_column?: string;
    
    bin_method?: string;
    bin_number?: number;
}
