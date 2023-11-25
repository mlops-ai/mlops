import { Keyable } from "@/types/types";

/**
 * Function for generating the options (configuration) object for a pie plot.
 * @param theme Page theme.
 * @param series Chart series data.
 * @param title Chart title.
 * @param subtitle Chart subtitle.
 * @returns Object containing the options for a pie plot.
 */
export const piePlotOptions = (
    theme: "dark" | "light" | "system",
    series: Keyable[],
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
            trigger: "item"
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
