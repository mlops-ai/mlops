import Histogram from "./histogram";
import CountPlot from "./count-plot";
import Scatter from "./scatter";
import ScatterWithHistograms from "./scatter-with-histograms";
import Timeseries from "./timeseries";
import { MonitoringChart, MonitoringChartType } from "@/types/monitoring-chart";
import { Prediction } from "@/types/prediction";
import RegressionMetrics from "./regression-metrics";
import ClassificationMetrics from "./classification-metrics";
import ConfusionMatrix from "./confusion-matrix";

interface MonitoringChartProps {
    type: MonitoringChartType;
    chart_schema: MonitoringChart;
    predictionsData: Prediction[];
    onOpen: () => void;
    onEdit: () => void;
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
    confusion_matrix: ConfusionMatrix,
};

/**
 * Monitoring chart component wrapper.
 */
const MonitoringChart = ({
    type,
    chart_schema,
    predictionsData,
    onOpen,
    onEdit,
    theme,
}: MonitoringChartProps) => {

    const ChartComponent = ChartMap[type];

    return (
        <ChartComponent
            chart_schema={chart_schema}
            predictionsData={predictionsData}
            onOpen={onOpen}
            onEdit={onEdit}
            theme={theme}
        />
    );
};

export default MonitoringChart;
