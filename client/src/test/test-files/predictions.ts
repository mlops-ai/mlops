import { Prediction } from "@/types/prediction";

export const regressionPredictions1 = [
    {
        id: "1",
        prediction_date: Date.now().toString(),
        predicted_by: "user1",
        input_data: {
            x: 1,
            y: 2,
            z: 3,
        },
        prediction: 2,
        actual: 1,
    } as Prediction,
    {
        id: "2",
        prediction_date: Date.now().toString(),
        predicted_by: "user2",
        input_data: {
            x: 4,
            y: 5,
            z: 6,
        },
        prediction: 3,
        actual: 2,
    } as Prediction,
    {
        id: "3",
        prediction_date: Date.now().toString(),
        predicted_by: "user3",
        input_data: {
            x: 7,
            y: 8,
            z: 9,
        },
        prediction: 2,
        actual: 3,
    } as Prediction,
    {
        id: "4",
        prediction_date: Date.now().toString(),
        predicted_by: "user4",
        input_data: {
            x: 10,
            y: 11,
            z: 12,
        },
        prediction: 4,
        actual: 4,
    } as Prediction,
    {
        id: "5",
        prediction_date: Date.now().toString(),
        predicted_by: "user5",
        input_data: {
            x: 13,
            y: 14,
            z: 15,
        },
        prediction: 6,
        actual: 5,
    } as Prediction,
    {
        id: "6",
        prediction_date: Date.now().toString(),
        predicted_by: "user6",
        input_data: {
            x: 16,
            y: 17,
            z: 18,
        },
        prediction: 9,
        actual: 6,
    } as Prediction,
    {
        id: "7",
        prediction_date: Date.now().toString(),
        predicted_by: "user7",
        input_data: {
            x: 19,
            y: 20,
            z: 21,
        },
        prediction: 10,
        actual: 7,
    } as Prediction,
    {
        id: "8",
        prediction_date: Date.now().toString(),
        predicted_by: "user8",
        input_data: {
            x: 22,
            y: 23,
            z: 24,
        },
        prediction: 8,
        actual: 8,
    } as Prediction,
    {
        id: "9",
        prediction_date: Date.now().toString(),
        predicted_by: "user9",
        input_data: {
            x: 25,
            y: 26,
            z: 27,
        },
        prediction: 9,
        actual: 9,
    } as Prediction,
    {
        id: "10",
        prediction_date: Date.now().toString(),
        predicted_by: "user10",
        input_data: {
            x: 28,
            y: 29,
            z: 30,
        },
        prediction: 12,
        actual: 10,
    } as Prediction,
] as Prediction[];

export const regressionPredictions1Result = {
    r2: 0.6848484848484848,
    mse: 2.6,
    rmse: 1.61245154965971,
    mae: 1.2,
    msle: 0.061022319730433726,
    rmsle: 0.24702696154556433,
    medae: 1.0,
    smape: 0.2583244206773619,
};

export const regressionPredictions2 = [
    ...regressionPredictions1,
    {
        id: "11",
        prediction_date: Date.now().toString(),
        predicted_by: "user11",
        input_data: {
            x: 31,
            y: 32,
            z: 33,
        },
        prediction: 11,
        actual: 0,
    } as Prediction,
    {
        id: "12",
        prediction_date: Date.now().toString(),
        predicted_by: "user12",
        input_data: {
            x: 34,
            y: 35,
            z: 36,
        },
        prediction: 5,
        actual: 0,
    } as Prediction,
];

export const regressionPredictions2Result = {
    r2: -0.2940438871473352,
    mse: 14.333333333333334,
    rmse: 3.7859388972001824,
    mae: 2.3333333333333335,
    msle: 0.8329488542527802,
    rmsle: 0.9126603170143754,
    medae: 1.0,
    smape: 0.5486036838978016,
};

export const regressionPredictions3 = [
    {
        id: "13",
        prediction_date: Date.now().toString(),
        predicted_by: "user13",
        input_data: {
            x: 37,
            y: 38,
            z: 39,
        },
        prediction: 11,
        actual: 12,
    } as Prediction,
    {
        id: "14",
        prediction_date: Date.now().toString(),
        predicted_by: "user14",
        input_data: {
            x: 40,
            y: 41,
            z: 42,
        },
        prediction: 13,
        actual: 13,
    } as Prediction,
    {
        id: "15",
        prediction_date: Date.now().toString(),
        predicted_by: "user15",
        input_data: { x: 43, y: 44, z: 45 },
        prediction: 14,
        actual: 14,
    } as Prediction,
    {
        id: "16",
        prediction_date: Date.now().toString(),
        predicted_by: "user16",
        input_data: { x: 46, y: 47, z: 48 },
        prediction: 14,
        actual: 15,
    } as Prediction,
    {
        id: "17",
        prediction_date: Date.now().toString(),
        predicted_by: "user17",
        input_data: { x: 49, y: 50, z: 51 },
        prediction: 15,
        actual: 15,
    } as Prediction,
    {
        id: "18",
        prediction_date: Date.now().toString(),
        predicted_by: "user18",
        input_data: { x: 52, y: 53, z: 54 },
        prediction: 16,
        actual: 22,
    } as Prediction,
    {
        id: "19",
        prediction_date: Date.now().toString(),
        predicted_by: "user19",
        input_data: { x: 55, y: 56, z: 57 },
        prediction: 18,
        actual: 27,
    } as Prediction,
] as Prediction[];

export const regressionPredictions3Result = {
    r2: 0.34921875,
    mse: 17.0,
    rmse: 4.123105625617661,
    mae: 2.4285714285714284,
    msle: 0.036043984043015016,
    rmsle: 0.18985253235870997,
    medae: 1.0,
    smape: 0.12453021609496004,
};

export const regressionPredictions4 = [
    ...regressionPredictions3,
    {
        id: "19",
        prediction_date: Date.now().toString(),
        predicted_by: "user20",
        input_data: { x: 58, y: 59, z: 60 },
        prediction: 19,
        actual: 24,
    } as Prediction,
    {
        id: "20",
        prediction_date: Date.now().toString(),
        predicted_by: "user20",
        input_data: { x: 61, y: 62, z: 63 },
        prediction: 18,
        actual: undefined,
    } as Prediction,
    {
        id: "21",
        prediction_date: Date.now().toString(),
        predicted_by: "user21",
        input_data: { x: 64, y: 65, z: 66 },
        prediction: 20,
        actual: 22,
    } as Prediction,
];

export const regressionPredictions4Result = {
    r2: 0.39233576642335766,
    mse: 16.444444444444443,
    rmse: 4.055175020198813,
    mae: 2.6666666666666665,
    msle: 0.034486310802681594,
    rmsle: 0.1857049024734716,
    medae: 1.0,
    smape: 0.13327863860418881,
};

export const regressionPredictions5 = [
    {
        id: "22",
        prediction_date: Date.now().toString(),
        predicted_by: "user22",
        input_data: { x: 67, y: 68, z: 69 },
        prediction: 21,
        actual: undefined,
    } as Prediction,
    {
        id: "23",
        prediction_date: Date.now().toString(),
        predicted_by: "user23",
        input_data: { x: 70, y: 71, z: 72 },
        prediction: 22,
        actual: undefined,
    } as Prediction,
    {
        id: "24",
        prediction_date: Date.now().toString(),
        predicted_by: "user24",
        input_data: { x: 73, y: 74, z: 75 },
        prediction: 23,
        actual: undefined,
    } as Prediction,
    {
        id: "25",
        prediction_date: Date.now().toString(),
        predicted_by: "user25",
        input_data: { x: 76, y: 77, z: 78 },
        prediction: 24,
        actual: undefined,
    } as Prediction,
    {
        id: "26",
        prediction_date: Date.now().toString(),
        predicted_by: "user26",
        input_data: { x: 79, y: 80, z: 81 },
        prediction: 25,
        actual: undefined,
    } as Prediction,
    {
        id: "27",
        prediction_date: Date.now().toString(),
        predicted_by: "user27",
        input_data: { x: 82, y: 83, z: 84 },
        prediction: 26,
        actual: undefined,
    } as Prediction,
] as Prediction[];

export const regressionPredictions5Result = {
    r2: 0,
    mse: 0,
    rmse: 0,
    mae: 0,
    msle: 0,
    rmsle: 0,
    medae: 0,
    smape: 0,
};

export const classificationPredictions1 = [
    {
        id: "1",
        prediction_date: Date.now().toString(),
        predicted_by: "user1",
        input_data: { x: 1, y: 2, z: 3 },
        prediction: 1,
        actual: 0,
    } as Prediction,
    {
        id: "2",
        prediction_date: Date.now().toString(),
        predicted_by: "user2",
        input_data: { x: 4, y: 5, z: 6 },
        prediction: 0,
        actual: 1,
    } as Prediction,
    {
        id: "3",
        prediction_date: Date.now().toString(),
        predicted_by: "user3",
        input_data: { x: 7, y: 8, z: 9 },
        prediction: 1,
        actual: 0,
    } as Prediction,
    {
        id: "4",
        prediction_date: Date.now().toString(),
        predicted_by: "user4",
        input_data: { x: 10, y: 11, z: 12 },
        prediction: 1,
        actual: 0,
    } as Prediction,
    {
        id: "5",
        prediction_date: Date.now().toString(),
        predicted_by: "user5",
        input_data: { x: 13, y: 14, z: 15 },
        prediction: 1,
        actual: 1,
    } as Prediction,
    {
        id: "6",
        prediction_date: Date.now().toString(),
        predicted_by: "user6",
        input_data: { x: 16, y: 17, z: 18 },
        prediction: 0,
        actual: 1,
    } as Prediction,
    {
        id: "7",
        prediction_date: Date.now().toString(),
        predicted_by: "user7",
        input_data: { x: 19, y: 20, z: 21 },
        prediction: 1,
        actual: 0,
    } as Prediction,
] as Prediction[];

export const classificationPredictions1Result = {
    accuracy: 0.14285714285714285,
    precision: 0.1,
    recall: 0.16666666666666666,
    f1score: 0.125,
    mcc: -0.7302967433402214,
};

export const classificationPredictions2 = [
    ...classificationPredictions1,
    {
        id: "8",
        prediction_date: Date.now().toString(),
        predicted_by: "user8",
        input_data: { x: 22, y: 23, z: 24 },
        prediction: 1,
        actual: 0,
    } as Prediction,
    {
        id: "9",
        prediction_date: Date.now().toString(),
        predicted_by: "user9",
        input_data: { x: 25, y: 26, z: 27 },
        prediction: 1,
        actual: 0,
    } as Prediction,
    {
        id: "10",
        prediction_date: Date.now().toString(),
        predicted_by: "user10",
        input_data: { x: 28, y: 29, z: 30 },
        prediction: 1,
        actual: 1,
    } as Prediction,
    {
        id: "11",
        prediction_date: Date.now().toString(),
        predicted_by: "user11",
        input_data: { x: 31, y: 32, z: 33 },
        prediction: 1,
        actual: undefined,
    } as Prediction,
];

export const classificationPredictions2Result = {
    accuracy: 0.2,
    precision: 0.125,
    recall: 0.25,
    f1score: 0.16666666666666666,
    mcc: -0.6123724356957945,
};

export const classificationPredictions3 = [
    {
        id: "12",
        prediction_date: Date.now().toString(),
        predicted_by: "user12",
        input_data: { x: 34, y: 35, z: 36 },
        prediction: 1,
        actual: 1,
    } as Prediction,
    {
        id: "13",
        prediction_date: Date.now().toString(),
        predicted_by: "user13",
        input_data: { x: 37, y: 38, z: 39 },
        prediction: 3,
        actual: 2,
    } as Prediction,
    {
        id: "14",
        prediction_date: Date.now().toString(),
        predicted_by: "user14",
        input_data: { x: 40, y: 41, z: 42 },
        prediction: 2,
        actual: 2,
    } as Prediction,
    {
        id: "15",
        prediction_date: Date.now().toString(),
        predicted_by: "user15",
        input_data: { x: 43, y: 44, z: 45 },
        prediction: 1,
        actual: 3,
    } as Prediction,
    {
        id: "16",
        prediction_date: Date.now().toString(),
        predicted_by: "user16",
        input_data: { x: 46, y: 47, z: 48 },
        prediction: 4,
        actual: 4,
    } as Prediction,
    {
        id: "17",
        prediction_date: Date.now().toString(),
        predicted_by: "user17",
        input_data: { x: 49, y: 50, z: 51 },
        prediction: 0,
        actual: 0,
    } as Prediction,
    {
        id: "18",
        prediction_date: Date.now().toString(),
        predicted_by: "user18",
        input_data: { x: 52, y: 53, z: 54 },
        prediction: 1,
        actual: 1,
    } as Prediction,
    {
        id: "19",
        prediction_date: Date.now().toString(),
        predicted_by: "user19",
        input_data: { x: 55, y: 56, z: 57 },
        prediction: 4,
        actual: 4,
    } as Prediction,
    {
        id: "20",
        prediction_date: Date.now().toString(),
        predicted_by: "user20",
        input_data: { x: 58, y: 59, z: 60 },
        prediction: 4,
        actual: 4,
    } as Prediction,
    {
        id: "21",
        prediction_date: Date.now().toString(),
        predicted_by: "user21",
        input_data: { x: 61, y: 62, z: 63 },
        prediction: 2,
        actual: 5,
    } as Prediction,
    {
        id: "22",
        prediction_date: Date.now().toString(),
        predicted_by: "user22",
        input_data: { x: 64, y: 65, z: 66 },
        prediction: 3,
        actual: 3,
    } as Prediction,
    {
        id: "23",
        prediction_date: Date.now().toString(),
        predicted_by: "user23",
        input_data: { x: 67, y: 68, z: 69 },
        prediction: 2,
        actual: 2,
    } as Prediction,
    {
        id: "24",
        prediction_date: Date.now().toString(),
        predicted_by: "user24",
        input_data: { x: 70, y: 71, z: 72 },
        prediction: 2,
        actual: 0,
    } as Prediction,
    {
        id: "25",
        prediction_date: Date.now().toString(),
        predicted_by: "user25",
        input_data: { x: 73, y: 74, z: 75 },
        prediction: 1,
        actual: 1,
    } as Prediction,
    {
        id: "26",
        prediction_date: Date.now().toString(),
        predicted_by: "user26",
        input_data: { x: 76, y: 77, z: 78 },
        prediction: 5,
        actual: 2,
    } as Prediction,
] as Prediction[];

export const classificationPredictions3Result = {
    accuracy: 0.6666666666666666,
    precision: 0.625,
    recall: 0.5833333333333334,
    f1score: 0.5873015873015873,
    mcc: 0.5889252434210647,
};

export const yTrue1 = [0, 1, 0, 0, 1, 1, 0, 0, 0, 1];
export const yPred1 = [1, 0, 1, 1, 1, 0, 1, 1, 1, 1];

export const yTrue2 = [1, 2, 2, 3, 4, 0, 1, 4, 4, 5, 3, 2, 0, 1, 2];
export const yPred2 = [1, 3, 2, 1, 4, 0, 1, 4, 4, 2, 3, 2, 2, 1, 5];
