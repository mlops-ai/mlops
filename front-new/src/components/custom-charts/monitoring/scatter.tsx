import ReactEcharts from "echarts-for-react";

import { Keyable } from "@/types/types";
import { scatterOptions } from "./scatter/scatter-options";

interface ScatterProps {
    rowData: Keyable[];
    firstCol: string;
    secondCol: string;
    theme: "dark" | "light" | "system";
}

const Scatter = ({ rowData, firstCol, secondCol, theme }: ScatterProps) => {
    const data = rowData.map((row: any) => [
        row[firstCol],
        row[secondCol],
        row["predicted_value"],
    ]);

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={scatterOptions(data, firstCol, secondCol, theme)}
                theme="customed"
                style={{ height: "400px" }}
            />
        </div>
    );
};

export default Scatter;
