import { Prediction } from "@/types/prediction";
import MonitoringChart from "./monitoring-chart";
import { calculateRegressionMetrics } from "@/lib/utils";

import ReactEcharts from "echarts-for-react";
import { metricsChartOptionsGenerator } from "@/pages/iterations/single-iteration/metrics-chart-options";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    theme: "dark" | "light" | "system";
}

const metrics_names = ["R2", "MSE", "RMSE", "MAE"];

const RegressionMetrics = ({
    predictionsData,
    theme,
}: MonitoringChartProps) => {
    const metrics_values = calculateRegressionMetrics(predictionsData);

    let series = metrics_names.map((name, index) => {
        let data = Array(metrics_names.length).fill(0);
        data[index] = metrics_values[index];
        return {
            name: name,
            data: data,
            type: "bar",
            stack: "stack",
        };
    });

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={metricsChartOptionsGenerator(theme, metrics_names, series, "Regression Metrics")}
                theme="customed"
                style={{ height: "400px" }}
            />
        </div>
    );
};

export default RegressionMetrics;
