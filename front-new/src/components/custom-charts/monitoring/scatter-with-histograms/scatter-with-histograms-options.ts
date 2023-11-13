import {
    histogramTooltipFormatter,
    scatterPlotTooltipFormatter2,
} from "@/lib/utils";

export const scatterWithHistogramsOptions = (
    data: any,
    firstColBins: any,
    secondColBins: any,
    firstCol: string,
    secondCol: string,
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
            text: `Comparison of ${firstCol} and ${secondCol} with histograms`,
            subtext: `Number of bins: ${firstColBins.length}`,
            textStyle: {
                fontSize: 18,
                color: theme === "dark" ? "#ffffff" : "#333",
            },
            subtextStyle: {
                fontSize: 16,
                color: theme === "dark" ? "#ffffffcc" : "#aaa",
            },
        },
        xAxis: [
            {
                scale: true,
                gridIndex: 0,
                name: firstCol,
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
            {
                type: "category",
                scale: true,
                axisTick: { show: false },
                axisLabel: { show: false },
                axisLine: { show: false },
                gridIndex: 1,
                splitLine: {
                    lineStyle: {
                        color: theme === "dark" ? "#374151" : "#ccc",
                    },
                },
            },
            {
                type: "value",
                scale: true,
                gridIndex: 2,
                min: 0,
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
        ],
        yAxis: [
            {
                gridIndex: 0,
                name: secondCol,
                nameLocation: "center",
                nameGap: 30,
                axisLabel: {
                    color: theme === "dark" ? "#ffffff" : "#666",
                },
                splitLine: {
                    lineStyle: {
                        color: theme === "dark" ? "#374151" : "#ccc",
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: theme === "dark" ? "#ffffff" : "#333",
                    },
                    onZero: false,
                },
            },
            {
                gridIndex: 1,
                min: 0,
                axisLabel: {
                    color: theme === "dark" ? "#ffffff" : "#666",
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    lineStyle: {
                        color: theme === "dark" ? "#374151" : "#ccc",
                    },
                },
            },
            {
                type: "category",
                axisTick: { show: false },
                axisLabel: { show: false },
                axisLine: { show: false },
                gridIndex: 2,
                splitLine: {
                    lineStyle: {
                        color: theme === "dark" ? "#374151" : "#ccc",
                    },
                },
            },
        ],
        tooltip: {},
        dataZoom: [
            {
                bottom: 10,
                type: "inside",
                start: 0,
                end: 100,
            },
            { bottom: 10, start: 0, end: 100 },
        ],
        grid: [
            {
                top: "50%",
                right: "50%",
                bottom: "18%",
                tooltip: {
                    formatter: scatterPlotTooltipFormatter2,
                },
            },
            {
                bottom: "55%",
                right: "50%",
                tooltip: {
                    formatter: histogramTooltipFormatter,
                },
            },
            {
                top: "50%",
                left: "52%",
                bottom: "18%",
                tooltip: {
                    formatter: histogramTooltipFormatter,
                },
            },
        ],
        series: [
            {
                name: `(${firstCol}, ${secondCol})`,
                type: "scatter",
                xAxisIndex: 0,
                yAxisIndex: 0,
                encode: { tooltip: [0, 1] },
                data: data,
            },
            {
                name: firstCol,
                type: "bar",
                xAxisIndex: 1,
                yAxisIndex: 1,
                barWidth: "99.3%",
                label: {
                    show: true,
                    position: "top",
                },
                encode: {
                    x: 2,
                    y: 3,
                },
                data: firstColBins,
            },
            {
                name: secondCol,
                type: "bar",
                xAxisIndex: 2,
                yAxisIndex: 2,
                barWidth: "99.3%",
                label: {
                    show: true,
                    position: "right",
                },
                encode: {
                    y: 2,
                    x: 3,
                    itemName: 3,
                },
                data: secondColBins,
            },
        ],
    };
};
