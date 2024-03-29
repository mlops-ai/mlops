import { Chart } from "@/types/chart";
import ReactEcharts from "echarts-for-react";
import { boxPlotOptions } from "./box-plot/box-plot-options";

/**
 * Box plot component. 
 */
const BoxPlot = ({
    chart_data,
    theme,
}: {
    chart_data: Chart;
    theme: "dark" | "light" | "system";
}) => {
    return (
        <ReactEcharts
            option={boxPlotOptions(
                theme,
                chart_data.x_data,
                chart_data.y_data,
                chart_data.x_label,
                chart_data.y_label,
                chart_data.chart_title,
                chart_data.chart_subtitle
            )}
            notMerge={true}
            theme="customed"
        />
    );
};

export default BoxPlot;
