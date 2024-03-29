import moment from "moment";

/**
 * Function for generating the options (configuration) object for a predictions per day timeseries chart.
 * @param data Data for series.
 * @param firstPredictionDate First prediction date.
 * @param lastPredictionDate Last prediction date.
 * @param theme Page theme.
 * @returns Object containing the options for a predictions per day timeseries chart.
 */
export const predictionsPerDayTimeseriesOptions = (
    data: any,
    firstPredictionDate: Date,
    lastPredictionDate: Date,
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
                magicType: {
                    show: true,
                    type: ["line", "bar"],
                },
                restore: {
                    show: true,
                },
                saveAsImage: {},
            },
        },
        title: {
            left: "center",
            text: `Predictions per day timeseries`,
            subtext: `From ${firstPredictionDate.toLocaleDateString()} to ${lastPredictionDate.toLocaleDateString()}`,
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
            formatter: function (params: any) {
                var date = new Date(params.data[0]);
                return `${params.marker} ${moment(date).format(
                    "DD.MM.YYYY"
                )} <br /> Predictions: ${params.data[1]}`;
            },

            axisPointer: {
                animation: false,
            },
        },
        dataZoom: [
            {
                minValueSpan: 3600 * 24 * 1000 * 30,
                maxValueSpan: 3600 * 24 * 1000 * 365,
                type: "inside",
                start: 100,
                end: 100,
            },
            {
                minValueSpan: 3600 * 24 * 1000 * 30,
                maxValueSpan: 3600 * 24 * 1000 * 365,
                start: 100,
                end: 100,
            },
        ],
        xAxis: {
            type: "time",
            minInterval: 3600 * 1000 * 24,
            maxInterval: 3600 * 1000 * 24,
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
            name: "count",
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
        grid: {
            top: "20%",
            bottom: "14%",
            containLabel: true,
            show: true,
        },
        series: {
            name: "count",
            type: "bar",
            data: data,
            showSymbol: false,
            emphasis: {
                focus: "series",
            },
            label: {
                show: true,
                position: "top",
            },
        },
    };
};
