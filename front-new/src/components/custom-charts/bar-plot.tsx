import { Chart } from "@/types/chart";
import { barPlotOptions } from "./bar-plot/bar-plot-options";
import ReactEcharts from "echarts-for-react";

const BarPlot = ({
    chart_data,
    iteration_name,
    theme,
}: {
    chart_data: Chart;
    iteration_name: string;
    theme: "dark" | "light" | "system";
}) => {
    let series_data: any[] = [];

    if (chart_data.y_data.length >= 2) {
        chart_data.y_data.forEach((y_data, index) => {
            series_data.push({
                name: chart_data.y_data_names && chart_data.y_data_names.length > 0 ? chart_data.y_data_names[index] : `${iteration_name} (${index + 1})`,
                data: y_data,
                type: chart_data.chart_type,
                showSymbol: false,
                emphasis: {
                    focus: "series",
                },
            });
        });
    } else {
        series_data.push({
            name: iteration_name,
            data: chart_data.y_data[0],
            type: chart_data.chart_type,
            showSymbol: false,
            emphasis: {
                focus: "series",
            },
        });
    }
    
    return (
      <ReactEcharts
          option={barPlotOptions(
              theme,
              chart_data.x_data,
              series_data,
              chart_data.x_label,
              chart_data.y_label,
              chart_data.chart_title,
              chart_data.chart_subtitle
          )}
          theme="customed"
      />
  );
};

export default BarPlot;
