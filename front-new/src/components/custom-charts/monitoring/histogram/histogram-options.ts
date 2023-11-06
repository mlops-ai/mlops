import { histogramTooltipFormatter } from "@/lib/utils";

export const histogramOptions = (
    bins: any,
    col: string,
    theme: "dark" | "light" | "system"
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
            text: `Histogram of ${col}`,
            subtext: `Number of bins: ${bins.length}`,
            textStyle: {
                fontSize: 18,
                color: theme === "dark" ? "#ffffff" : "#333",
            },
            subtextStyle: {
                fontSize: 16,
                color: theme === "dark" ? "#ffffffcc" : "#333",
            },
        },
        tooltip: {
            trigger: "item",
            formatter: histogramTooltipFormatter,
        },
        xAxis: {
            scale: true,
            name: "bins",
            nameLocation: "center",
            nameGap: 25,
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
            scale: true,
            name: "count",
            nameTextStyle: {
                color: theme === "dark" ? "#ffffff" : "#666",
            },
            axisLabel: {
                color: theme === "dark" ? "#ffffff" : "#666",
            },
            axisLine: {
                show: false,
                onZero: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    color: theme === "dark" ? "#374151" : "#ccc",
                },
            },
            min: 0,
        },
        series: [
            {
                name: col,
                type: "bar",
                barWidth: "99.3%",
                label: {
                    show: true,
                    position: "top",
                },
                encode: {
                    x: 2,
                    y: 3,
                },
                data: bins,
            },
        ],
        grid: {
            left: "5%",
            right: "5%",
            bottom: "6%",
            containLabel: true,
        },
    };
};
