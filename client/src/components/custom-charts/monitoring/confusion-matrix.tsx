import { calculateConfusionMatrixForMapPlot } from "@/lib/utils";
import { MonitoringChartProps } from "@/types/monitoring-chart";

import ReactEcharts from "echarts-for-react";

import { confusionMatrixOptions } from "./confusion-matrix/confusion-matrix-options";

/**
 * Confusion matrix chart component.
 */
const ConfusionMatrix = ({
    predictionsData,
    onOpen,
    theme,
}: MonitoringChartProps) => {
    /**
     * Calculate confusion matrix.
     */
    const matrixData = calculateConfusionMatrixForMapPlot(predictionsData);

    /**
     * Prepare reversed mapping.
     */
    const reversedMapping = Object.keys(matrixData.classesMap).reduce(
        (acc, key) => {
            acc[matrixData.classesMap[key]] = key;
            return acc;
        },
        {} as { [key: string]: string }
    );

    const classes = Object.keys(matrixData.classesMap);

    const data = [];

    /**
     * Prepare data for confusion matrix.
     */
    let minValue = 0;
    let maxValue = 0;
    for (let i = 0; i < classes.length; i++) {
        for (let j = 0; j < classes.length; j++) {
            data.push([
                matrixData.classesMap[reversedMapping[i]],
                matrixData.classesMap[reversedMapping[j]],
                matrixData.confusionMatrix[i][j],
            ]);
            if (matrixData.confusionMatrix[i][j] > maxValue) {
                maxValue = matrixData.confusionMatrix[i][j];
            }
            if (matrixData.confusionMatrix[i][j] < minValue) {
                minValue = matrixData.confusionMatrix[i][j];
            }
        }
    }

    return (
        <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
            <ReactEcharts
                option={confusionMatrixOptions(
                    classes,
                    data,
                    minValue,
                    maxValue,
                    onOpen,
                    theme,
                    reversedMapping
                )}
                notMerge={true}
                theme="customed"
                style={{ height: "500px" }}
            />
        </div>
    );
};

export default ConfusionMatrix;
