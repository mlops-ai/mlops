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
import { MonitoringChart } from "@/types/monitoring_chart";

interface MonitoringChartProps {
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    theme: "dark" | "light" | "system";
}

const ScatterWithHistograms = ({
    chart_schema,
    predictionsData,
    theme,
}: MonitoringChartProps) => {
    let firstColData: number[] = [];
    let secondColData: number[] = [];

    if (chart_schema.first_column !== "predicted_value") {
        firstColData = predictionsData
            .map((row: Prediction) => row.input_data[chart_schema.first_column])
            .sort((a: number, b: number) => a - b);
    } else {
        firstColData = predictionsData
            .map((row: Prediction) => row.prediction)
            .sort((a: number, b: number) => a - b);
    }

    if (chart_schema.second_column !== "predicted_value") {
        secondColData = predictionsData
            .map((row: Prediction) => row.input_data[chart_schema.second_column as string])
            .sort((a: number, b: number) => a - b);
    } else {
        secondColData = predictionsData
            .map((row: Prediction) => row.prediction)
            .sort((a: number, b: number) => a - b);
    }

    const data = firstColData.map((value, index) => [
        value,
        secondColData[index],
        predictionsData[index].prediction,
    ]);

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

    console.log(data);

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={scatterWithHistogramsOptions(
                    data,
                    firstColHistogramData,
                    secondColHistogramData,
                    chart_schema.first_column,
                    chart_schema.second_column as string,
                    theme
                )}
                style={{ height: "500px" }}
                theme="customed"
            />
        </div>
    );
};

export default ScatterWithHistograms;
