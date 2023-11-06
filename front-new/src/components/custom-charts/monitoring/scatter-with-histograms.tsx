import * as echarts from "echarts";
// @ts-ignore
import { transform, histogram, HistogramBins } from "echarts-stat";

import ReactEcharts from "echarts-for-react";
import { Keyable } from "@/types/types";
import { freedmanDiaconisBins, generateHistogramData, scottBins, squareRootBins, sturgesBins } from "@/lib/utils";
import { scatterWithHistogramsOptions } from "./scatter-with-histograms/scatter-with-histograms-options";

echarts.registerTransform(transform.histogram);

interface ScatterWithHistogramsProps {
    rowData: Keyable[];
    firstCol: string;
    secondCol: string;
    numberOfBins?: number;
    binMethod?: "squareRoot" | "scott" | "freedmanDiaconis" | "sturges";
    theme: "dark" | "light" | "system";
}

const ScatterWithHistograms = ({
    rowData,
    firstCol,
    secondCol,
    numberOfBins,
    binMethod,
    theme,
}: ScatterWithHistogramsProps) => {
    const firstColData: number[] = rowData
        .map((row: any) => row[firstCol])
        .sort((a: number, b: number) => a - b);

    const secondColData: number[] = rowData
        .map((row: any) => row[secondCol])
        .sort((a: number, b: number) => a - b);

    const data = firstColData.map((value, index) => [value, secondColData[index], rowData[index].predicted_value]);

    let firstColHistogramData;
    let secondColHistogramData;

    if (numberOfBins) {
        firstColHistogramData = generateHistogramData(firstColData, numberOfBins);
        secondColHistogramData = generateHistogramData(secondColData, numberOfBins);
    } else {
        switch (binMethod) {
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

            default:
                firstColHistogramData = squareRootBins(firstColData);
                secondColHistogramData = squareRootBins(secondColData);
                break;
        }
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={scatterWithHistogramsOptions(
                    data,
                    firstColHistogramData,
                    secondColHistogramData,
                    firstCol,
                    secondCol,
                    theme
                )}
                style={{ height: "500px" }}
                theme="customed"
            />
        </div>
    );
};

export default ScatterWithHistograms;
