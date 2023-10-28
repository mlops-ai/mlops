import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { useRef, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { useGrid } from "@/hooks/use-grid-hook";

const IterationsGrid = () => {

    console.log("iterations grid")

    const gridRef = useRef(null);

    const grid = useGrid();

    const { theme } = useTheme();

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div
            className={
                theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
            }
        >
            <AgGridReact
                ref={gridRef}
                rowData={grid.rowData}
                rowSelection="multiple"
                columnDefs={grid.columnDefs}
                defaultColDef={grid.defaultColDef}
                pagination={true}
                paginationPageSize={20}
                rowHeight={25}
                domLayout={"autoHeight"}
            />
        </div>
    );
};

export default IterationsGrid;
