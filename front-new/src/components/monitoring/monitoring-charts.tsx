
import { predictions } from "@/test-data/predictions_new";
import { useTheme } from "@/components/providers/theme-provider";

import PredictionsPerDayTimeseries from "@/components/custom-charts/monitoring/predictions-per-day-timeseries";
import { Model } from "@/types/model";
import { useMemo } from "react";
import MonitoringChart from "../custom-charts/monitoring/monitoring-chart";

interface MonitoringChartsProps {
    modelData: Model;
}

const MonitoringCharts = ({ modelData }: MonitoringChartsProps) => {

    console.log(modelData);
    
    const { theme } = useTheme();
    const monitoringCharts = useMemo(() => {
        if (!modelData.monitoring_charts) return [];
        return modelData.monitoring_charts.map((chart) => {
            return (
                <MonitoringChart
                    key={chart.id}
                    type={chart.chart_type}
                    chart_schema={chart}
                    predictionsData={predictions}
                    theme={theme}
                />
            );
        });
    }, [modelData.monitoring_charts]);

    const rowData = predictions;

    return (
        <div className="grid grid-cols-1 gap-6">
            <PredictionsPerDayTimeseries rowData={rowData} theme={theme} />
            {monitoringCharts}
            {/* <Histogram rowData={rowData} colName="example6" theme={theme} /> */}

            {/* <ReactEcharts option={option} theme="customed" /> */}

            {/* <Scatter
                rowData={rowData}
                firstCol="example7"
                secondCol="example3"
                theme={theme}
            />
            <Scatter
                rowData={rowData}
                firstCol="example1"
                secondCol="example2"
                theme={theme}
            />
            <Scatter
                rowData={rowData}
                firstCol="example9"
                secondCol="example3"
                theme={theme}
            />

            <Timeseries rowData={rowData} colName="example7" theme={theme} />
            <Timeseries rowData={rowData} colName="example3" theme={theme} />
            <Timeseries rowData={rowData} colName="example6" theme={theme} />
            <Timeseries
                rowData={rowData}
                colName="predicted_value"
                theme={theme}
            />

            <ScatterWithHistograms
                rowData={rowData}
                firstCol="example7"
                secondCol="example3"
                numberOfBins={5}
                theme={theme}
            /> */}

            {/* <ScatterWithHistograms
                rowData={rowData}
                firstCol="example7"
                secondCol="example9"
                numberOfBins={5}
                theme={theme}
            />

            <ScatterWithHistograms
                rowData={rowData}
                firstCol="age"
                secondCol="parch"
                binMethod="freedmanDiaconis"
                theme={theme}
            />

            <CountPlot rowData={rowData} colName="parch" theme={theme} />

            <CountPlot rowData={rowData} colName="sibs" theme={theme} />

            <CountPlot
                rowData={rowData}
                colName="predicted_value"
                theme={theme}
            />

            <CountPlot rowData={rowData} colName="example10" theme={theme} />

            <Histogram
                rowData={rowData}
                colName="example2"
                binMethod="freedmanDiaconis"
                theme={theme}
            />

            <Histogram
                rowData={rowData}
                colName="sibs"
                numberOfBins={7}
                theme={theme}
            />
            <Histogram
                rowData={rowData}
                colName="parch"
                binMethod="sturges"
                theme={theme}
            />
            <Histogram
                rowData={rowData}
                colName="age"
                binMethod="freedmanDiaconis"
                theme={theme}
            /> */}
        </div>
    );
};

export default MonitoringCharts;
