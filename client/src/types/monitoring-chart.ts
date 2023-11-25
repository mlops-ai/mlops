import { Prediction } from "./prediction";

export enum MonitoringChartType {
    HISTOGRAM = "histogram",
    COUNTPLOT = "countplot",
    SCATTER = "scatter",
    SCATTER_WITH_HISTOGRAMS = "scatter_with_histograms",
    TIMESERIES = "timeseries",
    REGRESSION_METRICS = "regression_metrics",
    CLASSIFICATION_METRICS = "classification_metrics",
    CONFUSION_MATRIX = "confusion_matrix",
}

export enum RegressionMetric {
    R2_SCORE = "r2",
    MEAN_SQUARED_ERROR = "mse",
    ROOT_MEAN_SQUARED_ERROR = "rmse",
    MEAN_ABSOLUTE_ERROR = "mae",
    MEDIAN_ABSOLUTE_ERROR = "medae",
    MEAN_SQUARED_LOG_ERROR = "msle",
    ROOT_MEAN_SQUARED_LOG_ERROR = "rmsle",
    SYMMETRIC_MEAN_ABSOLUTE_PERCENTAGE_ERROR = "smape",
}

export enum ClassificationMetric {
    ACCURACY = "accuracy",
    PRECISION = "precision",
    RECALL = "recall",
    F1_SCORE = "f1score",
    MCC = "mcc",
    // ROC_AUC = "roc_auc",
    // ROC_AUC_SCORE = "roc_auc_score",
    // LOG_LOSS = "log_loss",
    // HINGE_LOSS = "hinge_loss",
}

export enum BinMethod {
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

    x_axis_column?: string;
    y_axis_columns?: string[];
    first_column?: string;
    second_column?: string;
    
    bin_method?: BinMethod;
    bin_number?: number;

    metrics?: string[];
    columns?: string[];
}

export interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    onEdit: () => void;
    theme: "dark" | "light" | "system";
}