import Histogram from "@/components/custom-charts/monitoring/histogram";

import ReactEcharts from "echarts-for-react";

import { predictions } from "@/test-data/predictions";
import ScatterWithHistograms from "@/components/custom-charts/monitoring/scatter-with-histograms";
import { useTheme } from "@/components/providers/theme-provider";

import Timeseries from "@/components/custom-charts/monitoring/timeseries";
import Scatter from "@/components/custom-charts/monitoring/scatter";
import CountPlot from "@/components/custom-charts/monitoring/count-plot";
import PredictionsPerDayTimeseries from "@/components/custom-charts/monitoring/predictions-per-day-timeseries";

const MonitoringCharts = () => {
    const rowData = predictions;

    const { theme } = useTheme();

    return (
        <div className="grid grid-cols-1 gap-6">
            <Histogram rowData={rowData} colName="example6" theme={theme} />

            {/* <ReactEcharts option={option} theme="customed" /> */}

            <PredictionsPerDayTimeseries rowData={rowData} theme={theme} />

            <Scatter
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
            />

            <ScatterWithHistograms
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
            />
        </div>
    );
};

export default MonitoringCharts;
