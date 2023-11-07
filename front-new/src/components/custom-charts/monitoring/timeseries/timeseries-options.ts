import moment from "moment";

export const timeseriesOptions = (
    data: any,
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
            text: `Timeseries of ${col}`,
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
            formatter: function (params: any) {
                params = params[0];
                var date = new Date(params.data[0]);
                return `${params.marker}${moment(date).format(
                    "DD.MM.YYYY, HH:mm"
                )} <br> ${col}: ${params.data[1]}`;
            },
            axisPointer: {
                animation: false,
            },
        },
        xAxis: {
            type: "time",
            splitLine: {
                show: false,
            },
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
            name: col,
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
        series: [
            {
                name: col,
                type: "line",
                showSymbol: false,
                data: data,
            },
        ],
    };
};
