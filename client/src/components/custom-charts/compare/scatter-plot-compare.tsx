import ReactEcharts from "echarts-for-react";
import { getMostFrequentValues, xAxisTypeCompare } from "@/lib/utils";
import { Chart } from "@/types/chart";
import { scatterPlotCompareOptions } from "./scatter-plot/scatter-plot-compare-options";

/**
 * Scatter plot compare component.
 */
const ScatterPlotCompare = ({
    charts,
    theme,
}: {
    charts: Chart[];
    theme: "dark" | "light" | "system";
}) => {
    /**
     * Specify x axis type.
     */
    const x_axis_type = xAxisTypeCompare(charts);

    let series_data: any[] = [];

    /**
     * Prepare series data.
     */
    charts.forEach((chart_data) => {
        let data: any[] = [];

        if (chart_data.x_data.length === 1) {
            chart_data.y_data.forEach((y_data) => {
                let data_for_series: any[] = [];
                chart_data.x_data[0].forEach((x_value, idx) => {
                    data_for_series.push([x_value, y_data[idx]]);
                });
                data.push(data_for_series);
            });
        } else {
            chart_data.y_data.forEach((y_data, index) => {
                let data_for_series: any[] = [];
                chart_data.x_data[index].forEach((x_value, idx) => {
                    data_for_series.push([x_value, y_data[idx]]);
                });
                data.push(data_for_series);
            });
        }

        if (data.length >= 2) {
            data.forEach((xy_data, index) => {
                series_data.push({
                    name:
                        chart_data.y_data_names &&
                        chart_data.y_data_names.length > 0
                            ? `${chart_data.y_data_names[index]} - ${chart_data.iteration_name}`
                            : `${chart_data.iteration_name} (${index + 1})`,
                    data: xy_data,
                    type: chart_data.chart_type,
                    showSymbol: false,
                    emphasis: {
                        focus: "series",
                    },
                });
            });
        } else {
            series_data.push({
                name:
                    chart_data.y_data_names &&
                    chart_data.y_data_names.length > 0
                        ? `${chart_data.y_data_names[0]} - ${chart_data.iteration_name}`
                        : `${chart_data.iteration_name}`,
                data: data[0],
                type: chart_data.chart_type,
                showSymbol: false,
                emphasis: {
                    focus: "series",
                },
            });
        }
    });

    /**
     * Get most frequent values of title, subtitle, x_label, y_label for all charts in group.
     */
    const [title, subtitle, x_label, y_label] = getMostFrequentValues(charts);

    return (
        <ReactEcharts
            style={{ height: "400px" }}
            option={scatterPlotCompareOptions(
                theme,
                series_data,
                x_axis_type,
                x_label,
                y_label,
                title,
                subtitle
            )}
            notMerge={true}
            theme="customed"
        />
    );
};

export default ScatterPlotCompare;
