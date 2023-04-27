import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {Eye, Pin} from "react-bootstrap-icons";

function Models () {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    var filterParams = {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split('/');
            var cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        },
        minValidYear: 2000,
        maxValidYear: 2021,
        inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
    };

    const checkboxSel = function (params) {
        // we put checkbox on the name if we are not doing grouping
        return params.columnApi.getRowGroupColumns().length === 0;
    };
    const headerCheckboxSel = function (params) {
        // we put checkbox on the name if we are not doing grouping
        return params.columnApi.getRowGroupColumns().length === 0;
    };

    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'Run Id',
            checkboxSelection: checkboxSel,
            headerCheckboxSelection: headerCheckboxSel,
            headerValueGetter: (props) => {
                return ''
            },
            headerComponentParams: { menuIcon: 'fa-bars' },
            cellRenderer: (props) => {
                return <><Eye /> <Pin /></>
            },
            width: 100,
            filter: false,
            sortable: false
        },
        {
            headerName: 'Model info',
            children: [
                {
                    field: 'Run Name',
                    filter: true,
                    cellRenderer: (props) => {
                        return <a href={"../model/" + props.data["Run Id"]}>{props.data["Run Name"]}</a>
                    }
                },
                { field: 'Start Time', type: 'dateColumn', filter: 'agDateColumnFilter', filterParams: filterParams},
                { field: 'End Time', type: 'dateColumn', filter: 'agDateColumnFilter'},
                { field: 'User' },
                { field: 'Source' },
                { field: 'Version' },
            ]
        },
        {
            headerName: 'Parameters',
            children: [
                {
                    field: 'max_depth',
                    type: 'numberColumn',
                    filter: 'agNumberColumnFilter'
                },
                { field: 'max_features' },
                { field: 'n_estimators', type: 'numberColumn', filter: 'agNumberColumnFilter' },
            ]
        },
        {
            headerName: 'Metrics',
            children: [
                { field: 'accuracy', type: 'numberColumn', filter: 'agNumberColumnFilter' },
                { field: 'precision', type: 'numberColumn', filter: 'agNumberColumnFilter' },
                { field: 'recall', type: 'numberColumn', filter: 'agNumberColumnFilter' },
                { field: 'f1-score', type: 'numberColumn', filter: 'agNumberColumnFilter' },
            ]
        }
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        resizable: true,
    }));

    // Example of consuming Grid Event
    const cellClickedListener = useCallback( event => {
        console.log('cellClicked', event);
    }, []);

    // Example load data from server
    useEffect(() => {
        setRowData([]);
    }, []);

    // Example using Grid's API
    const buttonListener = useCallback( e => {
        gridRef.current.api.deselectAll();
    }, []);

    return (
        <div>

            {/* Example using Grid's API */}
            {/*<button onClick={buttonListener}>Push Me</button>*/}

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine">

                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API

                    rowData={rowData} // Row Data for Rows

                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties

                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows

                    pagination={true}
                    paginationPageSize={10}
                    domLayout={'autoHeight'}

                    onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                />
            </div>
        </div>
    );
};

export default Models;