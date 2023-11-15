const handleModelLinkChange = (val: any) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const ne = searchParams.get("ne");

    if (ne && ne !== "default") {
        return `/models/${val.data["assigned_monitored_model_id"]}/monitoring?ne=${ne}`;
    }
    return `/models/${val.data["assigned_monitored_model_id"]}/monitoring`;
};

export const ModelInfo = [
    {
        field: "model_path",
        headerName: "Model Path",
        cellRenderer: (val: any) => {
            if (
                val.data["assigned_monitored_model_id"] &&
                val.data["assigned_monitored_model_name"]
            ) {
                return (
                    <a
                        href={handleModelLinkChange(val)}
                        target={"_blank"}
                        className="hover:underline text-[#0d6efd]"
                    >
                        {val.data["assigned_monitored_model_name"]}
                    </a>
                );
            }
            if (val.data["path_to_model"]) {
                return val.data["path_to_model"];
            }
            return "-";
        },
    },
];
