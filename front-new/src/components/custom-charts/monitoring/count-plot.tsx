import ReactEcharts from "echarts-for-react";

import { Keyable } from "@/types/types";
import { countUniqueValues } from "@/lib/utils";
import { countPlotOptions } from "./count-plot/count-plot-options";

interface CountPlotProps {
    rowData: Keyable[];
    colName: string;
    theme: "dark" | "light" | "system";
}

const CountPlot = ({ rowData, colName, theme }: CountPlotProps) => {
    const data: number[] = rowData.map((row: any) => row[colName]);

    const [uniqueValues, counts] = countUniqueValues(data);

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={countPlotOptions(uniqueValues, counts, colName, theme)}
                theme="customed"
            />
        </div>
    );
};

export default CountPlot;
