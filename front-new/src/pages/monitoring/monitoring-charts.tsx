
import Histogram from "@/components/custom-charts/monitoring/histogram";

import { predictions } from "@/test-data/predictions";
import ScatterWithHistograms from "@/components/custom-charts/monitoring/scatter-with-histograms";
import { useTheme } from "@/components/providers/theme-provider";


const MonitoringCharts = () => {
    const rowData = predictions;

    const { theme } = useTheme();

    return (
        <div className="grid grid-cols-1 gap-6">
            <Histogram rowData={rowData} colName="example6" theme={theme} />

            <ScatterWithHistograms rowData={rowData} firstCol="example7" secondCol="example3" numberOfBins={5} theme={theme} />

            <ScatterWithHistograms rowData={rowData} firstCol="age" secondCol="parch" binMethod="freedmanDiaconis" theme={theme} />

            <Histogram
                rowData={rowData}
                colName="example1"
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
