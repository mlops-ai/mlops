import { useTheme } from "@/components/providers/theme-provider";

import PredictionsPerDayTimeseries from "@/components/custom-charts/monitoring/predictions-per-day-timeseries";
import { Model } from "@/types/model";
import MonitoringChart from "@/components/custom-charts/monitoring/monitoring-chart";
import { useModal } from "@/hooks/use-modal-hook";
import { useGrid } from "@/hooks/use-grid-hook";
import { useMemo } from "react";

interface MonitoringChartsProps {
    modelData: Model;
}

const MonitoringCharts = ({ modelData }: MonitoringChartsProps) => {
    const { theme } = useTheme();

    const { onOpen } = useModal();

    const grid = useGrid();
    
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
                    onEdit={() =>
                        onOpen("editMonitoringChart", {
                            monitoringChart: chart,
                            model: modelData,
                            baseFeatures: grid.baseFeatures,
                        })
                    }
                />
            );
        });
    }, [
        modelData.interactive_charts,
        modelData.predictions_data,
        theme,
        grid.baseFeatures,
        onOpen,
        ...modelData.interactive_charts.map((chart) => chart.x_axis_column),
        ...modelData.interactive_charts.map((chart) => chart.y_axis_columns),
        ...modelData.interactive_charts.map((chart) => chart.metrics),
        ...modelData.interactive_charts.map((chart) => chart.bin_method),
        ...modelData.interactive_charts.map((chart) => chart.bin_number),
    ]);

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
