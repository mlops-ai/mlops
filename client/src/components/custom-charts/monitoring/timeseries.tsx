import ReactEcharts from "echarts-for-react";

import { timeseriesOptions } from "./timeseries/timeseries-options";
import { Prediction } from "@/types/prediction";
import { MonitoringChart } from "@/types/monitoring-chart";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    onEdit: () => void;
    theme: "dark" | "light" | "system";
}

const Timeseries = ({
    chart_schema,
    predictionsData,
    onOpen,
    onEdit,
    theme,
}: MonitoringChartProps) => {
    let seriesData: any[] = [];

    for (let i = 0; i < chart_schema.y_axis_columns!.length; i++) {
        let columnData;

        switch (chart_schema.y_axis_columns![i]) {
            case "prediction":
                columnData = predictionsData.map((row) => [
                    new Date(row.prediction_date),
                    row.prediction,
                ]);
                break;

            case "actual":
                columnData = predictionsData
                    .filter(
                        (row: Prediction) =>
                            row.actual !== null && row.actual !== undefined
                    )
                    .map((row) => [new Date(row.prediction_date), row.actual]);
                break;

            default:
                columnData = predictionsData.map((row) => [
                    new Date(row.prediction_date),
                    row.input_data[chart_schema.y_axis_columns![i] as string],
                ]);
                break;
        }
        seriesData.push({
            name: chart_schema.y_axis_columns![i] as string,
            type: "line",
            showSymbol: false,
            data: columnData,
        });
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                style={{ height: "400px", width: "100%" }}
                option={timeseriesOptions(
                    chart_schema.y_axis_columns as string[],
                    onOpen,
                    onEdit,
                    theme,
                    seriesData
                )}
                theme="customed"
            />
        </div>
    );
};

export default Timeseries;
