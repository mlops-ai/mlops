export const ModelInfo = [
    // {
    //     field: "model_name",
    //     headerName: "Model",
    //     cellRenderer: (val: any) => {
    //         return <a href={"#"}>{val.data["model_name"]}</a>;
    //     },
    // },
    {
        field: "model_path",
        headerName: "Model Path",
        cellRenderer: (val: any) => {
            if (val.data["path_to_model"]) {
                return val.data["path_to_model"];
            }
            return "-";
        },
    },
];
