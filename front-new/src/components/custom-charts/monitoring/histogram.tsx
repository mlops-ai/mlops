import ReactEcharts from "echarts-for-react";

import { Keyable } from "@/types/types";

import { histogramOptions } from "./histogram/histogram-options";

import {
    freedmanDiaconisBins,
    generateHistogramData,
    scottBins,
    squareRootBins,
    sturgesBins,
} from "@/lib/utils";

interface HistogramProps {
    rowData: Keyable[];
    colName: string;
    numberOfBins?: number;
    binMethod?: "squareRoot" | "scott" | "freedmanDiaconis" | "sturges";
    theme: "dark" | "light" | "system";
}

const Histogram = ({
    rowData,
    colName,
    numberOfBins,
    binMethod,
    theme,
}: HistogramProps) => {
    const data: number[] = rowData
        .map((row: any) => row[colName])
        .sort((a: number, b: number) => a - b);

    let histogramData;

    if (numberOfBins) {
        histogramData = generateHistogramData(data, numberOfBins);
    } else {
        switch (binMethod) {
            case "scott":
                histogramData = scottBins(data);
                break;

            case "freedmanDiaconis":
                histogramData = freedmanDiaconisBins(data);
                break;

            case "sturges":
                histogramData = sturgesBins(data);
                break;

            default:
                histogramData = squareRootBins(data);
                break;
        }
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={histogramOptions(histogramData, colName, theme)}
                theme="customed"
            />
        </div>
    );
};

export default Histogram;
