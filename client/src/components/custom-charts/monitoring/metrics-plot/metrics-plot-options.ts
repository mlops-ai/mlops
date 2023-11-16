import { Keyable } from "@/types/types";

export const metricsChartOptionsGenerator = (
    theme: "dark" | "light" | "system",
    metrics_names: string[],
    series: Keyable[],
    onOpen: () => void,
    title: string
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
                myFeature: {
                    show: true,
                    title: 'Delete chart',
                    icon: 'path://M304.615-160q-26.846 0-45.731-18.884Q240-197.769 240-224.615V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.385Q720-197 701.5-178.5 683-160 655.385-160h-350.77ZM680-720H280v495.385q0 10.769 6.923 17.692T304.615-200h350.77q9.23 0 16.923-7.692Q680-215.385 680-224.615V-720ZM392.307-280h40.001v-360h-40.001v360Zm135.385 0h40.001v-360h-40.001v360ZM280-720v520-520Z',
                    iconStyle: {
                        borderWidth: 0.25,
                        color: '#ffffff',
                    },
                    onclick: () => onOpen(),
                },
            },
        },
        title: {
            left: "center",
            text: title,
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
        series: series,
    };
};
