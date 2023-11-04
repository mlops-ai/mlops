import { ColDef } from "ag-grid-community";

export const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    lockPosition: "left",
    unSortIcon: true,
    hide: false,
    filterParams: {
        buttons: ["reset"],
    },
} as ColDef;
