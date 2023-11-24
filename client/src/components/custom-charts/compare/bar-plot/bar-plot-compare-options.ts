import { Keyable } from "@/types/types";

/**
 * Function for generating the options (configuration) object for a comparasion bar plot.
 * @param theme Page theme.
 * @param x_data Chart x-axis data.
 * @param series Chart series data.
 * @param x_label Chart x-axis label.
 * @param y_label Chart y-axis label.
 * @param title Chart title.
 * @param subtitle Chart subtitle.
 * @returns Object containing the options for a comparasion bar plot.
 */
export const barPlotCompareOptions = (
    theme: "dark" | "light" | "system",
    x_data: any[][],
    series: Keyable[],
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
            trigger: "item",
        },
        xAxis: {
            type: "category",
            data: x_data[0],
            name: x_label,
            nameLocation: "center",
            nameGap: 30,
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
        },
        series: series,
    };
};
