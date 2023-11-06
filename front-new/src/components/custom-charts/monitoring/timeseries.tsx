import ReactEcharts from "echarts-for-react";

import { Keyable } from "@/types/types";

import { timeseriesOptions } from "./timeseries/timeseries-options";

interface TimeseriesProps {
    rowData: Keyable[];
    colName: string;
    theme: "dark" | "light" | "system";
}

const Timeseries = ({ rowData, colName, theme }: TimeseriesProps) => {
    const data = rowData
        .map((row) => [new Date(row.prediction_date), row[colName]])
        .sort((a, b) => a[0] - b[0]);

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={timeseriesOptions(data, colName, theme)}
                theme="customed"
            />
        </div>
    );
};

export default Timeseries;
