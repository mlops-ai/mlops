import ReactEcharts from "echarts-for-react";

import { timeseriesOptions } from "./timeseries/timeseries-options";
import { Prediction } from "@/types/prediction";
import { MonitoringChart } from "@/types/monitoring_chart";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    theme: "dark" | "light" | "system";
}

const Timeseries = ({
    chart_schema,
    predictionsData,
    theme,
}: MonitoringChartProps) => {
    let data: any = [];

    if (chart_schema.first_column !== "prediction") {
        data = predictionsData
            .map((row) => [
                new Date(row.prediction_date),
                row.input_data[chart_schema.first_column as string],
            ])
            .sort((a: any, b: any) => a[0] - b[0]);
    } else {
        data = predictionsData
            .map((row) => [new Date(row.prediction_date), row.prediction])
            .sort((a: any, b: any) => a[0] - b[0]);
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={timeseriesOptions(
                    data,
                    chart_schema.first_column as string,
                    theme
                )}
                theme="customed"
            />
        </div>
    );
};

export default Timeseries;
