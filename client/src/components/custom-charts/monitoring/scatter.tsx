import ReactEcharts from "echarts-for-react";

import { scatterOptions } from "./scatter/scatter-options";
import { MonitoringChart } from "@/types/monitoring_chart";
import { Prediction } from "@/types/prediction";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    theme: "dark" | "light" | "system";
}

const Scatter = ({
    chart_schema,
    predictionsData,
    onOpen,
    theme,
}: MonitoringChartProps) => {
    let data: any[] = [];

    let firstColumn: any[] = [];
    let secondColumn: any[] = [];

    switch (chart_schema.first_column) {
        case "prediction":
            firstColumn = predictionsData
                .map((row: Prediction) => row.prediction)
            break;

        case "actual":
            firstColumn = predictionsData
                .map((row: Prediction) => row.actual)
            break;
        default:
            firstColumn = predictionsData
                .map((row: Prediction) => row.input_data[chart_schema.first_column as string])
            break;
    }

    switch (chart_schema.second_column) {
        case "prediction":
            secondColumn = predictionsData
                .map((row: Prediction) => row.prediction)
            break;

        case "actual":
            secondColumn = predictionsData
                .map((row: Prediction) => row.actual)
            break;
        default:
            secondColumn = predictionsData
                .map((row: Prediction) => row.input_data[chart_schema.second_column as string])
            break;
    }

    data = firstColumn.map((_, index: number) => [
        firstColumn[index],
        secondColumn[index],
        predictionsData[index].prediction,
    ])

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={scatterOptions(
                    data,
                    chart_schema.first_column as string,
                    chart_schema.second_column as string,
                    onOpen,
                    theme
                )}
                theme="customed"
                style={{ height: "400px" }}
            />
        </div>
    );
};

export default Scatter;
