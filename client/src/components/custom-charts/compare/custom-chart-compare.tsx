import { Chart, ChartType } from "@/types/chart";
import LinePlotCompare from "./line-plot-compare";
import BarPlotCompare from "./bar-plot-compare";
import ScatterPlotCompare from "./scatter-plot-compare";

interface CustomChartProps {
    type: Exclude<ChartType, ChartType.PIE | ChartType.BOXPLOT>;
    theme: "dark" | "light" | "system";
    charts: Chart[];
}

const ChartMap = {
    line: LinePlotCompare,
    bar: BarPlotCompare,
    scatter: ScatterPlotCompare,
};

const CustomChartCompare = ({ type, theme, charts }: CustomChartProps) => {
    const ChartComponent = ChartMap[type];
    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ChartComponent charts={charts} theme={theme} />
        </div>
    );
};

export default CustomChartCompare;
