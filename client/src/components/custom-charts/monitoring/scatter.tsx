import ReactEcharts from "echarts-for-react";

import { scatterOptions } from "./scatter/scatter-options";
import { MonitoringChartProps } from "@/types/monitoring-chart";
import { Prediction } from "@/types/prediction";

const Scatter = ({
    chart_schema,
    predictionsData,
    onOpen,
    onEdit,
    theme,
}: MonitoringChartProps) => {
    let seriesData: any[] = [];

    let xColumn: any[] = [];

    switch (chart_schema.x_axis_column) {
        case "prediction":
            xColumn = predictionsData.map((row: Prediction) => row.prediction);
            break;

        case "actual":
            xColumn = predictionsData.map((row: Prediction) => row.actual);
            break;
        default:
            xColumn = predictionsData.map(
                (row: Prediction) =>
                    row.input_data[chart_schema.x_axis_column as string]
            );
            break;
    }

    for (let i = 0; i < chart_schema.y_axis_columns!.length; i++) {
        let yColumnData: any[] = [];

        switch (chart_schema.y_axis_columns![i]) {
            case "prediction":
                yColumnData = predictionsData.map(
                    (row: Prediction) => row.prediction
                );
                break;

            case "actual":
                yColumnData = predictionsData.map(
                    (row: Prediction) => row.actual
                );
                break;
            default:
                yColumnData = predictionsData.map(
                    (row: Prediction) =>
                        row.input_data[chart_schema.y_axis_columns![i] as string]
                );
                break;
        }

        let data;

        data = xColumn.map((_, index: number) => [
            xColumn[index],
            yColumnData[index],
            predictionsData[index].prediction,
        ]);

        seriesData.push({
            name: `(${chart_schema.x_axis_column}, ${
                chart_schema.y_axis_columns![i]
            })`,
            type: "scatter",
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { tooltip: [0, 1] },
            data: data,
        });
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={scatterOptions(
                    chart_schema.x_axis_column as string,
                    chart_schema.y_axis_columns as string[],
                    onOpen,
                    onEdit,
                    theme,
                    seriesData
                )}
                notMerge={true}
                theme="customed"
                style={{ height: "400px" }}
            />
        </div>
    );
};

export default Scatter;
