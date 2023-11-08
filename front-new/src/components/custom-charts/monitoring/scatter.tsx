import ReactEcharts from "echarts-for-react";

import { scatterOptions } from "./scatter/scatter-options";
import { MonitoringChart } from "@/types/monitoring_chart";
import { Prediction } from "@/types/prediction";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    theme: "dark" | "light" | "system";
}

const Scatter = ({
    chart_schema,
    predictionsData,
    theme,
}: MonitoringChartProps) => {
    let data: any[] = [];

    if (
        chart_schema.first_column !== "prediction" &&
        chart_schema.second_column !== "prediction"
    ) {
        data = predictionsData.map((row: Prediction) => [
            row.input_data[chart_schema.first_column],
            row.input_data[chart_schema.second_column as string],
            row.prediction,
        ]);
    } else if (chart_schema.first_column === "prediction") {
        data = predictionsData.map((row: Prediction) => [
            row.prediction,
            row.input_data[chart_schema.second_column as string],
            row.prediction,
        ]);
    } else if (chart_schema.second_column === "prediction") {
        data = predictionsData.map((row: Prediction) => [
            row.input_data[chart_schema.first_column],
            row.prediction,
            row.prediction,
        ]);
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={scatterOptions(
                    data,
                    chart_schema.first_column,
                    chart_schema.second_column as string,
                    theme
                )}
                theme="customed"
                style={{ height: "400px" }}
            />
        </div>
    );
};

export default Scatter;
