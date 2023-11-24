import { binMethodsChartMap } from "@/config/maping";
import {
    histogramTooltipFormatter,
    scatterPlotTooltipFormatter2,
} from "@/lib/utils";
import { BinMethod } from "@/types/monitoring-chart";

export const scatterWithHistogramsOptions = (
    data: any,
    firstColBins: any,
    secondColBins: any,
    firstCol: string,
    secondCol: string,
    binMethod: BinMethod,
    minValueFirstCol: number,
    maxValueFirstCol: number,
    minValueSecondCol: number,
    maxValueSecondCol: number,
    onOpen: () => void,
    onEdit: () => void,
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
                    title: "Delete chart",
                    icon: "path://M304.615-160q-26.846 0-45.731-18.884Q240-197.769 240-224.615V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.385Q720-197 701.5-178.5 683-160 655.385-160h-350.77ZM680-720H280v495.385q0 10.769 6.923 17.692T304.615-200h350.77q9.23 0 16.923-7.692Q680-215.385 680-224.615V-720ZM392.307-280h40.001v-360h-40.001v360Zm135.385 0h40.001v-360h-40.001v360ZM280-720v520-520Z",
                    iconStyle: {
                        borderWidth: 0.25,
                        color: theme === "dark" ? "#ffffff" : "#666",
                    },
                    onclick: () => onOpen(),
                },
                myFeature2: {
                    show: true,
                    title: "Edit chart",
                    icon: "path://M442-132q-11 0-19-7.5T413-158l-11-86q-21-6-46.5-20T313-294l-78 34q-11 5-21.5 1T197-273l-38-66q-5-10-3-21t11-18l68-51q-2-12-3.5-25t-1.5-25q0-11 1.5-23.5T235-531l-68-51q-9-7-11.5-18t3.5-21l38-64q6-10 16-14t21 1l78 33q20-17 43.5-30.5T401-716l12-86q2-11 10-18.5t19-7.5h75q11 0 19.5 7.5T547-802l11 87q26 9 45.5 20.5T644-665l82-33q11-5 21-1.5t16 13.5l38 65q6 10 3.5 21T793-582l-72 54q4 14 4.5 25.5t.5 22.5q0 10-1 21.5t-4 28.5l70 52q9 7 11.5 18t-3.5 21l-38 66q-6 10-16.5 13.5T723-261l-79-34q-21 18-42 30.5T558-245l-11 87q-2 11-10.5 18.5T517-132h-75Zm-2-28h78l15-109q30-8 53.5-21.5T636-329l100 43 40-68-88-66q5-18 6.5-32t1.5-28q0-15-1.5-28t-6.5-30l90-68-40-68-103 43q-17-19-47.5-37T532-691l-12-109h-80l-12 108q-30 6-55 20t-51 40l-100-42-40 68 87 65q-5 13-7 29t-2 33q0 15 2 30t6 29l-86 66 40 68 99-42q24 24 49 38t57 22l13 108Zm38-232q37 0 62.5-25.5T566-480q0-37-25.5-62.5T478-568q-37 0-62.5 25.5T390-480q0 37 25.5 62.5T478-392Zm2-88Z",
                    iconStyle: {
                        borderWidth: 0.5,
                        color: theme === "dark" ? "#ffffff" : "#666",
                    },
                    onclick: () => onEdit(),
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
