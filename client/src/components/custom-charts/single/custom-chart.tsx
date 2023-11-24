import { Chart, ChartType } from "@/types/chart";
import BarPlot from "./bar-plot";
import PiePlot from "./pie-plot";
import BoxPlot from "./box-plot";
import LinePlot from "./line-plot";
import ScatterPlot from "./scatter-plot";

interface CustomChartProps {
    type: ChartType;
    theme: "dark" | "light" | "system";
    iteration_name: string;
    chart_data: Chart;
}

const ChartMap = {
    line: LinePlot,
    bar: BarPlot,
    pie: PiePlot,
    scatter: ScatterPlot,
    boxplot: BoxPlot,
};

/**
 * Custom chart component wrapper.
 */
const CustomChart = ({
    type,
    theme,
    iteration_name,
    chart_data,
}: CustomChartProps) => {
    const ChartComponent = ChartMap[type];
    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ChartComponent
                chart_data={chart_data}
                iteration_name={iteration_name}
                theme={theme}
            />
        </div>
    );
};

export default CustomChart;
