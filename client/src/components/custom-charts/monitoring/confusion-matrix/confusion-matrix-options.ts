export const confusionMatrixOptions = (
    classes: any[],
    data: any[],
    minValue: number,
    maxValue: number,
    onOpen: () => void,
    theme: "dark" | "light" | "system",
    map: any
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
            },
        },
        title: {
            left: "center",
            text: `Confusion matrix`,
            subtext: `Number of unique classes: ${classes.length}`,
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
            formatter: (params: any) => {
                return `${params.marker} ${
                    params.value[2]
                } <br /> Actual class: <b>${
                    map[params.value[1]]
                }</b> <br /> Predicted as: <b>${map[params.value[0]]}</b>`;
            },
        },
        xAxis: {
            type: "category",
            data: classes,
            name: "Predicted class",
            nameLocation: "center",
            nameGap: 30,
            splitArea: {
                show: true,
            },
            splitLine: {
                lineStyle: {
                    color: theme === "dark" ? "#374151" : "#ccc",
                },
            },
            position: "top",
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: theme === "dark" ? "#ffffff" : "#333",
                },
            },
            axisLabel: {
                color: theme === "dark" ? "#ffffff" : "#666",
            },
        },
        yAxis: {
            name: "Actual class",
            type: "category",
            data: classes,
            splitArea: {
                show: true,
            },
            inverse: true,
            axisLine: {
                lineStyle: {
                    color: theme === "dark" ? "#ffffff" : "#333",
                },
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    color: theme === "dark" ? "#374151" : "#ccc",
                },
            },
            axisLabel: {
                color: theme === "dark" ? "#ffffff" : "#666",
            },
        },
        grid: [
            {
                top: "22%",
            },
        ],
        visualMap: {
            min: minValue,
            max: maxValue,
            calculable: true,
            orient: "horizontal",
            left: "center",
            type: "piecewise",
            textStyle: {
                color: theme === "dark" ? "#ffffff" : "#333",
            },
            pageTextStyle: {
                color: theme === "dark" ? "#ffffff" : "#333",
            },
        },
        series: [
            {
                name: "Confusion matrix",
                type: "heatmap",
                data: data,
                label: {
                    show: true,
                },
                itemStyle: {
                    borderWidth: 3,
                    borderType: "solid",
                    borderColor: theme === "dark" ? "#000" : "#1F2937",
                },
            },
        ],
    };
};
