import { dateToHumanize } from "@/lib/utils";
import { IDateFilterParams } from "ag-grid-community";
import moment from "moment";

export const PredictionInfo = () => {
    /**
     * Filter comparator for date (prediction_date) column
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
            field: "predicted_value",
            headerName: "Predicted Value",
            pinned: true,
            filter: true,
        },
        {
            field: "prediction_date",
            headerName: "Prediction Date",
            sort: "desc",
            filter: "agDateColumnFilter",
            filterParams: filterDateComparator,
            cellRenderer: (val: any) => {
                return (
                    <span
                        title={moment(new Date(val.data["prediction_date"])).format(
                            "DD-MM-YYYY, HH:mm:ss"
                        )}
                    >
                        {dateToHumanize(val.data["prediction_date"])}
                    </span>
                );
            },
        },
        {
            field: "predicted_by",
            headerName: "Predicted By",
        },
    ];
};
