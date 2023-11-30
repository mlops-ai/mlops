import { maxValue, minValue, scatterPlotTooltipFormatter } from "@/lib/utils";
import { Keyable } from "@/types/types";

/**
 * Function for generating the options (configuration) object for a scatter plot.
 * @param theme Page theme.
 * @param series Chart series data.
 * @param x_axis_type Chart x-axis type.
 * @param x_label Chart x-axis label.
 * @param y_label Chart y-axis label.
 * @param min_x Chart x-axis minimum value.
 * @param max_x Chart x-axis maximum value.
 * @param min_y Chart y-axis minimum value.
 * @param max_y Chart y-axis maximum value.
 * @param title Chart title.
 * @param subtitle Chart subtitle.
 * @returns Object containing the options for a scatter plot.
 */
export const scatterPlotOptions = (
    theme: "dark" | "light" | "system",
    series: Keyable[],
    x_axis_type: string,
    x_label?: string,
    y_label?: string,
    min_x?: number,
    max_x?: number,
    min_y?: number,
    max_y?: number,
    title?: string,
    subtitle?: string
) => {
    return {
        backgroundColor: theme === "dark" ? "#1F2937" : "#ffffff",
        toolbox: {
            orient: "vertical",
            iconStyle: {
                borderColor: theme === "dark" ? "#ffffff" : "#666",
            },
            show: true,
            feature: {
                dataZoom: {
                    show: true,
                    yAxisIndex: "none",
                },
                brush: {
                    type: "polygon",
                },
                restore: {
                    show: true,
                },
                saveAsImage: {},
            },
        },
        title: {
            left: "center",
            text: title ? title : "",
            subtext: subtitle ? subtitle : "",
            textStyle: {
                fontSize: 18,
                color: theme === "dark" ? "#ffffff" : "#333",
            },
            subtextStyle: {
                fontSize: 16,
                color: theme === "dark" ? "#ffffffcc" : "#aaa",
            },
        },
        tooltip: {
            trigger: "item",
            formatter: scatterPlotTooltipFormatter,
        },
        xAxis: {
            type: x_axis_type,
            name: x_label ? x_label : "",
            nameLocation: "center",
            nameGap: 20,
            min: min_x ? min_x : minValue,
            max: max_x ? max_x : maxValue,
            axisLabel: {
                color: theme === "dark" ? "#ffffff" : "#666",
            },
            axisLine: {
                lineStyle: {
                    color: theme === "dark" ? "#ffffff" : "#333",
                },
            },
            splitLine: {
                lineStyle: {
                    color: theme === "dark" ? "#374151" : "#ccc",
                },
            },
        },
        yAxis: {
            type: "value",
            name: y_label ? y_label : "",
            nameLocation: "center",
            nameGap: 30,
            min: min_y ? min_y : minValue,
            max: max_y ? max_y : maxValue,
            axisLabel: {
                color: theme === "dark" ? "#ffffff" : "#666",
            },
            axisLine: {
                lineStyle: {
                    color: theme === "dark" ? "#ffffff" : "#333",
                },
                onZero: false,
            },
            splitLine: {
                lineStyle: {
                    color: theme === "dark" ? "#374151" : "#ccc",
                },
            },
        },
        legend: {
            type: "scroll",
            top: "bottom",
            textStyle: {
                color: theme === "dark" ? "#ffffff" : "#333",
            },
            pageTextStyle: {
                color: theme === "dark" ? "#ffffff" : "#333",
            },
        },
        grid: {
            show: true,
            bottom: "30%",
        },
        dataZoom: [
            {
                bottom: 40,
                type: "inside",
                start: 0,
                end: 100,
            },
            { bottom: 40, start: 0, end: 100 },
        ],
        series: series,
    };
};
