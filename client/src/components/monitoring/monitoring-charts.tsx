import { useTheme } from "@/components/providers/theme-provider";

import PredictionsPerDayTimeseries from "@/components/custom-charts/monitoring/predictions-per-day-timeseries";
import { Model } from "@/types/model";
import MonitoringChart from "@/components/custom-charts/monitoring/monitoring-chart";
import { useModal } from "@/hooks/use-modal-hook";
import { useGrid } from "@/hooks/use-grid-hook";
import { useCallback } from "react";
import { MonitoringChart as MonitoringChartType } from "@/types/monitoring-chart";
import { Button } from "../ui/button";

interface MonitoringChartsProps {
    modelData: Model;
}

const MonitoringCharts = ({ modelData }: MonitoringChartsProps) => {
    const { theme } = useTheme();

    const { onOpen } = useModal();

    const grid = useGrid();

    const edit = useCallback(
        (chart: MonitoringChartType) =>
            onOpen("editMonitoringChart", {
                monitoringChart: chart,
                model: modelData,
                baseFeatures: grid.baseFeatures,
            }),
        [modelData, grid.baseFeatures]
    );

    const monitoringCharts = () => {
        if (!modelData.interactive_charts) return [];

        return modelData.interactive_charts.map((chart) => {
            let edit = () => {
                onOpen("editMonitoringChart", {
                    monitoringChart: chart,
                    model: modelData,
                    baseFeatures: grid.baseFeatures,
                });
            };
            console.log("edit", chart);
            return (
                <>
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
                    {/* <Button
                        onClick={() =>
                            onOpen("deleteMonitoringChart", {
                                monitoringChart: chart,
                                model: modelData,
                            })
                        }
                        className="text-center"
                        variant="mlopsDanger"
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={() =>
                            onOpen("editMonitoringChart", {
                                monitoringChart: chart,
                                model: modelData,
                                baseFeatures: grid.baseFeatures,
                            })
                        }
                        className="text-center"
                        variant="mlopsPrimary"
                    >
                        Edit
                    </Button> */}
                </>
            );
        });
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            <PredictionsPerDayTimeseries
                rowData={modelData.predictions_data}
                theme={theme}
            />
            {monitoringCharts()}
        </div>
    );
};

export default MonitoringCharts;
