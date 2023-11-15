import ReactEcharts from "echarts-for-react";

import { histogramOptions } from "./histogram/histogram-options";

import {
    freedmanDiaconisBins,
    generateHistogramData,
    scottBins,
    squareRootBins,
    sturgesBins,
} from "@/lib/utils";
import { BinMethods, MonitoringChart } from "@/types/monitoring_chart";
import { Prediction } from "@/types/prediction";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    theme: "dark" | "light" | "system";
}

const Histogram = ({
    chart_schema,
    predictionsData,
    onOpen,
    theme,
}: MonitoringChartProps) => {

    let data: number[] = [];

    switch (chart_schema.first_column) {
        case "prediction":
            data = predictionsData
                .map((row: Prediction) => row.prediction)
                .sort((a: number, b: number) => a - b);
            break;

        case "actual":
            data = predictionsData
                .filter((row: Prediction) => row.actual !== null && row.actual !== undefined)
                .map((row: Prediction) => row.actual as number)
                .sort((a: number, b: number) => a - b);
            break;
        default:
            data = predictionsData
                .map((row: Prediction) => row.input_data[chart_schema.first_column as string])
                .sort((a: number, b: number) => a - b);
            break;
    }

    let minValue = data[0];
    let maxValue = data[data.length - 1];
    
    let histogramData;

    switch (chart_schema.bin_method) {
        case "squareRoot":
            histogramData = squareRootBins(data);
            break;

        case "scott":
            histogramData = scottBins(data);
            break;

        case "freedmanDiaconis":
            histogramData = freedmanDiaconisBins(data);
            break;

        case "sturges":
            histogramData = sturgesBins(data);
            break;

        case "fixedNumber":
            histogramData = generateHistogramData(
                data,
                chart_schema.bin_number as number
            );
            break;
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={histogramOptions(
                    histogramData,
                    chart_schema.first_column as string,
                    minValue,
                    maxValue,
                    chart_schema.bin_method as BinMethods,
                    onOpen,
                    theme
                )}
                style={{ height: "400px" }}
                theme="customed"
            />
        </div>
    );
};

export default Histogram;
