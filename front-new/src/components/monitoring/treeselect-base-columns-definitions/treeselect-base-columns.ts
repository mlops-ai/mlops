export const TreeSelectBaseColumnsOptions = [
    {
        key: "prediction_info",
        label: "Prediction info",
        leaf: true,
        children: [
            {
                key: "prediction_date",
                label: "Prediction Date",
            },
            {
                key: "predicted_by",
                label: "Predicted By",
            },
        ],
    },
];

export const TreeSelectBaseColumnsChecked = {
    prediction_info: {
        checked: true,
        partialChecked: false,
    },
    prediction_date: {
        checked: true,
        partialChecked: false,
    },
    predicted_by: {
        checked: true,
        partialChecked: false,
    },
}