export enum ChartType {
    LINE = "line",
    BAR = "bar",
    PIE = "pie",
    SCATTER = "scatter",
    BOXPLOT = "boxplot"
}
export interface Chart {
    id: string;
    chart_type: ChartType;
    name: string;
    chart_title: string;
    chart_subtitle?: string;
    x_data: any[][];
    y_data: any[][];
    y_data_names?: string[];
    x_label?: string;
    y_label?: string;
    x_min?: number;
    x_max?: number;
    y_min?: number;
    y_max?: number;
    comparable: boolean;

    created_at: Date;
    updated_at: Date;
}