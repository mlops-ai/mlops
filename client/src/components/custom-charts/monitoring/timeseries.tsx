import ReactEcharts from "echarts-for-react";

import { timeseriesOptions } from "./timeseries/timeseries-options";
import { Prediction } from "@/types/prediction";
import { MonitoringChart } from "@/types/monitoring_chart";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    theme: "dark" | "light" | "system";
}

const Timeseries = ({
    chart_schema,
    predictionsData,
    onOpen,
    theme,
}: MonitoringChartProps) => {
    let data: any;

    switch (chart_schema.first_column) {
        case "prediction":
            data = predictionsData
                .map((row) => [new Date(row.prediction_date), row.prediction])
                .sort((a: any, b: any) => a[0] - b[0]);
            break;

        case "actual":
            data = predictionsData
                .filter(
                    (row: Prediction) =>
                        row.actual !== null && row.actual !== undefined
                )
                .map((row) => [new Date(row.prediction_date), row.actual])
                .sort((a: any, b: any) => a[0] - b[0]);
            break;
            
        default:
            data = predictionsData
                .map((row) => [
                    new Date(row.prediction_date),
                    row.input_data[chart_schema.first_column as string],
                ])
                .sort((a: any, b: any) => a[0] - b[0]);
            break;
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={timeseriesOptions(
                    data,
                    chart_schema.first_column as string,
                    onOpen,
                    theme
                )}
                theme="customed"
            />
        </div>
    );
};

export default Timeseries;
