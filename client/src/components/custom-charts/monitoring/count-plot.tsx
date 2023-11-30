import ReactEcharts from "echarts-for-react";

import { countUniqueValues } from "@/lib/utils";
import { countPlotOptions } from "./count-plot/count-plot-options";
import { Prediction } from "@/types/prediction";
import { MonitoringChartProps } from "@/types/monitoring-chart";

/**
 * Count plot chart component.
 */
const CountPlot = ({
    chart_schema,
    predictionsData,
    onOpen,
    onEdit,
    theme,
}: MonitoringChartProps) => {
    let data: number[] = [];

    /**
     * Prepare data for count plot.
     */
    switch (chart_schema.x_axis_column) {
        case "prediction":
            data = predictionsData.map((row: Prediction) => row.prediction);
            break;

        case "actual":
            data = predictionsData.map(
                (row: Prediction) => row.actual as number
            );
            break;
        default:
            data = predictionsData.map(
                (row: Prediction) =>
                    row.input_data[chart_schema.x_axis_column as string]
            );
            break;
    }

    /**
     * Calculate unique values and counts.
     */
    const [uniqueValues, counts] = countUniqueValues(data);

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={countPlotOptions(
                    uniqueValues,
                    counts,
                    chart_schema.x_axis_column as string,
                    onOpen,
                    onEdit,
                    theme
                )}
                notMerge={true}
                style={{ height: "400px" }}
                theme="customed"
            />
        </div>
    );
};

export default CountPlot;
