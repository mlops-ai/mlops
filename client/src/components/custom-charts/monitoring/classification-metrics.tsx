import { calculateClassificationMetrics } from "@/lib/utils";

import ReactEcharts from "echarts-for-react";
import { metricsChartOptionsGenerator } from "./metrics-plot/metrics-plot-options";
import { MonitoringChartProps } from "@/types/monitoring-chart";
import { classificationMetricsMap } from "@/config/maping";

const ClassificationMetrics = ({
    predictionsData,
    chart_schema,
    onOpen,
    onEdit,
    theme,
}: MonitoringChartProps) => {
    const metrics_values = calculateClassificationMetrics(predictionsData);

    let series = chart_schema.metrics!.map((name, index) => {
        let data = Array(chart_schema.metrics!.length).fill(0);
        data[index] = metrics_values[name as keyof typeof metrics_values];
        return {
            name: classificationMetricsMap[
                name as keyof typeof classificationMetricsMap
            ],
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
                    chart_schema.metrics!,
                    series,
                    onOpen,
                    onEdit,
                    "Classification metrics"
                )}
                theme="customed"
                style={{ height: "400px" }}
            />
        </div>
    );
};

export default ClassificationMetrics;
