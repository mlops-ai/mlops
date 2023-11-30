import { ChartType } from "@/types/chart";
import { Chart } from "@/types/chart";

export const xAxis1 = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];

export const xAxis2 = [["RMSE", "MSE", "MAPE", 123]];

export const xAxis3 = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["RMSE", "MSE", "MAPE", 123],
];

export const xAxis4 = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18],
    [19, 20],
];

export const xAxis5 = [[0, 9, 8, 7, 6, 5, 4, 3, 2, 1, "tekst"]];

export const charts1 = [
    {
        id: "1",
        chart_type: ChartType.LINE,
        name: "chart1",
        chart_title: "chart1",
        x_data: xAxis1,
        y_data: xAxis1,
        comparable: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: "1",
        chart_type: ChartType.LINE,
        name: "chart2",
        chart_title: "chart2",
        x_data: xAxis4,
        y_data: xAxis4,
        comparable: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
] as Chart[];

export const charts2 = [
    {
        id: "3",
        chart_type: ChartType.SCATTER,
        name: "chart3",
        chart_title: "chart3",
        x_data: xAxis3,
        y_data: xAxis1,
        comparable: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: "4",
        chart_type: ChartType.SCATTER,
        name: "chart4",
        chart_title: "chart4",
        x_data: xAxis4,
        y_data: xAxis4,
        comparable: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
] as Chart[];

export const charts3 = [
    {
        id: "5",
        chart_type: ChartType.LINE,
        name: "chart5",
        chart_title: "chart5",
        x_data: xAxis5,
        y_data: xAxis1,
        comparable: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: "6",
        chart_type: ChartType.LINE,
        name: "chart6",
        chart_title: "chart6",
        x_data: xAxis2,
        y_data: xAxis4,
        comparable: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: "7",
        chart_type: ChartType.LINE,
        name: "chart7",
        chart_title: "chart7",
        x_data: xAxis1,
        y_data: xAxis4,
        comparable: false,
        created_at: new Date(),
        updated_at: new Date(),
    },
] as Chart[];
