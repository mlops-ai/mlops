import { useTheme } from "@/components/providers/theme-provider";

import PredictionsPerDayTimeseries from "@/components/custom-charts/monitoring/predictions-per-day-timeseries";
import { Model } from "@/types/model";
import { useMemo } from "react";
import MonitoringChart from "@/components/custom-charts/monitoring/monitoring-chart";
import { useModal } from "@/hooks/use-modal-hook";

interface MonitoringChartsProps {
    modelData: Model;
}

const MonitoringCharts = ({ modelData }: MonitoringChartsProps) => {
    const { theme } = useTheme();

    const { onOpen } = useModal();

    const monitoringCharts = useMemo(() => {
        if (!modelData.interactive_charts) return [];

        return modelData.interactive_charts.map((chart) => {
            return (
                <MonitoringChart
                    key={chart.id}
                    type={chart.chart_type}
                    chart_schema={chart}
                    predictionsData={modelData.predictions_data}
                    theme={theme}
                    onOpen={() =>
                        onOpen("deleteMonitoringChart", {
                            monitoringChart: chart,
                            model: modelData,
                        })
                    }
                />
            );
        });
    }, [modelData, modelData.interactive_charts, theme]);

    return (
        <div className="grid grid-cols-1 gap-6">
            <PredictionsPerDayTimeseries
                rowData={modelData.predictions_data}
                theme={theme}
            />
            {monitoringCharts}
        </div>
    );
};

export default MonitoringCharts;
