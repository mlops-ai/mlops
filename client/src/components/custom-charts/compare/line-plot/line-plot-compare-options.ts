import { maxValue, minValue } from "@/lib/utils";
import { Keyable } from "@/types/types";

/**
 * Function for generating the options (configuration) object for a comparasion line plot.
 * @param theme Page theme.
 * @param series Chart series data.
 * @param x_axis_type Chart x-axis type.
 * @param x_label Chart x-axis label.
 * @param y_label Chart y-axis label.
 * @param title Chart title.
 * @param subtitle Chart subtitle.
 * @returns Object containing the options for a comparasion line plot.
 */
export const linePlotCompareOptions = (
    theme: "dark" | "light" | "system",
    series: Keyable[],
    x_axis_type: string,
    x_label: string,
    y_label: string,
    title: string,
    subtitle: string
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
            text: title,
            subtext: subtitle,
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
            trigger: "axis",
        },
        xAxis: {
            type: x_axis_type,
            name: x_label,
            nameLocation: "center",
            nameGap: 20,
            min: minValue,
            max: maxValue,
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
            name: y_label,
            nameLocation: "center",
            nameGap: 30,
            min: minValue,
            max: maxValue,
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
