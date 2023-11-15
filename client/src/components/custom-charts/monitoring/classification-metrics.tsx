import { Prediction } from "@/types/prediction";
import MonitoringChart from "./monitoring-chart";
import { calculateClassificationMetrics } from "@/lib/utils";

import ReactEcharts from "echarts-for-react";
import { metricsChartOptionsGenerator } from "./metrics-plot/metrics-plot-options";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    theme: "dark" | "light" | "system";
}

const metrics_names = ["Accuracy", "Precision", "Recall", "F-Score"];

const ClassificationMetrics = ({
    predictionsData,
    onOpen,
    theme,
}: MonitoringChartProps) => {
    const metrics_values = calculateClassificationMetrics(predictionsData);

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
                option={metricsChartOptionsGenerator(
                    theme,
                    metrics_names,
                    series,
                    onOpen,
                    "Classification metrics"
                )}
                theme="customed"
                style={{ height: "400px" }}
            />
        </div>
    );
};

export default ClassificationMetrics;
