import ReactEcharts from "echarts-for-react";
import {
    freedmanDiaconisBins,
    generateHistogramData,
    scottBins,
    squareRootBins,
    sturgesBins,
} from "@/lib/utils";
import { scatterWithHistogramsOptions } from "./scatter-with-histograms/scatter-with-histograms-options";
import { Prediction } from "@/types/prediction";
import { BinMethods, MonitoringChart } from "@/types/monitoring_chart";
import { Keyable } from "@/types/types";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    theme: "dark" | "light" | "system";
}

const ScatterWithHistograms = ({
    chart_schema,
    predictionsData,
    onOpen,
    theme,
}: MonitoringChartProps) => {
    let firstColData: any[] = [];
    let secondColData: any[] = [];

    let filterArray: Keyable = {
        column: "",
        filter: [],
    };

    switch (chart_schema.first_column) {
        case "prediction":
            firstColData = predictionsData.map(
                (row: Prediction) => row.prediction
            );
            break;

        case "actual":
            firstColData = predictionsData.map((row: Prediction) => row.actual);
            filterArray.column = "first_column";
            filterArray.filter = firstColData.map(
                (value) => value !== null && value !== undefined
            );
            break;
        default:
            firstColData = predictionsData.map(
                (row: Prediction) =>
                    row.input_data[chart_schema.first_column as string]
            );
            break;
    }

    switch (chart_schema.second_column) {
        case "prediction":
            secondColData = predictionsData.map(
                (row: Prediction) => row.prediction
            );
            break;

        case "actual":
            secondColData = predictionsData.map(
                (row: Prediction) => row.actual
            );
            filterArray.column = "second_column";
            filterArray.filter = secondColData.map(
                (value) => value !== null && value !== undefined
            );
            break;
        default:
            secondColData = predictionsData.map(
                (row: Prediction) =>
                    row.input_data[chart_schema.second_column as string]
            );
            break;
    }

    const data = firstColData
        .map((_, index) => [
            firstColData[index],
            secondColData[index],
            predictionsData[index].prediction,
        ])
        .filter((_, index) => filterArray.filter[index]);

    firstColData = firstColData
        .filter((_, index) => filterArray.column === 'first_column' ? filterArray.filter[index]: true)
        .sort((a: number, b: number) => a - b);
    secondColData = secondColData
        .filter((_, index) => filterArray.column === 'second_column' ? filterArray.filter[index]: true)
        .sort((a: number, b: number) => a - b);

    let minValueFirstCol = firstColData[0];
    let maxValueFirstCol = firstColData[firstColData.length - 1];

    let minValueSecondCol = secondColData[0];
    let maxValueSecondCol = secondColData[secondColData.length - 1];

    let firstColHistogramData;
    let secondColHistogramData;

    switch (chart_schema.bin_method) {
        case "scott":
            firstColHistogramData = scottBins(firstColData);
            secondColHistogramData = scottBins(secondColData);
            break;

        case "freedmanDiaconis":
            firstColHistogramData = freedmanDiaconisBins(firstColData);
            secondColHistogramData = freedmanDiaconisBins(secondColData);
            break;

        case "sturges":
            firstColHistogramData = sturgesBins(firstColData);
            secondColHistogramData = sturgesBins(secondColData);
            break;

        case "squareRoot":
            firstColHistogramData = squareRootBins(firstColData);
            secondColHistogramData = squareRootBins(secondColData);
            break;
        case "fixedNumber":
            firstColHistogramData = generateHistogramData(
                firstColData,
                chart_schema.bin_number as number
            );
            secondColHistogramData = generateHistogramData(
                secondColData,
                chart_schema.bin_number as number
            );
            break;
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={scatterWithHistogramsOptions(
                    data,
                    firstColHistogramData,
                    secondColHistogramData,
                    chart_schema.first_column as string,
                    chart_schema.second_column as string,
                    chart_schema.bin_method as BinMethods,
                    minValueFirstCol,
                    maxValueFirstCol,
                    minValueSecondCol,
                    maxValueSecondCol,
                    onOpen,
                    theme
                )}
                style={{ height: "500px" }}
                theme="customed"
            />
        </div>
    );
};

export default ScatterWithHistograms;
