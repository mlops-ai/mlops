import { describe, it, expect } from "vitest";
// import { render, screen } from '@testing-library/react';

import {
    numberBetween,
    addDuplicateNumber,
    sortProjectComparator,
    transposeArray,
    dataImageType,
    onlyNumbers,
    xAxisType,
    xAxisTypeCompare,
    groupCustomCharts,
    getMostFrequentValues,
    calculateQuantile,
    calculateRegressionMetrics,
    calculateConfusionMatrix,
    calculateClassificationMetrics,
} from "@/lib/utils.ts";

import {
    iterationNames1,
    iterationNames1Result,
    iterationNames2,
    iterationNames2Result,
    iterationNames3,
    iterationNames3Result,
    testData1,
    testData2,
    testData3,
    testData4,
    sortedData1,
    sortedData2,
} from "./test-files/test-arrays";

import {
    projects,
    projectsSortedByTitleAZ,
    projectsSortedByTitleZA,
    projectsSortedByCreationDateCASC,
    projectsSortedByCreationDateCDESC,
    projectsSortedByLastUpdateUASC,
    projectsSortedByLastUpdateUDESC,
} from "./test-files/projects";

import {
    matrix1,
    matrix1Transposed,
    matrix2,
    matrix2Transposed,
    matrix3,
    matrix3Transposed,
    matrix4,
    matrix4Transposed,
    matrix5,
    matrix5Transposed,
} from "./test-files/test-matrix";

import { encodedImages, encodedImagesTypes } from "./test-files/encoded-images";

import {
    charts1,
    charts2,
    charts3,
    xAxis1,
    xAxis2,
    xAxis3,
    xAxis4,
    xAxis5,
} from "./test-files/x-axis-data";

import {
    customCharts1,
    customCharts1Grouped,
    customCharts2,
    customCharts2Grouped,
    customCharts3,
    customCharts3Grouped,
    customCharts4,
    customCharts4Grouped,
    customCharts5,
    customCharts5Grouped,
    mostFrequentValues1,
    mostFrequentValues2,
    mostFrequentValues3,
} from "./test-files/custom-charts";

import {
    regressionPredictions1,
    regressionPredictions1Result,
    regressionPredictions2,
    regressionPredictions2Result,
    regressionPredictions3,
    regressionPredictions3Result,
    regressionPredictions4,
    regressionPredictions4Result,
    regressionPredictions5,
    regressionPredictions5Result,
    classificationPredictions1,
    classificationPredictions1Result,
    classificationPredictions2,
    classificationPredictions2Result,
    classificationPredictions3,
    classificationPredictions3Result,
    yTrue1,
    yPred1,
    yTrue2,
    yPred2,
} from "./test-files/predictions";

describe("utils.numberBetween", () => {
    it("result should be from range [a, b]", () => {
        const result = numberBetween(1, 10);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
    });
});

describe("utils.addDuplicateNumber", () => {
    it("result array should not contain duplicate strings", () => {
        const result1 = addDuplicateNumber(iterationNames1);
        expect(result1).toEqual(iterationNames1Result);

        const result2 = addDuplicateNumber(iterationNames2);
        expect(result2).toEqual(iterationNames2Result);

        const result3 = addDuplicateNumber(iterationNames3);
        expect(result3).toEqual(iterationNames3Result);
    });
});

describe("utils.sortProjectComparator", () => {
    it("result should be the correct sorting order", () => {
        const result1 = projects.sort((p1, p2) =>
            sortProjectComparator(p1, p2, "AZ")
        );
        expect(result1).toEqual(projectsSortedByTitleAZ);

        const result2 = projects.sort((p1, p2) =>
            sortProjectComparator(p1, p2, "ZA")
        );
        expect(result2).toEqual(projectsSortedByTitleZA);

        const result3 = projects.sort((p1, p2) =>
            sortProjectComparator(p1, p2, "CASC")
        );
        expect(result3).toEqual(projectsSortedByCreationDateCASC);

        const result4 = projects.sort((p1, p2) =>
            sortProjectComparator(p1, p2, "CDESC")
        );
        expect(result4).toEqual(projectsSortedByCreationDateCDESC);

        const result5 = projects.sort((p1, p2) =>
            sortProjectComparator(p1, p2, "UASC")
        );
        expect(result5).toEqual(projectsSortedByLastUpdateUASC);

        const result6 = projects.sort((p1, p2) =>
            sortProjectComparator(p1, p2, "UDESC")
        );
        expect(result6).toEqual(projectsSortedByLastUpdateUDESC);
    });
});

describe("utils.transposeArray", () => {
    it("result array should be transposition of the input array", () => {
        const result1 = transposeArray(matrix1);
        expect(result1).toEqual(matrix1Transposed);

        const result2 = transposeArray(matrix2);
        expect(result2).toEqual(matrix2Transposed);

        const result3 = transposeArray(matrix3);
        expect(result3).toEqual(matrix3Transposed);

        const result4 = transposeArray(matrix4);
        expect(result4).toEqual(matrix4Transposed);

        const result5 = transposeArray(matrix5);
        expect(result5).toEqual(matrix5Transposed);
    });
});

describe("utils.dataImageType", () => {
    it("result should be the correct image type", () => {
        const result1 = dataImageType(encodedImages[0]);
        expect(result1).toEqual(encodedImagesTypes[0]);

        const result2 = dataImageType(encodedImages[1]);
        expect(result2).toEqual(encodedImagesTypes[1]);

        const result3 = dataImageType(encodedImages[2]);
        expect(result3).toEqual(encodedImagesTypes[2]);

        const result4 = dataImageType(encodedImages[3]);
        expect(result4).toEqual(encodedImagesTypes[3]);

        const result5 = dataImageType(encodedImages[4]);
        expect(result5).toEqual(encodedImagesTypes[4]);
    });
});

describe("utils.onlyNumbers", () => {
    it("result should be a boolean value indicating if array contains only numeric values or not", () => {
        const result1 = onlyNumbers(testData1);
        expect(result1).toBe(true);

        const result2 = onlyNumbers(testData2);
        expect(result2).toBe(true);

        const result3 = onlyNumbers(testData3);
        expect(result3).toBe(false);

        const result4 = onlyNumbers(testData4);
        expect(result4).toBe(false);
    });
    expect(true).toBe(true);
});

describe("utils.xAxisType", () => {
    it("result should be a 'value' if x axis data is numerical, 'category' otherwise", () => {
        const result1 = xAxisType(xAxis1);
        expect(result1).toBe("value");

        const result2 = xAxisType(xAxis2);
        expect(result2).toBe("category");

        const result3 = xAxisType(xAxis3);
        expect(result3).toBe("category");

        const result4 = xAxisType(xAxis4);
        expect(result4).toBe("value");

        const result5 = xAxisType(xAxis5);
        expect(result5).toBe("category");
    });
});

describe("utils.xAxisType", () => {
    it("result should be a 'value' if for every chart's x axis data is numerical, 'category' otherwise", () => {
        const result1 = xAxisTypeCompare(charts1);
        expect(result1).toBe("value");

        const result2 = xAxisTypeCompare(charts2);
        expect(result2).toBe("category");

        const result3 = xAxisTypeCompare(charts3);
        expect(result3).toBe("category");
    });
});

describe("utils.groupCustomCharts", () => {
    it("result should be an object of charts arrays grouped by their type or logical name", () => {
        const result1 = groupCustomCharts(customCharts1);
        expect(result1).toEqual(customCharts1Grouped);

        const result2 = groupCustomCharts(customCharts2);
        expect(result2).toEqual(customCharts2Grouped);

        const result3 = groupCustomCharts(customCharts3);
        expect(result3).toEqual(customCharts3Grouped);

        const result4 = groupCustomCharts(customCharts4);
        expect(result4).toEqual(customCharts4Grouped);

        const result5 = groupCustomCharts(customCharts5);
        expect(result5).toEqual(customCharts5Grouped);
    });
});

describe("utils.getMostFrequentValues", () => {
    it("result should be an array of the most frequent values in the input array", () => {
        const groupedCharts = groupCustomCharts(customCharts5);

        const result1 = getMostFrequentValues(
            groupedCharts["scatter_one_x_multiple_y"]
        );
        expect(result1).toEqual(mostFrequentValues1);

        const result2 = getMostFrequentValues(
            groupedCharts["line_one_x_one_y"]
        );
        expect(result2).toEqual(mostFrequentValues2);

        const result3 = getMostFrequentValues(groupedCharts["barrr"]);
        expect(result3).toEqual(mostFrequentValues3);
    });
});

describe("utils.calculateQuantile", () => {
    it("result should be the correct quantile value", () => {
        const result1 = calculateQuantile(sortedData1, 0.1);
        expect(result1).toBe(2);

        const result2 = calculateQuantile(sortedData1, 0.25);
        expect(result2).toBe(4.5);

        const result3 = calculateQuantile(sortedData1, 0.5);
        expect(result3).toBe(5);

        const result4 = calculateQuantile(sortedData1, 0.75);
        expect(result4).toBe(9);

        const result5 = calculateQuantile(sortedData1, 0.95);
        expect(result5).toBe(10.5);

        const result6 = calculateQuantile(sortedData2, 0.1);
        expect(result6).toBe(1.5);

        const result7 = calculateQuantile(sortedData2, 0.25);
        expect(result7).toBe(12.5);

        const result8 = calculateQuantile(sortedData2, 0.5);
        expect(result8).toBe(35.5);

        const result9 = calculateQuantile(sortedData2, 0.75);
        expect(result9).toBe(52.25);

        const result10 = calculateQuantile(sortedData2, 0.95);
        expect(result10).toBe(71);
    });
});

describe("utils.calculateRegressionMetrics", () => {
    it("result should be the correct regression metrics values for predictions data", () => {
        const result1 = calculateRegressionMetrics(regressionPredictions1);
        expect(result1).toEqual(regressionPredictions1Result);

        const result2 = calculateRegressionMetrics(regressionPredictions2);
        expect(result2).toEqual(regressionPredictions2Result);

        const result3 = calculateRegressionMetrics(regressionPredictions3);
        expect(result3).toEqual(regressionPredictions3Result);

        const result4 = calculateRegressionMetrics(regressionPredictions4);
        expect(result4).toEqual(regressionPredictions4Result);

        const result5 = calculateRegressionMetrics(regressionPredictions5);
        expect(result5).toEqual(regressionPredictions5Result);
    });
});

describe("utils.calculateConfusionMatrix", () => {
    it("result should be the correct confusion matrix values for predictions data", () => {
        const result1 = calculateConfusionMatrix(yTrue1, yPred1);
        expect(result1).toEqual([
            [0, 6],
            [2, 2],
        ]);

        const result2 = calculateConfusionMatrix(yTrue2, yPred2);
        console.log(result2);
        expect(result2).toEqual([
            [1, 0, 1, 0, 0, 0],
            [0, 3, 0, 0, 0, 0],
            [0, 0, 2, 1, 0, 1],
            [0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 3, 0],
            [0, 0, 1, 0, 0, 0],
        ]);
    });
});

describe("utils.calculateClassificationMetrics", () => {
    it("result should be the correct classification metrics values for predictions data", () => {
        const result1 = calculateClassificationMetrics(
            classificationPredictions1
        );
        expect(result1).toEqual(classificationPredictions1Result);

        const result2 = calculateClassificationMetrics(
            classificationPredictions2
        );
        expect(result2).toEqual(classificationPredictions2Result);

        const result3 = calculateClassificationMetrics(
            classificationPredictions3
        );
        expect(result3).toEqual(classificationPredictions3Result);
    });
});
