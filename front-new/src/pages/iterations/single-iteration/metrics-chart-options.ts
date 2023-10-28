import { Keyable } from "@/types/types";

export const metricsChartOptionsGenerator = (
    theme: "dark" | "light" | "system",
    metrics_names: string[],
    series: Keyable[]
) => {
    return {
        backgroundColor: theme === "dark" ? "#1F2937" : "#ffffff",
        toolbox: {
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
            text: "Metric Chart",
            textStyle: {
                color: theme === "dark" ? "#ffffff" : "#333",
            },
        },
        tooltip: {},
        xAxis: {
            type: "category",
            data: metrics_names,
            axisLabel: {
                color: theme === "dark" ? "#ffffff" : "#666",
            },
            axisLine: {
                lineStyle: {
                    color: theme === "dark" ? "#ffffff" : "#333",
                },
            },
        },
        yAxis: {
            type: "value",
        },
        legend: {
            data: metrics_names,
            top: "bottom",
            textStyle: {
                color: theme === "dark" ? "#ffffff" : "#333",
            },
        },
        series: series,
    };
};
