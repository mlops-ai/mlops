export const boxPlotOptions = (
    theme: "dark" | "light" | "system",
    x_data: any[][],
    y_data: any[][],
    x_label?: string,
    y_label?: string,
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
        },
        xAxis: {
            type: "value",
            name: x_label ? x_label : "",
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
            type: "category",
            name: y_label ? y_label : "",
            data: x_data[0],
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
        series: {
            type: "boxplot",
            data: y_data,
            itemStyle: {
                color: "#b8c5f2",
            },
            encode: {
                tooltip: [1, 2, 3, 4, 5],
                x: [1, 2, 3, 4, 5],
                y: 0,
            },
            emphasis: {
                focus: "series",
            },
        },
    };
};
