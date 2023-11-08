export const TreeSelectBaseColumnsOptions = [
    {
        key: "iteration",
        label: "Iteration info",
        leaf: true,
        children: [
            {
                key: "created_at",
                label: "Created",
            },
            {
                key: "experiment_name",
                label: "Experiment name",
            },
            {
                key: "user_name",
                label: "Run by",
            },
        ],
    },
    {
        key: "dataset",
        label: "Dataset info",
        leaf: true,
        children: [
            {
                key: "dataset.name",
                label: "Dataset name",
            },
            {
                key: "dataset.version",
                label: "Version",
            },
        ],
    },
    {
        key: "model",
        label: "Model info",
        leaf: true,
        children: [
            // {
            //     key: "model_name",
            //     label: "Model name",
            // },
            {
                key: "model_path",
                label: "Model path",
            },
        ],
    },
];

export const TreeSelectBaseColumnsChecked = {
    iteration: {
        checked: true,
        partialChecked: false,
    },
    created_at: {
        checked: true,
        partialChecked: false,
    },
    experiment_name: {
        checked: true,
        partialChecked: false,
    },
    user_name: {
        checked: true,
        partialChecked: false,
    },
    dataset: {
        checked: true,
        partialChecked: false,
    },
    'dataset.name': {
        checked: true,
        partialChecked: false,
    },
    'dataset.version': {
        checked: true,
        partialChecked: false,
    },
    model: {
        checked: true,
        partialChecked: false,
    },
    // model_name: {
    //     checked: true,
    //     partialChecked: false,
    // },
    model_path: {
        checked: true,
        partialChecked: false,
    }
}