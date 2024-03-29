import ReactEcharts from "echarts-for-react";

import { Keyable } from "@/types/types";

import { predictionsPerDayTimeseriesOptions } from "./predictions-per-day-timeseries/predictions-per-day-timeseries-options";
import { countPredictionByDate } from "@/lib/utils";

interface PredictionsPerDayTimeseriesProps {
    rowData: Keyable[];
    theme: "dark" | "light" | "system";
}

/**
 * Predictions per day timeseries chart component.
 */
const PredictionsPerDayTimeseries = ({
    rowData,
    theme,
}: PredictionsPerDayTimeseriesProps) => {

    /**
     * Extract prediction dates.
     */
    const prediction_dates = rowData.map((row) =>
        Date.parse(row.prediction_date)
    );

    /**
     * Get first and last prediction dates.
     */
    const firstPredictionDate = new Date(Math.min(...prediction_dates));
    const lastPredictionDate = new Date(Math.max(...prediction_dates));

    /**
     * Calculate predictions per day.
     */
    const data = countPredictionByDate(rowData);

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={predictionsPerDayTimeseriesOptions(
                    data,
                    firstPredictionDate,
                    lastPredictionDate,
                    theme
                )}
                notMerge={true}
                style={{ height: "400px"}}
                theme="customed"
            />
        </div>
    );
};

export default PredictionsPerDayTimeseries;
