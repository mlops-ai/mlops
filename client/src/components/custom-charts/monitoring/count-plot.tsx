import ReactEcharts from "echarts-for-react";

import { countUniqueValues } from "@/lib/utils";
import { countPlotOptions } from "./count-plot/count-plot-options";
import { Prediction } from "@/types/prediction";
import { MonitoringChart } from "@/types/monitoring_chart";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    theme: "dark" | "light" | "system";
}

const CountPlot = ({
    chart_schema,
    predictionsData,
    onOpen,
    theme,
}: MonitoringChartProps) => {
    let data: number[] = [];
    
    if (chart_schema.first_column !== "prediction") {
        data = predictionsData.map(
            (row: Prediction) => row.input_data[chart_schema.first_column as string]
        );
    } else {
        data = predictionsData.map((row: Prediction) => row.prediction);
    }

    switch (chart_schema.first_column) {
        case "prediction":
            data = predictionsData.map((row: Prediction) => row.prediction);
            break;

        case "actual":
            data = predictionsData.map((row: Prediction) => row.actual as number);
            break;
        default:
            data = predictionsData.map(
                (row: Prediction) => row.input_data[chart_schema.first_column as string]
            );
            break;
    }

    const [uniqueValues, counts] = countUniqueValues(data);

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={countPlotOptions(
                    uniqueValues,
                    counts,
                    chart_schema.first_column as string,
                    onOpen,
                    theme
                )}
                style={{ height: "400px" }}
                theme="customed"
            />
        </div>
    );
};

export default CountPlot;
