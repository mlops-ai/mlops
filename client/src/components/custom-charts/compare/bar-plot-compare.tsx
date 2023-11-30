import { Chart } from "@/types/chart";
import ReactEcharts from "echarts-for-react";
import { barPlotCompareOptions } from "./bar-plot/bar-plot-compare-options";
import { getMostFrequentValues } from "@/lib/utils";

/**
 * Bar plot compare component.
 */
const BarPlotCompare = ({
    charts,
    theme,
}: {
    charts: Chart[];
    theme: "dark" | "light" | "system";
}) => {
    let series_data: any[] = [];

    /**
     * Prepare series data.
     */
    charts.forEach((chart_data) => {
        if (chart_data.y_data.length >= 2) {
            chart_data.y_data.forEach((y_data, index) => {
                series_data.push({
                    name:
                        chart_data.y_data_names &&
                        chart_data.y_data_names.length > 0
                            ? `${chart_data.y_data_names[index]} - ${chart_data.iteration_name}`
                            : `${chart_data.iteration_name} (${index + 1})`,
                    data: y_data,
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
                data: chart_data.y_data[0],
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
            option={barPlotCompareOptions(
                theme,
                charts[0].x_data,
                series_data,
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

export default BarPlotCompare;
