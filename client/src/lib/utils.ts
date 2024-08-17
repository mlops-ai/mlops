import { Chart } from "@/types/chart";
import { Dataset } from "@/types/dataset";
import { Model } from "@/types/model";
import {
    BinMethod,
    MonitoringChart,
    MonitoringChartType,
} from "@/types/monitoring-chart";
import { Prediction } from "@/types/prediction";
import { Project } from "@/types/project";
import { Keyable } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { LoremIpsum } from "lorem-ipsum";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { createMonitoringChartFormSchema } from "./validators";

/**
 * Function for merging Tailwind classes.
 * @param inputs Tailwind classes.
 * @returns Merged Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Function for generating random number between min and max.
 * @param min Minimum number.
 * @param max Maximum number.
 * @returns Random number between min and max.
 */
export const numberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Random string generator.
 */
export const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 6,
        min: 2,
    },
});

/**
 * Function for sorting projects by specified method.
 * @param p1 Project 1.
 * @param p2 Project 2.
 * @param method Sorting method.
 * @returns -1 if p1 should be before p2, 1 if p2 should be before p1, 0 otherwise.
 */
export const sortProjectComparator = (
    p1: Project,
    p2: Project,
    method: string
) => {
    switch (method) {
        case "AZ":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.title.localeCompare(p2.title);
        case "ZA":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return -1 * p1.title.localeCompare(p2.title);
        case "UDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at < p2.updated_at ? 1 : -1;
        case "UASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at > p2.updated_at ? 1 : -1;
        case "CDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at < p2.created_at ? 1 : -1;
        case "CASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at > p2.created_at ? 1 : -1;
        default:
            return 0;
    }
};

/**
 * Function for sorting datasets by specified method.
 * @param d1 Dataset 1.
 * @param d2 Dataset 2.
 * @param method Sorting method.
 * @returns -1 if d1 should be before d2, 1 if d2 should be before d1, 0 otherwise.
 */
export const sortDatasetComparator = (
    d1: Dataset,
    d2: Dataset,
    method: string
) => {
    switch (method) {
        case "AZ":
            if (d1.pinned && !d2.pinned) return -1;
            if (!d1.pinned && d2.pinned) return 1;
            return d1.dataset_name.localeCompare(d2.dataset_name);
        case "ZA":
            if (d1.pinned && !d2.pinned) return -1;
            if (!d1.pinned && d2.pinned) return 1;
            return -1 * d1.dataset_name.localeCompare(d2.dataset_name);
        case "UDESC":
            if (d1.pinned && !d2.pinned) return -1;
            if (!d1.pinned && d2.pinned) return 1;
            return d1.updated_at < d2.updated_at ? 1 : -1;
        case "UASC":
            if (d1.pinned && !d2.pinned) return -1;
            if (!d1.pinned && d2.pinned) return 1;
            return d1.updated_at > d2.updated_at ? 1 : -1;
        case "CDESC":
            if (d1.pinned && !d2.pinned) return -1;
            if (!d1.pinned && d2.pinned) return 1;
            return d1.created_at < d2.created_at ? 1 : -1;
        case "CASC":
            if (d1.pinned && !d2.pinned) return -1;
            if (!d1.pinned && d2.pinned) return 1;
            return d1.created_at > d2.created_at ? 1 : -1;
        default:
            return 0;
    }
};

/**
 * Function for sorting datasets by specified method.
 * @param m1 Model 1.
 * @param m2 Model 2.
 * @param method Sorting method.
 * @returns -1 if m1 should be before m2, 1 if m2 should be before m1, 0 otherwise.
 */
export const sortModelComparator = (m1: Model, m2: Model, method: string) => {
    switch (method) {
        case "AZ":
            if (m1.pinned && !m2.pinned) return -1;
            if (!m1.pinned && m2.pinned) return 1;
            return m1.model_name.localeCompare(m2.model_name);
        case "ZA":
            if (m1.pinned && !m2.pinned) return -1;
            if (!m1.pinned && m2.pinned) return 1;
            return -1 * m1.model_name.localeCompare(m2.model_name);
        case "UDESC":
            if (m1.pinned && !m2.pinned) return -1;
            if (!m1.pinned && m2.pinned) return 1;
            return m1.updated_at < m2.updated_at ? 1 : -1;
        case "UASC":
            if (m1.pinned && !m2.pinned) return -1;
            if (!m1.pinned && m2.pinned) return 1;
            return m1.updated_at > m2.updated_at ? 1 : -1;
        case "CDESC":
            if (m1.pinned && !m2.pinned) return -1;
            if (!m1.pinned && m2.pinned) return 1;
            return m1.created_at < m2.created_at ? 1 : -1;
        case "CASC":
            if (m1.pinned && !m2.pinned) return -1;
            if (!m1.pinned && m2.pinned) return 1;
            return m1.created_at > m2.created_at ? 1 : -1;
        default:
            return 0;
    }
};

/**
 * Function for converting date to humanize form.
 * @param date Date in string format.
 * */
export const dateToHumanize = (date: string) => {
    const difference = moment.duration(Date.now() - Date.parse(date));
    return difference.humanize() + " ago";
};

export const extractColumnsData = (
    columns_metadata: any[],
    type: "parameters" | "metrics",
    TreeSelectBaseColumnsOptionsAll: any,
    TreeSelectBaseColumnsCheckedAll: any
) => {
    const columns: Set<string> = new Set();

    const mapping = {
        parameters: "parameter",
        metrics: "metric",
    };

    const metadataType = mapping[type];

    columns_metadata.forEach((metadata) => {
        Object.keys(metadata).forEach((key) => {
            if (metadata[key].type === metadataType) {
                columns.add(key);
            }
        });
    });

    const columnsArray = Array.from(columns);

    const gridColumns = [];
    const treeselectColumns = [];

    if (columnsArray.length > 0) {
        Object.assign(TreeSelectBaseColumnsCheckedAll, {
            [type]: {
                checked: true,
                partialChecked: false,
            },
        });

        for (let i = 0; i < columnsArray.length; i++) {
            const key = `${type}.` + columnsArray[i];
            gridColumns.push({
                field: key,
                headerName: columnsArray[i],
                filter: "agNumberColumnFilter",
                cellRenderer: (val: any) => {
                    if (val.data[type] && val.data[type][columnsArray[i]]) {
                        return val.data[type][columnsArray[i]];
                    }
                    return "-";
                },
            });
            treeselectColumns.push({
                key: key,
                label: columnsArray[i],
            });
            Object.assign(TreeSelectBaseColumnsCheckedAll, {
                [key]: {
                    checked: true,
                    partialChecked: false,
                },
            });
        }

        TreeSelectBaseColumnsOptionsAll.push({
            key: type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
            leaf: true,
            children: treeselectColumns,
        });
    }

    return [
        gridColumns,
        TreeSelectBaseColumnsOptionsAll,
        TreeSelectBaseColumnsCheckedAll,
    ];
};

/**
 * Function for adding duplicate number to array of strings.
 * Used in Compare Iterations View to distinguish iterations with the same name.
 * @param array Array of strings.
 * @returns Array of strings with duplicate numbers.
 * */

export const addDuplicateNumber = (array: string[]) => {
    const duplicatesCounter: any = {};
    const arrayWithNumbers: string[] = [];
    for (let i = 0; i < array.length; i++) {
        const str = array[i];

        if (duplicatesCounter[str]) {
            duplicatesCounter[str]++;
            const new_str = `${str} [${duplicatesCounter[str]}]`;
            arrayWithNumbers.push(new_str);
        } else {
            duplicatesCounter[str] = 1;
            arrayWithNumbers.push(str);
        }
    }

    return arrayWithNumbers;
};

/**
 * Function for transposing array.
 * @param array Array to transpose.
 * @returns Transposed array.
 * */
export const transposeArray = (array: any[]) => {
    return array.reduce(
        (prev, next) =>
            next.map((_: any, i: number) => (prev[i] || []).concat(next[i])),
        []
    );
};

/**
 * Function for retrieving image type from encoded image.
 * @param encoded_image Encoded image.
 * @returns Image type data URI.
 * */
export const dataImageType = (encoded_image: string) => {
    const startsWith = encoded_image[0];
    switch (startsWith) {
        case "/":
            return "data:image/jpeg;base64";
        case "i":
            return "data:image/png;base64";
        case "R":
            return "data:image/gif;base64";
        case "Q":
            return "data:image/bmp;base64";
        case "U":
            return "data:image/webp;base64";
        case "P":
            return "data:image/svg+xml;base64";
        default:
            return null;
    }
};

export const extractIdFromPath = (path: string) => {
    const regex = /\/projects\/([a-f0-9]{24})\/experiments/i;
    const match = path.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};

/**
 * Function for checking if array contains only numeric values.
 * @param array Array to check.
 * @returns True if array contains only numeric values, false otherwise.
 */
export const onlyNumbers = (array: any[]) => {
    return array.every((element) => {
        return !isNaN(element);
    });
};

/**
 * Function for specifying x axis type based on x axis data.
 * Used with interactive line and scatter plots.
 * @param array Array of x axis data.
 * @returns "value" if array contains only numeric values, "category" otherwise.
 */
export const xAxisType = (array: any[][]) => {
    let type = "value";
    array.forEach((data) => {
        if (!onlyNumbers(data)) {
            type = "category";
        }
    });
    return type;
};

/**
 * Function for specifying x axis type based on x axis data for multiple charts.
 * Used with interactive line and scatter plots.
 * @param array Array of charts with x axis data for every chart.
 * @returns "value" if every chart in array contains only numeric values, "category" otherwise.
 */
export const xAxisTypeCompare = (charts: Chart[]) => {
    let type = "value";
    charts.forEach((chart) => {
        chart.x_data.forEach((data) => {
            if (!onlyNumbers(data)) {
                type = "category";
            }
        });
    });
    return type;
};

/**
 * Function used to specify min x/y axis range value for interactive charts based on x/y axis data.
 * @param value Echarts object, containing the min and max value of the data.
 * @returns Floor of min value from object.
 */
export const minValue = (value: any) => {
    return Math.floor(value.min);
};

/**
 * Function used to specify max x/y axis range value for interactive charts based on x/y axis data.
 * @param value Echarts object, containing the min and max value of the data.
 * @returns Ceil of max value from object.
 */
export const maxValue = (value: any) => {
    return Math.ceil(value.max);
};

/**
 * Function for grouping charts by chart type and chart logical name to perform comparasion of charts.
 * Used in Compare Iterations View.
 * @param charts Array of charts (with comparable param set to true).
 * @returns Object with keys as chart types/chart logical names and values as arrays of charts with the same chart type/chart logical name.
 * */
export const groupCustomCharts = (charts: Chart[]) => {
    return charts.reduce((arr: any, chart: Chart) => {
        if (chart.chart_type !== "pie" && chart.chart_type !== "boxplot") {
            arr[chart.name] = arr[chart.name] || [];
            arr[chart.name].push(chart);
        } else {
            arr[chart.chart_type] = arr[chart.chart_type] || [];
            arr[chart.chart_type].push(chart);
        }
        return arr;
    }, {});
};

/**
 * Function for checking if every chart in array have the same type.
 * Used in Compare Iterations View to check if charts can be compared.
 * @param charts Array of charts.
 * @param firstType Chart type of the first chart in array.
 * @returns True if every chart in array have the same type, false otherwise.
 */
export const checkTypesInGroup = (charts: Chart[], firstType: string) => {
    return charts.every((chart) => {
        return chart.chart_type === firstType;
    });
};

/**
 * Helper function for finding the most frequent key in object of pairs value:occurences.
 * @param counts Object of pairs value:occurences.
 * @returns Most frequent key.
 */
const getMostFrequentValue = (counts: Keyable) => {
    let highestFrequency = 0;
    let hfKey = "";
    for (const key in counts) {
        if (counts[key] > highestFrequency) {
            highestFrequency = counts[key];
            hfKey = key;
        }
    }
    return hfKey;
};

/**
 * Function for finding the most frequent value of chart title, subtitle, x_label and y_label in charts array.
 * Used in Compare Iterations View to set chart title, subtitle, x_label and y_label based on all charts in group.
 * @param charts Array of charts.
 * @returns Array of most frequent value of chart title, subtitle, x_label and y_label.
 */
export const getMostFrequentValues = (charts: Chart[]) => {
    const titleCounts: Keyable = {};
    const subtitleCounts: Keyable = {};
    const xLabelCounts: Keyable = {};
    const yLabelCounts: Keyable = {};

    charts.forEach((chart: Chart) => {
        if (chart.chart_title) {
            if (titleCounts[chart.chart_title]) {
                titleCounts[chart.chart_title]++;
            } else {
                titleCounts[chart.chart_title] = 1;
            }
        }

        if (chart.chart_subtitle) {
            if (subtitleCounts[chart.chart_subtitle]) {
                subtitleCounts[chart.chart_subtitle]++;
            } else {
                subtitleCounts[chart.chart_subtitle] = 1;
            }
        }

        if (chart.x_label) {
            if (xLabelCounts[chart.x_label]) {
                xLabelCounts[chart.x_label]++;
            } else {
                xLabelCounts[chart.x_label] = 1;
            }
        }

        if (chart.y_label) {
            if (yLabelCounts[chart.y_label]) {
                yLabelCounts[chart.y_label]++;
            } else {
                yLabelCounts[chart.y_label] = 1;
            }
        }
    });

    return [
        getMostFrequentValue(titleCounts),
        getMostFrequentValue(subtitleCounts),
        getMostFrequentValue(xLabelCounts),
        getMostFrequentValue(yLabelCounts),
    ];
};

/**
 * Function for checking if every bar chart in array have the same x axis data.
 * Used in Compare Iterations View to check if bar charts can be compared.
 * @param charts Array of bar charts.
 * @param firstX X axis data of the first chart in array.
 * @returns True if every chart in array have the same x axis data, false otherwise.
 */
export const checkXDataInBarPlotGroup = (charts: Chart[], firstX: any[]) => {
    return charts.every((chart) => {
        return JSON.stringify(chart.x_data[0]) === JSON.stringify(firstX);
    });
};

/**
 * Function for generating histogram data.
 * @param values Array of numbers sorted in ascending order.
 * @param numBins Number of bins.
 * @returns Array of bins data array [bin start, bin end, bin center, number of items] for every bin.
 */
export const generateHistogramData = (values: number[], numBins: number) => {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const binWidth = (maxValue - minValue) / numBins;

    const histogramData = [];

    for (let i = 0; i < numBins; i++) {
        const binStart = minValue + i * binWidth;
        const binEnd = binStart + binWidth;
        const binCenter = (binStart + binEnd) / 2;
        let binCount = 0;

        if (i === numBins - 1) {
            binCount = values.filter(
                (value) => value >= binStart && value <= maxValue
            ).length;
        } else {
            binCount = values.filter(
                (value) => value >= binStart && value < binEnd
            ).length;
        }

        histogramData.push([binStart, binEnd, binCenter, binCount]);
    }

    return histogramData;
};

/**
 * Function for calculating q-quantile of data.
 * @param data Array of numbers sorted in ascending order.
 * @param q Quantile.
 * @returns q-quantile of data.
 */
export const calculateQuantile = (data: number[], q: number) => {
    const index = (data.length - 1) * q;

    if (Number.isInteger(index)) {
        return data[index];
    } else {
        const lowerIndex = Math.floor(index);
        const upperIndex = Math.ceil(index);

        const lowerValue = data[lowerIndex];
        const upperValue = data[upperIndex];

        const fraction = index - lowerIndex;
        return lowerValue + (upperValue - lowerValue) * fraction;
    }
};

/**
 * Function for calculating dot product of two arrays.
 * @param vec1 Array of numbers.
 * @param vec2 Array of numbers.
 * @returns Dot product of two arrays.
 */
export const dot = (vec1: number[], vec2: number[]) => {
    return vec1
        .map((_, i: number) => vec1[i] * vec2[i])
        .reduce((m: number, n: number) => m + n);
};

/**
 * Function for calculating histogram bins data based on Square Root rule.
 * @param data Array of numbers sorted in ascending order.
 * @returns Array of bins data array [bin start, bin end, bin center, number of items] for every bin.
 * */
export const squareRootBins = (data: number[]) => {
    const numberOfBins = Math.ceil(Math.sqrt(data.length));
    return generateHistogramData(data, numberOfBins);
};

/**
 * Function for calculating histogram bins data based on Scoot rule.
 * @param data Array of numbers sorted in ascending order.
 * @returns Array of bins data array [bin start, bin end, bin center, number of items] for every bin.
 * */
export const scottBins = (data: number[]) => {
    const mean = data.reduce((a, b) => a + b) / data.length;

    const std = Math.sqrt(
        data.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
            data.length
    );

    const binWidth = (3.5 * std) / Math.pow(data.length, 1 / 3);

    const numberOfBins = Math.ceil(
        (Math.max(...data) - Math.min(...data)) / binWidth
    );

    return generateHistogramData(data, numberOfBins);
};

/**
 * Function for calculating histogram bins data based on Freedman-Diaconis rule.
 * @param data Array of numbers sorted in ascending order.
 * @returns Array of bins data array [bin start, bin end, bin center, number of items] for every bin.
 * */
export const freedmanDiaconisBins = (data: number[]) => {
    const binWidth =
        (2 * (calculateQuantile(data, 0.75) - calculateQuantile(data, 0.25))) /
        Math.pow(data.length, 1 / 3);

    const numberOfBins = Math.ceil(
        (Math.max(...data) - Math.min(...data)) / binWidth
    );

    return generateHistogramData(data, numberOfBins);
};

/**
 * Function for calculating histogram bins data based on Sturges rule.
 * @param data Array of numbers sorted in ascending order.
 * @returns Array of bins data array [bin start, bin end, bin center, number of items] for every bin.
 * */
export const sturgesBins = (data: number[]) => {
    const numOfBins = Math.ceil(Math.log2(data.length) + 1);

    return generateHistogramData(data, numOfBins);
};

/**
 * Function for calculating frequency of values in array.
 * Used in Countplot.
 * @param data Array of values.
 * @returns Array of unique values and array of their frequencies.
 * */
export const countUniqueValues = (data: any[]) => {
    const counts: Keyable = {};

    for (const value of data) {
        if (counts[value]) {
            counts[value] += 1;
        } else {
            counts[value] = 1;
        }
    }

    const unique_values = Object.keys(counts);
    const unique_counts = Object.values(counts);

    return [unique_values, unique_counts];
};

/**
 * Function for calculating number of predictions per day.
 * Used in Timeseries predictions per day chart.
 * @param predictions Array of predictions.
 * @returns Array of arrays [date, number of predictions].
 * */
export const countPredictionByDate = (predictions: Keyable[]) => {
    const dateCount: Keyable = {};

    predictions.forEach((prediction: Keyable) => {
        const predictionDate = new Date(prediction.prediction_date);
        const year = predictionDate.getFullYear();
        const month = predictionDate.getMonth() + 1;
        const day = predictionDate.getDate();

        const key = `${year}-${month}-${day < 10 ? "0" : ""}${day}`;

        if (dateCount[key]) {
            dateCount[key]++;
        } else {
            dateCount[key] = 1;
        }
    });

    const uniqueDates: any = Object.keys(dateCount);
    const objectCounts: any = Object.values(dateCount);

    let data: any = [];

    uniqueDates.forEach((date: any, index: any) => {
        data.push([date, objectCounts[index]]);
    });

    return data;
};

/**
 * Function for calculating regression metrics for given predictions data.
 * @param data Array of predictions.
 * @returns Array of regression metrics - [RMSE, MSE, MAE, R2, MSLE, RMSLE, MedianAE, SMAPE].
 * */
export const calculateRegressionMetrics = (data: Prediction[]) => {
    const filteredData = data.filter((prediction: Prediction) => {
        return prediction.actual !== undefined && prediction.actual !== null;
    });

    const n = filteredData.length;

    if (n === 0) {
        return {
            r2: 0,
            mse: 0,
            rmse: 0,
            mae: 0,
            msle: 0,
            rmsle: 0,
            medae: 0,
            smape: 0,
        };
    }

    let yTrue: number[] = [];
    let yPred: number[] = [];

    filteredData.forEach((prediction: Prediction) => {
        yTrue.push(prediction.actual as number);
        yPred.push(prediction.prediction);
    });

    const meanYTrue = yTrue.reduce((sum, val) => sum + val, 0) / n;

    const SST = yTrue.reduce(
        (sum, val: number) => sum + Math.pow(val - meanYTrue, 2),
        0
    );
    const SSR = yTrue.reduce(
        (sum, val, index) => sum + Math.pow(val - yPred[index], 2),
        0
    );

    const absoluteErrors = yTrue
        .map((val, index) => Math.abs(val - yPred[index]))
        .sort((a, b) => a - b);

    const smapeErrors = [];
    for (let i = 0; i < n; i++) {
        const numerator = Math.abs(yTrue[i] - yPred[i]);
        const denominator = (Math.abs(yTrue[i]) + Math.abs(yPred[i])) / 2;

        const smapeError = denominator !== 0 ? numerator / denominator : 0;

        smapeErrors.push(smapeError);
    }

    const r2 = 1 - SSR / SST;

    const mse = SSR / n;

    const rmse = Math.sqrt(mse);

    const mae =
        yTrue.reduce(
            (sum, val, index) => sum + Math.abs(val - yPred[index]),
            0
        ) / n;

    const msle =
        yTrue.reduce(
            (sum, _, index) =>
                sum +
                Math.pow(
                    Math.log(1 + yTrue[index]) - Math.log(1 + yPred[index]),
                    2
                ),
            0
        ) / n;

    const rmsle = Math.sqrt(msle);

    let medae;
    if (n % 2 === 0) {
        const mid1 = n / 2 - 1;
        const mid2 = n / 2;
        medae = (absoluteErrors[mid1] + absoluteErrors[mid2]) / 2;
    } else {
        const mid = Math.floor(n / 2);
        medae = absoluteErrors[mid];
    }

    const smape =
        smapeErrors.reduce((sum, smapeError) => sum + smapeError, 0) / n;

    return {
        r2,
        mse,
        rmse,
        mae,
        msle,
        rmsle,
        medae,
        smape,
    };
};

/**
 * Function for calculating classification metrics for given predictions data.
 * @param data Array of predictions.
 * @returns Array of classification metrics - [Accuracy, Precision, Recall, F1-Score, Matthews Correlation Coefficient].
 * */
export const calculateClassificationMetrics = (data: Prediction[]) => {
    const filteredData = data.filter((prediction: Prediction) => {
        return prediction.actual !== undefined && prediction.actual !== null;
    });

    const n = filteredData.length;

    if (n === 0) {
        return {
            accuracy: 0,
            precision: 0,
            recall: 0,
            f1score: 0,
            mcc: 0,
        };
    }

    let yTrue: number[] = [];
    let yPred: number[] = [];

    filteredData.forEach((prediction: Prediction) => {
        yTrue.push(prediction.actual as number);
        yPred.push(prediction.prediction);
    });

    const classes = [...new Set([...yTrue, ...yPred])];

    const confusionMatrix = calculateConfusionMatrix(yTrue, yPred);

    const metrics: any = {};

    const totalCorrect = confusionMatrix.reduce(
        (acc, row, i) => acc + row[i],
        0
    );

    metrics.accuracy =
        totalCorrect /
        confusionMatrix.flat().reduce((acc, val) => acc + val, 0);

    metrics.precision = [];
    metrics.recall = [];
    metrics.f1Score = [];

    for (let i = 0; i < confusionMatrix.length; i++) {
        const truePositive = confusionMatrix[i][i];
        const falsePositive =
            confusionMatrix
                .map((row) => row[i])
                .reduce((acc, val) => acc + val, 0) - truePositive;
        const falseNegative = confusionMatrix[i].reduce(
            (acc, val, j) => acc + (j !== i ? val : 0),
            0
        );

        metrics.precision[i] =
            truePositive + falsePositive !== 0
                ? truePositive / (truePositive + falsePositive)
                : 0;

        metrics.recall[i] =
            truePositive + falseNegative !== 0
                ? truePositive / (truePositive + falseNegative)
                : 0;

        metrics.f1Score[i] =
            metrics.precision[i] + metrics.recall[i] !== 0
                ? (2 * metrics.precision[i] * metrics.recall[i]) /
                  (metrics.precision[i] + metrics.recall[i])
                : 0;
    }

    metrics.averageAccuracy = metrics.accuracy;
    metrics.averagePrecision =
        metrics.precision.reduce((acc: number, val: number) => acc + val, 0) /
        metrics.precision.length;
    metrics.averageRecall =
        metrics.recall.reduce((acc: number, val: number) => acc + val, 0) /
        metrics.recall.length;
    metrics.averageF1Score =
        metrics.f1Score.reduce((acc: number, val: number) => acc + val, 0) /
        metrics.f1Score.length;

    const c = confusionMatrix.reduce((acc, row, i) => acc + row[i], 0);
    const s = n;

    const t = Array.from({ length: classes.length }, () => 0);
    const p = Array.from({ length: classes.length }, () => 0);

    for (let k = 0; k < classes.length; k++) {
        for (let i = 0; i < classes.length; i++) {
            t[k] += confusionMatrix[i][k];
        }
    }

    for (let k = 0; k < classes.length; k++) {
        for (let i = 0; i < classes.length; i++) {
            p[k] += confusionMatrix[k][i];
        }
    }

    const numerator = c * s - dot(t, p);
    const denominator =
        Math.sqrt(s * s - dot(p, p)) * Math.sqrt(s * s - dot(t, t));

    const mcc = denominator !== 0 ? numerator / denominator : 0;

    metrics.mcc = mcc;

    return {
        accuracy: metrics.averageAccuracy,
        precision: metrics.averagePrecision,
        recall: metrics.averageRecall,
        f1score: metrics.averageF1Score,
        mcc: metrics.mcc,
    };
};

/**
 * Function for calculating confusion matrix for given predictions data.
 * Used for calculating classification metrics.
 * @param yTrue Array of actual values.
 * @param yPred Array of predicted values.
 * @returns Confusion matrix.
 * */
export const calculateConfusionMatrix = (yTrue: any[], yPred: any[]) => {
    const classes = [...new Set([...yTrue, ...yPred])].sort((a, b) => a - b);

    const classesMap = generateClassesMapping(classes);

    const confusionMatrix = Array.from({ length: classes.length }, () =>
        Array.from({ length: classes.length }, () => 0)
    );

    for (let i = 0; i < yTrue.length; i++) {
        const trueClass = classesMap[yTrue[i]];
        const predictedClass = classesMap[yPred[i]];

        confusionMatrix[trueClass][predictedClass]++;
    }

    return confusionMatrix;
};

/**
 * Helper function for calculating confusion matrix for given predictions data.
 * Used for confusion matrix map.
 * @param data Array of predictions.
 * @returns Confusion matrix and classes maping.
 * */
export const calculateConfusionMatrixForMapPlot = (data: Prediction[]) => {
    const filteredData = data.filter((prediction: Prediction) => {
        return prediction.actual !== undefined && prediction.actual !== null;
    });

    const n = filteredData.length;

    if (n === 0) {
        return {
            classesMap: {},
            confusionMatrix: [],
        };
    }

    let yTrue: number[] = [];
    let yPred: number[] = [];

    filteredData.forEach((prediction: Prediction) => {
        yTrue.push(prediction.actual as number);
        yPred.push(prediction.prediction);
    });

    const classes = [...new Set([...yTrue, ...yPred])].sort((a, b) => a - b);

    const classesMap = generateClassesMapping(classes);

    const confusionMatrix = Array.from({ length: classes.length }, () =>
        Array.from({ length: classes.length }, () => 0)
    );

    for (let i = 0; i < yTrue.length; i++) {
        const trueClass = classesMap[yTrue[i]];
        const predictedClass = classesMap[yPred[i]];

        confusionMatrix[trueClass][predictedClass]++;
    }

    return {
        classesMap,
        confusionMatrix,
    };
};

/**
 * Helper function for generating classes mapping for confusion matrix calculation.
 * @param classes Array of classes names.
 */
export const generateClassesMapping = (classes: any[]) => {
    const classesMap: Keyable = {};
    for (let i = 0; i < classes.length; i++) {
        classesMap[classes[i]] = i;
    }
    return classesMap;
};
/**
 * Helper function for generating chart title for monitoring chart based it's type.
 * @param chart Monitoring chart.
 * @returns Chart title.
 */
export const generateChartTitle = (chart: MonitoringChart) => {
    switch (chart.chart_type) {
        case "histogram":
            return `Histogram of ${chart.x_axis_column}`;
        case "scatter":
            return `Scatter plot of ${
                chart.x_axis_column
            } and ${chart.y_axis_columns?.join(",")}`;
        case "scatter_with_histograms":
            return `Comparison of ${
                chart.x_axis_column
            } and ${chart.y_axis_columns?.join(",")} with histograms`;
        case "countplot":
            return `Countplot of ${chart.x_axis_column}`;
        case "timeseries":
            return `Timeseries of ${chart.x_axis_column}`;
        case "regression_metrics":
            return `Regression metrics`;
        case "classification_metrics":
            return `Classification metrics`;
    }
};

/**
 * Helper function for generating scatter plot tooltip.
 * @param args Echarts object.
 * @returns Tooltip formatter.
 */
export const scatterPlotTooltipFormatter = (args: any) => {
    return `${args.marker}${args.seriesName} (${args.dataIndex})<br />(${[
        args.data[0],
        args.data[1],
    ].join(", ")})`;
};

/**
 * Helper function for generating scatter plot tooltip with prediction value.
 * @param args Echarts object.
 * @returns Tooltip formatter.
 */
export const scatterPlotTooltipFormatter2 = (args: any) => {
    return `${args.marker}${args.seriesName} (${args.dataIndex})<br />(${[
        args.data[0],
        args.data[1],
    ].join(", ")})<br />prediction: ${args.data[2]}`;
};

/**
 * Helper function for generating histogram plot tooltip.
 * @param args Echarts object.
 * @returns Tooltip formatter.
 */
export const histogramTooltipFormatter = (args: any) => {
    return `${args.marker} ${args.seriesName}'s bin (${args.dataIndex + 1}): [${
        Math.round(args.data[0] * 100) / 100
    }-${Math.round(args.data[1] * 100) / 100}] <br />Items in bin: <b>${
        args.data[3]
    }</b>`;
};

/**
 * Helper function for prepare create monitoring chart form data for sending to backend.
 */
export const prepareCreateMonitoringChartFormData = (
    values: z.infer<typeof createMonitoringChartFormSchema>
) => {
    let chartData: Keyable;

    switch (values.chart_type) {
        case MonitoringChartType.HISTOGRAM:
            chartData = {
                chart_type: values.chart_type,
                x_axis_column: values.x_axis_column as string,
                y_axis_column: null,
                bin_method: values.bin_method,
                bin_number:
                    values.bin_method === BinMethod.FIXED_NUMBER
                        ? values.bin_number
                        : null,
                metrics: null,
            };
            break;
        case MonitoringChartType.COUNTPLOT:
            chartData = {
                chart_type: values.chart_type,
                x_axis_column: values.x_axis_column as string,
                second_column: null,
                bin_method: null,
                bin_number: null,
                metrics: null,
            };
            break;
        case MonitoringChartType.TIMESERIES:
            chartData = {
                chart_type: values.chart_type,
                x_axis_column: null,
                y_axis_columns: values.y_axis_columns as string[],
                bin_method: null,
                bin_number: null,
                metrics: null,
            };
            break;
        case MonitoringChartType.SCATTER:
            chartData = {
                chart_type: values.chart_type,
                x_axis_column: values.x_axis_column as string,
                y_axis_columns: values.y_axis_columns as string[],
                bin_method: null,
                bin_number: null,
                metrics: null,
            };
            break;
        case MonitoringChartType.SCATTER_WITH_HISTOGRAMS:
            chartData = {
                chart_type: values.chart_type,
                x_axis_column: values.x_axis_column as string,
                y_axis_columns: values.y_axis_columns as string[],
                bin_method: values.bin_method,
                bin_number:
                    values.bin_method === BinMethod.FIXED_NUMBER
                        ? values.bin_number
                        : null,
                metrics: null,
            };
            break;
        case MonitoringChartType.CLASSIFICATION_METRICS:
        case MonitoringChartType.REGRESSION_METRICS:
            chartData = {
                chart_type: values.chart_type,
                x_axis_column: null,
                y_axis_columns: null,
                bin_method: null,
                bin_number: null,
                metrics: values.metrics,
            };
            break;
        case MonitoringChartType.CONFUSION_MATRIX:
            chartData = {
                chart_type: values.chart_type,
                x_axis_column: null,
                y_axis_columns: null,
                bin_method: null,
                bin_number: null,
                metrics: null,
            };
            break;
    }
    return chartData;
};
