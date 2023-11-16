import { binMethodsChartMap } from "@/config/maping";
import {
    histogramTooltipFormatter,
    scatterPlotTooltipFormatter2,
} from "@/lib/utils";
import { BinMethods } from "@/types/monitoring_chart";

export const scatterWithHistogramsOptions = (
    data: any,
    firstColBins: any,
    secondColBins: any,
    firstCol: string,
    secondCol: string,
    binMethod: BinMethods,
    minValueFirstCol: number,
    maxValueFirstCol: number,
    minValueSecondCol: number,
    maxValueSecondCol: number,
    onOpen: () => void,
    theme: "dark" | "light" | "system"
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
            text: `Comparison of ${firstCol} and ${secondCol} with histograms`,
            subtext: `Number of bins: ${firstColBins.length} (${binMethodsChartMap[binMethod]})`,
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
                min: Math.floor(minValueFirstCol),
                max: Math.ceil(maxValueFirstCol),
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
                min: Math.floor(minValueSecondCol),
                max: Math.ceil(maxValueSecondCol),
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
                top: "15%",
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
                barWidth: "99.7%",
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
                barWidth: "99.7%",
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
