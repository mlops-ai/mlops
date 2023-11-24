import { Chart } from "@/types/chart";
import ReactEcharts from "echarts-for-react";
import { piePlotOptions } from "./pie-plot/pie-plot-options";

const PiePlot = ({
    chart_data,
    theme,
}: {
    chart_data: Chart;
    theme: "dark" | "light" | "system";
}) => {
    let data: any[] = [];

    chart_data.x_data[0].forEach((x_value, index) => {
        data.push({
            value: chart_data.y_data[0][index],
            name: x_value,
        });
    });

    let series_data: any[] = [];

    series_data.push({
        data: data,
        type: chart_data.chart_type,
        radius: "50%",
        emphasis: {
            focus: "series",
        },
        label: {
            color: theme === "dark" ? "#ffffff" : "#333",
        },
    });

    return (
        <ReactEcharts
            option={piePlotOptions(
                theme,
                series_data,
                chart_data.chart_title,
                chart_data.chart_subtitle
            )}
            notMerge={true}
            theme="customed"
        />
    );
};

export default PiePlot;
