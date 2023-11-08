import { Chart } from "@/types/chart";
import { scatterPlotOptions } from "./scatter-plot/scatter-plot-options";

import ReactEcharts from "echarts-for-react";
import { xAxisType } from "@/lib/utils";

const ScatterPlot = ({
    chart_data,
    iteration_name,
    theme,
}: {
    chart_data: Chart;
    iteration_name: string;
    theme: "dark" | "light" | "system";
}) => {
    const x_axis_type: string = xAxisType(chart_data.x_data);

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

    let series_data: any[] = [];

    if (data.length >= 2) {
        data.forEach((xy_data, index) => {
            series_data.push({
                name:
                    chart_data.y_data_names &&
                    chart_data.y_data_names.length > 0
                        ? chart_data.y_data_names[index]
                        : `${iteration_name} (${index + 1})`,
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
                chart_data.y_data_names && chart_data.y_data_names.length > 0
                    ? chart_data.y_data_names[0]
                    : `${iteration_name}`,
            data: data[0],
            type: chart_data.chart_type,
            showSymbol: false,
            emphasis: {
                focus: "series",
            },
        });
    }

    return (
        <ReactEcharts
            option={scatterPlotOptions(
                theme,
                series_data,
                x_axis_type,
                chart_data.x_label,
                chart_data.y_label,
                chart_data.x_min,
                chart_data.x_max,
                chart_data.y_min,
                chart_data.y_max,
                chart_data.chart_title,
                chart_data.chart_subtitle
            )}
            theme="customed"
        />
    );
};

export default ScatterPlot;
