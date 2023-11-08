import { dateToHumanize } from "@/lib/utils";
import { IDateFilterParams } from "ag-grid-community";
import moment from "moment";

export const IterationInfo = (project_id: string) => {
    /**
     * Filter comparator for date (created_at) column
     * */
    const filterDateComparator: IDateFilterParams = {
        comparator: (filterDate: Date, cellValue: string) => {
            let dateInCell = new Date(cellValue);
            dateInCell = new Date(
                dateInCell.getFullYear(),
                dateInCell.getMonth(),
                dateInCell.getDate(),
                0,
                0,
                0,
                0
            );
            if (filterDate.getTime() === dateInCell.getTime()) {
                return 0;
            }
            if (dateInCell < filterDate) {
                return -1;
            }
            if (dateInCell > filterDate) {
                return 1;
            }
            return 0;
        },
        inRangeFloatingFilterDateFormat: "Do MMM YYYY",
    };

    return [
        {
            field: "iteration_name",
            headerName: "Name",
            pinned: true,
            filter: true,
            cellRenderer: (val: any) => {
                const url = new URL(window.location.href);
                const searchParams = new URLSearchParams(url.search);
                const ne = searchParams.get("ne");
                // return `/datasets?ne=${ne}#${val.data["dataset"]["id"]}`;
                return (
                    <a
                        className="hover:underline text-[#0d6efd]"
                        href={
                            "/projects/" +
                            project_id +
                            "/experiments/" +
                            val.data["experiment_id"] +
                            "/iterations/" +
                            val.data["id"] +
                            `${
                                ne && ne !== "default"
                                    ? `?ne=${searchParams.get("ne")}`
                                    : ""
                            }`
                        }
                    >
                        {val.data["iteration_name"]}
                    </a>
                );
            },
        },
        {
            field: "created_at",
            headerName: "Created",
            sort: "desc",
            filter: "agDateColumnFilter",
            filterParams: filterDateComparator,
            cellRenderer: (val: any) => {
                return (
                    <span
                        title={moment(new Date(val.data["created_at"])).format(
                            "DD-MM-YYYY, HH:mm:ss"
                        )}
                    >
                        {dateToHumanize(val.data["created_at"])}
                    </span>
                );
            },
        },
        {
            field: "experiment_name",
            headerName: "Experiment Name",
        },
        {
            field: "user_name",
            headerName: "Run By",
        },
    ];
};
