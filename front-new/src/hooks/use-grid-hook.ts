import { ColDef } from "ag-grid-community";
import { create } from "zustand";

interface GridStore {
    rowData: any[];
    defaultColDef: ColDef;
    columnDefs: ColDef[];
    setAll: (rowData: any[], defaultColDef: ColDef, columnDefs: ColDef[]) => void;
    setRowData: (rowData: any[]) => void;
    setDefaultColDef: (defaultColDef: ColDef) => void;
    setColumnDefs: (columnDefs: ColDef[]) => void;
}

export const useGrid = create<GridStore>((set) => ({
    rowData: [],
    defaultColDef: {},
    columnDefs: [],
    setAll: (rowData, defaultColDef, columnDefs) =>
        set({ rowData, defaultColDef, columnDefs }),
    setRowData: (rowData) => set({ rowData }),
    setDefaultColDef: (defaultColDef) => set({ defaultColDef }),
    setColumnDefs: (columnDefs) => set({ columnDefs }),
}));