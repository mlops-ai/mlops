import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from 'ag-grid-community';
import {toast} from "react-toastify";
import {TreeSelect} from "primereact/treeselect";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Models (props) {

    console.log("ITERACJE")

    const [nodes, setNodes] = useState(null);
    const [cols, setCols] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [selectedDateFilter, setSelectedDateFilter] = useState('allTime');
    let dateFilter = 'allTime';
    const [expandedKeys, setExpandedKeys] = useState({});

    // Stan zawierający dane aktualnego projektu (np. edytowanego, usuwanego itd.)
    const [currentIterationData, setCurrentIterationData] = useState({
        experiment_id: "",
        id: "",
        iteration_name: ""
    });

    // Stan zawierający edytowalne dane aktualnego projektu (edytowanego)
    const [currentIterationDataEditable, setCurrentIterationDataEditable] = useState({
        experiment_id: "",
        id: "",
        iteration_name: ""
    });

    const closeDeleteModalRef = useRef();
    const closeEditModalRef = useRef();

    let moment = require('moment');

    const gridRef = useRef();

    // console.log(props.selectedRows)

    const [rowData, numberOfExperiments] = useMemo(() => {
        let rowData
        let numberOfExperiments
        numberOfExperiments = props.gridData.length
        rowData = props.gridData.map(experiment => {
            return {
                ...experiment,
                iterations: experiment.iterations.map(iteration => {
                    return {
                        ...iteration,
                        experiment_name: experiment.name,
                        experiment_id: experiment.id
                    }
                })
            }
        })
        rowData = rowData.map(experiment => experiment.iterations)
        rowData = rowData.flat()
        return [rowData, numberOfExperiments];
    }, [props.gridData])

    // Definicje kolumn
    const [columnDefs, setColumnDefs] = useState([]);

    function dateToHumanize(date) {
        const difference = new moment.duration(Date.now() - Date.parse(date))
        return difference.humanize() + " ago";
    }

    function handleEditIteration(event) {
        event.preventDefault();

        let body = { iteration_name: currentIterationDataEditable.iteration_name.trim()};

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
    }

    function handleDeleteIterations(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'DELETE'
        };
        if (gridRef.current.api.getSelectedRows().length === 0) {
            return
        }
        gridRef.current.api.getSelectedRows().forEach(row => {
            fetch('http://localhost:8000/projects/' + props.projectID + '/experiments/' + row.experiment_id + '/iterations/' + row.id, requestOptions)
                .then((response) => {
                    if (response.ok) {
                        return response
                    }
                    return Promise.reject(response);
                }).then((response) => {
                toast.success('Iteration deleted successfully!', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                props.refresher(prevRefresh => {
                    return prevRefresh+1
                })

                closeDeleteModalRef.current.click();

            }).catch((response) => {
                response.body && response.json().then((json: any) => {
                    toast.error(json.detail, {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
            });
        })
    }


    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> {
        return {
            sortable: true,
            filter: 'agTextColumnFilter',
            resizable: true,
            lockPosition: 'left',
            unSortIcon: true,
            hide: false,
            filterParams: {
                buttons: ['reset']
            }
        }
    });

    var filterParams = {
        comparator: (filterDate, cellValue) => {
            let dateInCell = new Date(cellValue);
            dateInCell = new Date(dateInCell.getFullYear(), dateInCell.getMonth(), dateInCell.getDate(), 0, 0, 0, 0)
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
        inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
    };


    let columns_data_checked;
    useEffect(() => {

        document.getElementById('delete-button').disabled = true
        document.getElementById('rename-button').disabled = true

        // setNodes(data)

        let model_info
        let columns_data
        let columns_data_checked
        let columns_list
        if (numberOfExperiments > 1) {
            model_info = [
                {
                    field: 'iteration_name',
                    headerName: 'Run Name',
                    pinned: true,
                    filter: true,
                    cellRenderer: (props) => {
                        return <a href={"../model/" + props.data["id"]}>{props.data["iteration_name"]}</a>
                    }
                },
                {
                    field: 'created_at',
                    headerName: 'Created',
                    pinned: true,
                    sort: 'desc',
                    filter: 'agDateColumnFilter',
                    filterParams: filterParams,
                    cellRenderer: (props) => {
                        return <span title={moment(new Date(props.data["created_at"])).format("DD-MM-YYYY, HH:mm:ss")}>{dateToHumanize(props.data["created_at"])}</span>;
                    }
                },
                {
                    field: 'experiment_name',
                    headerName: "Experiment Name"
                },
                {
                    field: 'user_name',
                    headerName: "User"
                },
                {
                    field: 'model_name',
                    headerName: 'Model',
                    cellRenderer: (props) => {
                        return <a href={'#'}>{props.data["model_name"]}</a>
                    }
                }
            ]

            columns_data = [
                {
                    key: 'attributes',
                    label: 'Model info',
                    leaf: true,
                    children: [
                        {
                            key: 'experiment_name',
                            label: 'Experiment Name'
                        },
                        {
                            key: 'user_name',
                            label: 'User'
                        },
                        {
                            key: 'model_name',
                            label: 'Model'
                        }
                    ]
                }
            ]

            columns_data_checked = {
                attributes: {
                    checked: true,
                    partialChecked: false,
                },
                experiment_name: {
                    checked: true,
                    partialChecked: false,
                },
                model_name: {
                    checked: true,
                    partialChecked: false,
                },
                user_name: {
                    checked: true,
                    partialChecked: false,
                }
            }

            columns_list = ['experiment_name', 'model_name', 'user_name']
        } else {
            model_info = [
                {
                    field: 'iteration_name',
                    headerName: 'Run Name',
                    pinned: true,
                    filter: true,
                    cellRenderer: (props) => {
                        return <a href={"../model/" + props.data["id"]}>{props.data["iteration_name"]}</a>
                    }
                },
                {
                    field: 'created_at',
                    headerName: 'Created',
                    sort: 'desc',
                    pinned: true,
                    filter: 'agDateColumnFilter',
                    filterParams: filterParams,
                    cellRenderer: (props) => {
                        return <span title={moment(new Date(props.data["created_at"])).format("DD-MM-YYYY, HH:mm:ss")}>{dateToHumanize(props.data["created_at"])}</span>;
                    }
                },
                {
                    field: 'user_name',
                    headerName: "User",
                },
                {
                    field: 'model_name',
                    headerName: 'Model',
                    cellRenderer: (props) => {
                        return <a href={'#'}>{props.data["model_name"]}</a>
                    }
                }
            ]

            columns_data = [
                {
                    key: 'attributes',
                    label: 'Model info',
                    leaf: true,
                    children: [
                        {
                            key: 'user_name',
                            label: 'User'
                        },
                        {
                            key: 'model_name',
                            label: 'Model'
                        }
                    ]
                }
            ]

            columns_data_checked = {
                attributes: {
                    checked: true,
                    partialChecked: false,
                },
                model_name: {
                    checked: true,
                    partialChecked: false,
                },
                user_name: {
                    checked: true,
                    partialChecked: false,
                }
            }
            columns_list = ['model_name', 'user_name']
        }

        // setNodes(columns_data)

        // Parsowanie parametrów z danych
        let parameters_data = rowData.map(iteration => new Set(iteration.parameters !== null ? Object.getOwnPropertyNames(iteration.parameters) : ''))

        let parameters_names = new Set();

        parameters_data.forEach(data => data.forEach(parameter => {
            parameters_names.add(parameter)
        }))

        parameters_names = Array.from(parameters_names)

        let parameters = [];
        let column_parameters = [];

        if (parameters_names.length > 0) {
            Object.assign(columns_data_checked, {
                parameters: {
                    checked: true,
                    partialChecked: false,
                }
            });
            for (let i = 0; i < parameters_names.length; i++) {
                const key = 'parameters.' + parameters_names[i]
                parameters.push(
                    {
                        field: key,
                        headerName: parameters_names[i],
                        filter: 'agNumberColumnFilter',
                        cellRenderer: (props) => {
                            if (props.data["parameters"][parameters_names[i]]) {
                                return props.data["parameters"][parameters_names[i]]
                            }
                            return '-'
                        }
                    }
                )
                column_parameters.push(
                    {
                        key: key,
                        label: parameters_names[i]
                    }
                )
                Object.assign(columns_data_checked, {
                    [key]: {
                        checked: true,
                        partialChecked: false,
                    }
                })
                columns_list.push(key)
            }
            columns_data.push(
                {
                    key: 'parameters',
                    label: 'Parameters',
                    leaf: true,
                    children: column_parameters
                }
            )
        }

        // Parsowanie metryk z danych
        let metrics_data = rowData.map(iteration => new Set(iteration.metrics !== null ? Object.getOwnPropertyNames(iteration.metrics) : ''))

        // console.log(metrics_data)

        let metrics_names = new Set();

        metrics_data.forEach(data => data.forEach(metric => {
            metrics_names.add(metric)
        }))

        metrics_names = Array.from(metrics_names)

        let metrics = [];
        let column_metrics = [];

        if (metrics_names.length > 0) {
            Object.assign(columns_data_checked, {
                metrics: {
                    checked: true,
                    partialChecked: false,
                }
            });
            for (let i = 0; i < metrics_names.length; i++) {
                const key = 'metrics.' + metrics_names[i]
                metrics.push(
                    {
                        field: key,
                        headerName: metrics_names[i],
                        filter: 'agNumberColumnFilter',
                        cellRenderer: (props) => {
                            if (props.data["metrics"][metrics_names[i]]) {
                                return props.data["metrics"][metrics_names[i]]
                            }
                            return '-'
                        }
                    }
                )
                column_metrics.push(
                    {
                        key: key,
                        label: metrics_names[i]
                    }
                )
                Object.assign(columns_data_checked, {
                    [key]: {
                        checked: true,
                        partialChecked: false,
                    }
                })
                columns_list.push(key)
            }
            columns_data.push(
                {
                    key: 'metrics',
                    label: 'Metrics',
                    leaf: true,
                    children: column_metrics
                }
            )
        }

        //setNodes(columns_data)



        // console.log(columns_list)

        setCols(columns_list)
        setNodes(columns_data)
        setSelectedNodeKey(columns_data_checked)

        const expandNode = (node, _expandedKeys) => {
            if (node.children && node.children.length) {
                _expandedKeys[node.key] = true;

                for (let child of node.children) {
                    expandNode(child, _expandedKeys);
                }
            }
        };

        let _expandedKeys = {};
        for (let node of columns_data) {
            expandNode(node, _expandedKeys);
        }
        setExpandedKeys(_expandedKeys);

        // Definicje kolumn
        const columns = [
            {
                field: 'id',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                width: 30,
                filter: false,
                sortable: false,
                resizable: false,
                pinned: true
            },
            {
                headerName: 'Model info',
                children: model_info
            },
            {
                headerName: 'Parameters',
                children: parameters
            },
            {
                headerName: 'Metrics',
                children: metrics
            }
        ]

        setColumnDefs(columns)
    }, [props.gridData, rowData])

    const onRowSelected = useCallback((event) => {
        let deleteButton = document.getElementById('delete-button')
        let deleteModal = document.getElementById('delete-value')
        let renameButton = document.getElementById('rename-button')

        let selectedRows = event.api.getSelectedRows()
        let selectedRowsNum = selectedRows.length

        if (selectedRowsNum > 0) {
            deleteButton.disabled = false
            if (selectedRowsNum === 1) {
                renameButton.disabled = false
                setCurrentIterationData({
                    experiment_id: selectedRows[0].experiment_id,
                    id: selectedRows.id,
                    iteration_name: selectedRows[0].iteration_name
                })
                setCurrentIterationDataEditable({
                    experiment_id: selectedRows[0].experiment_id,
                    id: selectedRows.id,
                    iteration_name: selectedRows[0].iteration_name
                })
            } else {
                renameButton.disabled = true
            }
        } else {
            deleteButton.disabled = true
            renameButton.disabled = true
        }
        deleteModal.innerHTML = selectedRowsNum
    }, []);

    const onSelectionChanged = useCallback((event) => {
        // console.log(event.api.getSelectedRows().length)
        // console.log(event.api.getSelectedRows())
    }, []);

    // console.log(rowData)

    function handleCurrentDataEditable(event) {
        setCurrentIterationDataEditable(prevCurrentIterationDataEditable => {
            return {
                ...prevCurrentIterationDataEditable,
                [event.target.name]: event.target.value
            }
        })
    }

    const clearFilters = useCallback(() => {
        gridRef.current.api.setFilterModel(null);
        document.getElementById('filter-text-box').value = '';
        gridRef.current.api.setQuickFilter(
            ''
        );
        dateFilter = "allTime";
        gridRef.current.api.onFilterChanged();
        setSelectedDateFilter(dateFilter)
    }, []);

    const updateColumnVisibility = useCallback((data) => {
        let columns_active = Object.getOwnPropertyNames(data);
        for (let col of cols) {
            // console.log(col)
            if (columns_active.includes(col)) {
                gridRef.current.columnApi.setColumnVisible(col, true)
            } else {
                gridRef.current.columnApi.setColumnVisible(col, false)
            }
        }

    });

    const externalFilterChanged = useCallback((newValue) => {
        dateFilter = newValue
        gridRef.current.api.onFilterChanged();
    }, []);

    const isExternalFilterPresent = useCallback(() => {
        return dateFilter !== 'allTime'
    }, []);

    const doesExternalFilterPass = useCallback(
        (node) => {
            if (node.data) {
                switch (dateFilter) {
                    case 'lastHour':
                        return moment(node.data.created_at).isAfter(moment().subtract(1, 'hours'));
                    case 'last3Hours':
                        return moment(node.data.created_at).isAfter(moment().subtract(3, 'hours'));
                    case 'last6Hours':
                        return moment(node.data.created_at).isAfter(moment().subtract(6, 'hours'));
                    case 'last12Hours':
                        return moment(node.data.created_at).isAfter(moment().subtract(12, 'hours'));
                    case 'last24Hours':
                        return moment(node.data.created_at).isAfter(moment().subtract(24, 'hours'));
                    case 'last7Days':
                        return moment(node.data.created_at).isAfter(moment().subtract(7, 'days'));
                    case 'last14Days':
                        return moment(node.data.created_at).isAfter(moment().subtract(14, 'days'));
                    case 'last30Days':
                        return moment(node.data.created_at).isAfter(moment().subtract(30, 'days'));
                    case 'last90Days':
                        return moment(node.data.created_at).isAfter(moment().subtract(90, 'days'));
                    case 'last180Days':
                        return moment(node.data.created_at).isAfter(moment().subtract(180, 'days'));
                    case 'lastYear':
                        return moment(node.data.created_at).isAfter(moment().subtract(1, 'years'));
                    default:
                        return true;
                }
            }
            return true;
        },
        [dateFilter]
    );

    const grid = useMemo(() => {
        console.log("TEST")
        dateFilter = 'allTime';
        return <div className="ag-theme-alpine w-100">

            <AgGridReact
                // Referencja do AG-GRID'a
                ref={gridRef}

                // Dane iteracji
                rowData={rowData}

                // Domyślne ustawienia dla wszystkich kolumn
                defaultColDef={defaultColDef}

                // Definicja kolumn
                columnDefs={columnDefs}

                // Animowane wiersze przy sortowaniu
                // animateRows={true}

                // Zaznaczanie iteracji (wierszy)
                rowSelection='multiple' // Options - allows click selection of rows
                suppressRowClickSelection={true}
                suppressDragLeaveHidesColumns={true}

                // Stronicowanie
                pagination={true}
                paginationPageSize={20}
                rowHeight={25}

                // Ustawienia layoutu
                domLayout={'autoHeight'}

                // Eventy
                //onCellClicked={cellClickedListener}
                onRowSelected={onRowSelected}
                onSelectionChanged={onSelectionChanged}
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
            />

        </div>
    }, [columnDefs]);

    const clearSort = useCallback(() => {
        gridRef.current.columnApi.applyColumnState({
            defaultState: { sort: null },
        });
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    let date_filters = [
        {
            key: 'allTime',
            label: 'All time'
        },
        {
            key: 'lastHour',
            label: 'Last hour'
        },
        {
            key: 'last3Hours',
            label: 'Last 3 hour'
        },
        {
            key: 'last6Hours',
            label: 'Last 6 hour'
        },
        {
            key: 'last12Hours',
            label: 'Last 12 hour'
        },
        {
            key: 'last24Hours',
            label: 'Last 24 hour'
        },
        {
            key: 'last7Days',
            label: 'Last 7 days'
        },
        {
            key: 'last14Days',
            label: 'Last 14 days'
        },
        {
            key: 'last30Days',
            label: 'Last 30 days'
        },
        {
            key: 'last90Days',
            label: 'Last 90 days'
        },
        {
            key: 'last180Days',
            label: 'Last 180 days'
        },
        {
            key: 'lastYear',
            label: 'Last year'
        }
    ]

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv({
            skipColumnGroupHeaders: true,
            processCellCallback: ({column, value}) => {
                if (column.getId() === 'created_at') {
                    return moment(new Date(value)).format("DD-MM-YYYY, HH:mm:ss")
                }
                return value
            }
        });
    }, []);

    return (
        <div>
            <div className="d-flex align-items-center flex-wrap">
                <div className="single-select mb-3">
                    <TreeSelect className="tree-select shadow-none single-select"
                                value={selectedDateFilter}
                                onChange={(e) => {
                                    externalFilterChanged(e.value);
                                    setSelectedDateFilter(e.value);
                                }}
                                options={date_filters}>
                    </TreeSelect>
                </div>
                <input type="text" className="search mb-3" id="filter-text-box" placeholder="Filter rows by text data columns ..." onChange={onFilterTextBoxChanged}/>
                <div className="checkbox-select mb-3">
                    <TreeSelect className="tree-select shadow-none checkbox-select"
                        value={selectedNodeKey}
                        onChange={(e) => {
                            // console.log(e.value)
                            setSelectedNodeKey(e.value);
                            updateColumnVisibility(e.value);
                        }}
                        onToggle={(e) => setExpandedKeys(e.value)}
                        expandedKeys={expandedKeys}
                        options={nodes}
                        placeholder="Columns"
                        selectionMode="checkbox"
                        display="comma"
                        metaKeySelection={false}>
                    </TreeSelect>
                </div>
            </div>

            <hr className="mt-0" />

            <div className="d-flex align-items-center flex-wrap">
                <button id="delete-button" className="btn btn-danger experiment-button mb-3" data-bs-toggle="modal"
                        data-bs-target="#delete-iterations" disabled={true}>Delete</button>
                <button id="rename-button" className="btn btn-primary experiment-button mb-3" data-bs-toggle="modal"
                        data-bs-target="#edit-iteration" disabled={true}>Rename</button>
                <button id="compare-button" className="btn btn-success experiment-button mb-3" disabled={true}>Compare</button>
                <button id="clear-filters" onClick={clearFilters} className="btn btn-secondary experiment-button mb-3">Clear Filters</button>
                <button id="clear-sort" onClick={clearSort} className="btn btn-secondary experiment-button mb-3">Clear Sort</button>
                <button id="export-csv" onClick={onBtnExport} className="btn btn-primary experiment-button mb-3">Export to CSV</button>
            </div>

            {grid}

            <div className="modal fade" id="edit-iteration" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={null}>
                            <div className="modal-header">
                                <h5 className="modal-title">Rename iteration</h5>
                                <button ref={closeEditModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="iteration-name" className="form-label">
                                        Iteration name
                                    </label>
                                    <input type="text" className="form-control shadow-none" id="iteration-name"
                                           name="iteration_name"
                                           placeholder="Iteration name ..."
                                           required={true} minLength="1"
                                           maxLength="40"
                                           onChange={handleCurrentDataEditable}
                                           value={currentIterationDataEditable.iteration_name}
                                    />
                                    <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                        Required (max. 40 characters)
                                    </small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {currentIterationDataEditable.iteration_name !== currentIterationData.iteration_name ?
                                    <button className="btn btn-primary float-end">Rename</button>

                                    :

                                    <button className="btn btn-primary float-end" disabled={true}>Rename</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="delete-iterations" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Iterations</h5>
                            <button ref={closeDeleteModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-danger" style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        warning
                                    </span>
                            <span>The following number of iterations will be deleted permamently: <span id="delete-value" className="fw-semibold">0</span>. Are you sure you want to continue?</span>
                        </div>
                        <div className="modal-footer">
                            <form onSubmit={handleDeleteIterations}>
                                <button className="btn btn-danger float-end">Delete iterations</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Models;