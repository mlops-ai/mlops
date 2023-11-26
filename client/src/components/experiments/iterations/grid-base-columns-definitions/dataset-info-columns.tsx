import { Link } from "react-router-dom";

const handleDatasetLinkChange = (val: any) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const ne = searchParams.get("ne");

    if (ne && ne !== "default") {
        return `/datasets?ne=${ne}#${val.data["dataset"]["id"]}`;
    }
    return `/datasets#${val.data["dataset"]["id"]}`;
};

export const DatasetInfo = [
    {
        field: "dataset.name",
        headerName: "Dataset Name",
        cellRenderer: (val: any) => {
            if (val.data["dataset"] && val.data["dataset"]["name"]) {
                return (
                    <Link
                        to={handleDatasetLinkChange(val)}
                        className="hover:underline text-[#0d6efd]"
                    >
                        {val.data["dataset"]["name"]}
                    </Link>
                );
            }
            return "-";
        },
    },
    {
        field: "dataset.version",
        headerName: "Version",
        cellRenderer: (val: any) => {
            if (val.data["dataset"] && val.data["dataset"]["version"]) {
                return val.data["dataset"]["version"];
            }
            return "-";
        },
    },
];
