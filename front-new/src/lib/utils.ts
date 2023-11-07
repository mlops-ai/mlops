import { Chart } from "@/types/chart";
import { Dataset } from "@/types/dataset";
import { Iteration } from "@/types/iteration";
import { Model } from "@/types/model";
import { Project } from "@/types/project";
import { Keyable } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { LoremIpsum } from "lorem-ipsum";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const numberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 6,
        min: 2,
    },
});

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

export const sortDatasetComparator = (
    p1: Dataset,
    p2: Dataset,
    method: string
) => {
    switch (method) {
        case "AZ":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.dataset_name.localeCompare(p2.dataset_name);
        case "ZA":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return -1 * p1.dataset_name.localeCompare(p2.dataset_name);
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

export const sortModelComparator = (p1: Model, p2: Model, method: string) => {
    switch (method) {
        case "AZ":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.model_name.localeCompare(p2.model_name);
        case "ZA":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return -1 * p1.model_name.localeCompare(p2.model_name);
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
 * Function for converting date to humanize form.
 * */
export const dateToHumanize = (date: string) => {
    const difference = moment.duration(Date.now() - Date.parse(date));
    return difference.humanize() + " ago";
};

export const extractColumnsData = (
    rowData: Iteration[],
    type: "parameters" | "metrics",
    TreeSelectBaseColumnsOptionsAll: any,
    TreeSelectBaseColumnsCheckedAll: any
) => {
    let columnsPerIterations = rowData.map(
        (iteration) =>
            new Set(
                iteration[type]
                    ? Object.getOwnPropertyNames(iteration[type])
                    : ""
            )
    );

    let columnsUniqueSet = new Set<string>();

    columnsPerIterations.forEach((set) => {
        set.forEach((value) => {
            columnsUniqueSet.add(value);
        });
    });

    let columnsUniqueArray = Array.from(columnsUniqueSet);

    let gridColumns = [];
    let treeselectColumns = [];

    if (columnsUniqueArray.length > 0) {
        Object.assign(TreeSelectBaseColumnsCheckedAll, {
            [type]: {
                checked: true,
                partialChecked: false,
            },
        });

        for (let i = 0; i < columnsUniqueArray.length; i++) {
            const key = `${type}.` + columnsUniqueArray[i];
            gridColumns.push({
                field: key,
                headerName: columnsUniqueArray[i],
                filter: "agNumberColumnFilter",
                cellRenderer: (val: any) => {
                    if (
                        val.data[type] &&
                        val.data[type][columnsUniqueArray[i]]
                    ) {
                        return val.data[type][columnsUniqueArray[i]];
                    }
                    return "-";
                },
            });
            treeselectColumns.push({
                key: key,
                label: columnsUniqueArray[i],
            });
            Object.assign(TreeSelectBaseColumnsCheckedAll, {
                [key]: {
                    checked: true,
                    partialChecked: false,
                },
            });
            // columns_list.push(key)
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

export const addDuplicateNumber = (array: string[]) => {
    const duplicatesCounter: any = {};
    const arrayWithNumbers: string[] = [];
    for (let i = 0; i < array.length; i++) {
        const ciag = array[i];

        if (duplicatesCounter[ciag]) {
            duplicatesCounter[ciag]++;
            const nowyCiag = `${ciag} [${duplicatesCounter[ciag]}]`;
            arrayWithNumbers.push(nowyCiag);
        } else {
            duplicatesCounter[ciag] = 1;
            arrayWithNumbers.push(ciag);
        }
    }

    return arrayWithNumbers;
};

export const transposeArray = (array: any[]) => {
    return array.reduce(
        (prev, next) =>
            next.map((item: any, i: number) => (prev[i] || []).concat(next[i])),
        []
    );
};

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

export const onlyNumbers = (array: any[]) => {
    return array.every((element) => {
        return !isNaN(element);
    });
};

export const xAxisType = (array: any[][]) => {
    array.forEach((data) => {
        if (!onlyNumbers(data)) {
            return "category";
        }
    });
    return "value";
};

export const xAxisTypeCompare = (charts: Chart[]) => {
    charts.forEach((chart) => {
        chart.x_data.forEach((data) => {
            if (!onlyNumbers(data)) {
                return "category";
            }
        });
    });
    return "value";
};

export const minValue = (value: any) => {
    return Math.floor(value.min);
};

export const maxValue = (value: any) => {
    return Math.ceil(value.max);
};

export const scatterPlotTooltipFormatter = (args: any) => {
    return `${args.marker}${args.seriesName} (${args.dataIndex})<br />(${[
        args.data[0],
        args.data[1],
    ].join(", ")})`;
};

export const scatterPlotTooltipFormatter2 = (args: any) => {
    return `${args.marker}${args.seriesName} (${args.dataIndex})<br />(${[
        args.data[0],
        args.data[1],
    ].join(", ")})<br />predicted_value: ${args.data[2]}`;
};

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

export const checkTypesInGroup = (charts: Chart[], firstType: string) => {
    return charts.every((chart) => {
        return chart.chart_type === firstType;
    });
};

const findMaxValue = (counts: Keyable) => {
    let maxValue = 0;
    let maxKey = "";
    for (const key in counts) {
        if (counts[key] > maxValue) {
            maxValue = counts[key];
            maxKey = key;
        }
    }
    return maxKey;
};

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
        findMaxValue(titleCounts),
        findMaxValue(subtitleCounts),
        findMaxValue(xLabelCounts),
        findMaxValue(yLabelCounts),
    ];
};

export const checkXDataInBarPlotGroup = (charts: Chart[], firstX: any[]) => {
    return charts.every((chart) => {
        return JSON.stringify(chart.x_data[0]) === JSON.stringify(firstX);
    });
};

export const getParameterTypes = (objects: Keyable[]) => {
    const parameterTypes: Keyable = {};

    for (const obj of objects) {
        for (const key in obj) {
            if (typeof obj[key] !== "number") {
                parameterTypes[key] = "agTextColumnFilter";
            } else if (!parameterTypes[key]) {
                parameterTypes[key] = "agNumberColumnFilter";
            }
        }
    }

    return parameterTypes;
};

export const generateHistogramData = (values: number[], numBins: number) => {
    // Znajdź minimum i maksimum wśród wartości
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Oblicz szerokość każdego pojemnika
    const binWidth = (maxValue - minValue) / numBins;

    // Inicjalizuj tablicę wynikową
    const histogramData = [];

    // Inicjalizuj pojemniki i zlicz liczbę elementów w każdym pojemniku
    for (let i = 0; i < numBins; i++) {
        const binStart = minValue + i * binWidth;
        const binEnd = binStart + binWidth;
        const binCenter = (binStart + binEnd) / 2;
        let binCount = 0;

        if (i === numBins - 1) {
            binCount = values.filter(
                (value) => value >= binStart && value <= binEnd
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

export const histogramTooltipFormatter = (args: any) => {
    return `${args.marker} ${args.seriesName}'s bin (${args.dataIndex + 1}): [${
        Math.round(args.data[0] * 100) / 100
    }-${Math.round(args.data[1] * 100) / 100}] <br />Items in bin: <b>${
        args.data[3]
    }</b>`;
};

export const quantile = (data: number[], q: number) => {
    const pos = (data.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (data[base + 1] !== undefined) {
        return data[base] + rest * (data[base + 1] - data[base]);
    } else {
        return data[base];
    }
};

export const squareRootBins = (data: number[]) => {
    const numberOfBins = Math.ceil(Math.sqrt(data.length));
    return generateHistogramData(data, numberOfBins);
};

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

export const freedmanDiaconisBins = (data: number[]) => {
    const binWidth =
        (2 * (quantile(data, 0.75) - quantile(data, 0.25))) /
        Math.pow(data.length, 1 / 3);

    const numberOfBins = Math.ceil(
        (Math.max(...data) - Math.min(...data)) / binWidth
    );

    return generateHistogramData(data, numberOfBins);
};

export const sturgesBins = (data: number[]) => {
    const numOfBins = Math.ceil(Math.log2(data.length) + 1);

    return generateHistogramData(data, numOfBins);
};

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
}