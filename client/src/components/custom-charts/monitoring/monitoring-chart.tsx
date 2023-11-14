import Histogram from "./histogram";
import CountPlot from "./count-plot";
import Scatter from "./scatter";
import ScatterWithHistograms from "./scatter-with-histograms";
import Timeseries from "./timeseries";
import { MonitoringChart, MonitoringChartType } from "@/types/monitoring_chart";
import { Prediction } from "@/types/prediction";
import RegressionMetrics from "./regression-metrics";
import ClassificationMetrics from "./classification-metrics";

interface MonitoringChartProps {
    type: MonitoringChartType;
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    theme: "dark" | "light" | "system";
}

const ChartMap = {
    histogram: Histogram,
    countplot: CountPlot,
    scatter: Scatter,
    scatter_with_histograms: ScatterWithHistograms,
    timeseries: Timeseries,
    regression_metrics: RegressionMetrics,
    classification_metrics: ClassificationMetrics,
};

const MonitoringChart = ({
    type,
    chart_schema,
    predictionsData,
    theme,
}: MonitoringChartProps) => {
    const ChartComponent = ChartMap[type];
    return (
        <ChartComponent
            chart_schema={chart_schema}
            predictionsData={predictionsData}
            theme={theme}
        />
    );
};

export default MonitoringChart;
