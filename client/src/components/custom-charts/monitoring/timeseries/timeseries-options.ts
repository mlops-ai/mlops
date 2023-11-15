import moment from "moment";

export const timeseriesOptions = (
    data: any,
    col: string,
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
                magicType: {
                    show: true,
                    type: ["line", "bar"],
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
                    "DD.MM.YYYY, HH:mm:ss.SSS"
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
                // minValueSpan: 3600 * 24 * 1000 * 30,
                maxValueSpan: 3600 * 24 * 1000 * 90,
                type: "inside",
                start: 0,
                end: 100,
            },
            {
                // minValueSpan: 3600 * 24 * 1000 * 30,
                maxValueSpan: 3600 * 24 * 1000 * 90,
                start: 0,
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
