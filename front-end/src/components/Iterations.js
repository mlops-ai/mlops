import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from 'ag-grid-community';
import {toast} from "react-toastify";
import {TreeSelect} from "primereact/treeselect";
import {columns_data_multiple, columns_data_checked_multiple, columns_list_multiple} from "./iterations/columns_multiple";
import {columns_data_single, columns_data_checked_single, columns_list_single} from "./iterations/columns_single";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

/**
 * Iterations component for displaying grid containing information about runs and models in single or multiple experiments on experiments page.
 */
function Iterations (props) {

    console.log("[FOR DEBUGGING PURPOSES]: ITERATIONS GRID !")

    /**
     * Import library for date manipulation.
     */
    let moment = require('moment');

    /**
     * React ref hooks for close modal buttons.
     */
    const closeDeleteModalRef = useRef();
    const closeEditModalRef = useRef();

    /**
     * React ref hook for grid api.
     */
    const gridRef = useRef();

    /**
     * States used for storing tree-select columns data.
     */
    const [nodes, setNodes] = useState(null);
    const [cols, setCols] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);

    /**
     * State used for storing tree-select date filter data.
     */
    const [selectedDateFilter, setSelectedDateFilter] = useState('allTime');
    let dateFilter = 'allTime';

    /**
     * State used for storing tree-select data.
     */
    const [expandedKeys, setExpandedKeys] = useState({});

    /**
     * State used for storing ag-grid column definition data.
     * */
    const [columnDefs, setColumnDefs] = useState([]);

    /**
     * State used for storing current iteration data (edited, deleted ...).
     */
    const [currentIterationData, setCurrentIterationData] = useState({
        experiment_id: "",
        id: "",
        iteration_name: ""
    });

    /**
     * State used for storing current iteration editable data (edited).
     */
    const [currentIterationDataEditable, setCurrentIterationDataEditable] = useState({
        experiment_id: "",
        id: "",
        iteration_name: ""
    });

    /**
     * Prepare data to displayable form.
     * @ rowData: array of iterations data
     * @ numberOfExperiments: number of experiments
     * UseMemo is used for optimization purposes.
     * */
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

    /**
     * Function for converting date to humanize form.
     * */
    function dateToHumanize(date) {
        const difference = new moment.duration(Date.now() - Date.parse(date))
        return difference.humanize() + " ago";
    }

    /**
     * Function handling editing iteration request.
     * */
    function handleEditIteration(event) {
        event.preventDefault();

        if (gridRef.current.api.getSelectedRows().length === 0) {
            return
        }

        let edit_spinner = document.getElementById('edit-iteration-spinner')
        let edit_button = document.getElementById('edit-iteration-action')

        edit_button.disabled = true
        edit_spinner.style.display = "inline"

        /**
         * Validate data.
         * */
        let name = currentIterationDataEditable.iteration_name.trim()

        if (name.length === 0) {
            toast.error("Iteration name cannot be empty!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            edit_spinner.style.display = "none"
            edit_button.disabled = false

            return
        }

        if (!(name.length > 0 && name.length <= 40)) {
            toast.error("Iteration name cannot be longer than 40 characters!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            edit_spinner.style.display = "none"
            edit_button.disabled = false

            return
        }

        let body = { iteration_name: name };

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        fetch('http://localhost:8000/projects/' + props.projectID + '/experiments/' + currentIterationData.experiment_id + '/iterations/' + currentIterationData.id + '?iteration_name=' + name, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

                edit_spinner.style.display = "none"
                edit_button.disabled = false

                props.setProjectData(prevProjectData => {
                    return {
                        ...prevProjectData,
                        experiments: prevProjectData.experiments.map((experiment) => {
                            if (experiment.id == currentIterationData.experiment_id) {
                                let foundIndex = experiment.iterations.findIndex(iteration => iteration.id == currentIterationData.id);
                                let copy_experiment = experiment
                                copy_experiment.iterations[foundIndex] = json
                                return copy_experiment
                            }
                            return experiment
                        })
                    }
                })

                toast.success('Iteration updated successfully!', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                closeEditModalRef.current.click();

            }).catch((response) => {
                edit_spinner.style.display = "none"
                edit_button.disabled = false
                response.json().then((json: any) => {
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
    }

    /**
     * Function handling deleting iterations request.
     * */
    function handleDeleteIterations(event) {
        event.preventDefault();

        if (gridRef.current.api.getSelectedRows().length === 0) {
            return
        }

        let delete_spinner = document.getElementById('delete-iterations-spinner')
        let delete_button = document.getElementById('delete-iterations-action')

        delete_button.disabled = true
        delete_spinner.style.display = "inline"

        gridRef.current.api.getSelectedRows().map((iteration) => {
            return {
                experiment_id: iteration.experiment_id,
                iteration_id: iteration.id
            }
        })

        let body = gridRef.current.api.getSelectedRows().map((iteration) => {
            return {
                experiment_id: iteration.experiment_id,
                iteration_id: iteration.id
            }
        })

        body = body.reduce((group, iteration) => {
            let category = iteration.experiment_id
            group[category] = group[category] ?? []
            group[category].push(iteration.iteration_id)
            return group
        }, {})

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        fetch('http://localhost:8000/projects/' + props.projectID + '/experiments/delete_iterations', requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response
                }
                return Promise.reject(response);
            }).then((response) => {

            delete_spinner.style.display = "none"
            delete_button.disabled = false

            props.setProjectData(prevProjectData => {
                return {
                    ...prevProjectData,
                    experiments: prevProjectData.experiments.map((experiment) => {
                        return {
                            ...experiment,
                            iterations: experiment.iterations.filter(iteration => (body.hasOwnProperty(experiment.id) && !body[experiment.id].includes(iteration.id)) || !body.hasOwnProperty(experiment.id))
                        }
                    })
                }
            })

            toast.success('Iteration/s deleted successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            closeDeleteModalRef.current.click();

        }).catch((response) => {
            delete_spinner.style.display = "none"
            delete_button.disabled = false
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
    }

    /**
     * Variable containing ag-grid default columns definitions.
     * UseMemo is used for optimization purposes.
     * */
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

    /**
     * Filter comparator for ag-grid date column.
     * */
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

    /**
     * Helper function for expanding tree-select nodes.
     * */
    const expandNode = (node, _expandedKeys) => {
        if (node.children && node.children.length) {
            _expandedKeys[node.key] = true;

            for (let child of node.children) {
                expandNode(child, _expandedKeys);
            }
        }
    };

    /**
     * React hook for executing code after component mounting (after rendering).
     * */
    useEffect(() => {

        /**
         * Disable delete and rename button.
         * */
        document.getElementById('delete-button').disabled = true
        document.getElementById('rename-button').disabled = true

        let iteration_info
        let model_info
        let columns_data
        let columns_data_checked
        let columns_list
        if (numberOfExperiments > 1) {
            iteration_info = [
                {
                    field: 'iteration_name',
                    headerName: 'Name',
                    pinned: true,
                    filter: true,
                    cellRenderer: (val) => {
                        return <a href={"/projects/" + props.projectID + "/experiments/" + val.data["experiment_id"] + "/iterations/" + val.data["id"]}>{val.data["iteration_name"]}</a>
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
                }
            ]

            model_info = [
                {
                    field: 'model_name',
                    headerName: 'Model',
                    cellRenderer: (props) => {
                        return <a href={'#'}>{props.data["model_name"]}</a>
                    }
                }
            ]

            columns_data = columns_data_multiple
            columns_data_checked = columns_data_checked_multiple
            columns_list = columns_list_multiple

        } else {
            iteration_info = [
                {
                    field: 'iteration_name',
                    headerName: 'Name',
                    pinned: true,
                    filter: true,
                    cellRenderer: (val) => {
                        return <a href={"/projects/" + props.projectID + "/experiments/" + val.data["experiment_id"] + "/iterations/" + val.data["id"]}>{val.data["iteration_name"]}</a>
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
                
            ]

            model_info = [
                {
                    field: 'model_name',
                    headerName: 'Model',
                    cellRenderer: (props) => {
                        return <a href={'#'}>{props.data["model_name"]}</a>
                    }
                }
            ]

            columns_data = columns_data_single
            columns_data_checked = columns_data_checked_single
            columns_list = columns_list_single
        }

        /**
         * Parse parameters data from iterations
         * */
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
                            if (props.data["parameters"] && props.data["parameters"][parameters_names[i]]) {
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

        /**
         * Parse metrics data from iterations
         * */
        let metrics_data = rowData.map(iteration => new Set(iteration.metrics !== null ? Object.getOwnPropertyNames(iteration.metrics) : ''))

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
                            if (props.data["metrics"] && props.data["metrics"][metrics_names[i]]) {
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

        /**
         * Set states data for tree-select columns filter.
         * */
        setCols(columns_list)
        setNodes(columns_data)
        setSelectedNodeKey(columns_data_checked)

        /**
         * Set states data for tree-select expanded nodes.
         * */
        let _expandedKeys = {};
        for (let node of columns_data) {
            expandNode(node, _expandedKeys);
        }
        setExpandedKeys(_expandedKeys);

        /**
         * AG-Grid columns definitions.
         * */
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
                headerName: 'Iteration info',
                children: iteration_info
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

        /**
         * Set AG-Grid columns definitions.
         * */
        setColumnDefs(columns)
    }, [props.gridData, rowData])

    /**
     * Handle row seletion/deselection.
     * */
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
                    id: selectedRows[0].id,
                    iteration_name: selectedRows[0].iteration_name
                })
                setCurrentIterationDataEditable({
                    experiment_id: selectedRows[0].experiment_id,
                    id: selectedRows[0].id,
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

    /**
     * Handle editable iteration data change.
     * */
    function handleCurrentDataEditable(event) {
        setCurrentIterationDataEditable(prevCurrentIterationDataEditable => {
            return {
                ...prevCurrentIterationDataEditable,
                [event.target.name]: event.target.value
            }
        })
    }

    /**
     * Clear filters.
     * */
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

    /**
     * Clear sorting.
     * */
    const clearSort = useCallback(() => {
        gridRef.current.columnApi.applyColumnState({
            defaultState: { sort: null },
        });
    }, []);

    /**
     * Update column visibility.
     * */
    const updateColumnVisibility = useCallback((data) => {
        let columns_active = Object.getOwnPropertyNames(data);
        for (let col of cols) {
            if (columns_active.includes(col)) {
                gridRef.current.columnApi.setColumnVisible(col, true)
            } else {
                gridRef.current.columnApi.setColumnVisible(col, false)
            }
        }
    });

    /**
     * Export grid data to .csv file
     * */
    const exportToCSV = useCallback(() => {
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

    /**
     * Refresh page.
     * */
    const refreshPage = useCallback(() => {
        window.location.reload(false);
    })

    /**
     * Handle text filter change.
     * */
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    /**
     * Date filters labels.
     * */
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

    /**
     * External time period filter.
     * */
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

    /**
     * AG-Grid component.
     * UseMemo is used for optimization purposes.
     * */
    const grid = useMemo(() => {
        console.log("[FOR DEBUGGING PURPOSES]: GRID !")
        dateFilter = 'allTime';
        return <div className="ag-theme-alpine w-100">
            <AgGridReact
                /**
                 * Reference for grid.
                 * */
                ref={gridRef}

                /**
                 * Iteration data.
                 * */
                rowData={rowData}

                /**
                 * Default columns definitions.
                 * */
                defaultColDef={defaultColDef}

                /**
                 * Columns definitions.
                 * */
                columnDefs={columnDefs}

                /**
                 * Animated rows.
                 * */
                // animateRows={true}

                /**
                 * Row selection settings.
                 * */
                rowSelection='multiple'
                suppressRowClickSelection={true}
                suppressDragLeaveHidesColumns={true}

                /**
                 * Pagination settings.
                 * */
                pagination={true}
                paginationPageSize={20}
                rowHeight={25}

                /**
                 * Layout settings.
                 * */
                domLayout={'autoHeight'}

                /**
                 * Event listeners.
                 * */
                onRowSelected={onRowSelected}
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
            />
        </div>
    }, [columnDefs]);

    /**
     * Component rendering.
     * */
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

            <div className="d-flex align-items-center flex-wrap button-container">
                <button id="delete-button" className="btn btn-danger iterations-button mb-3 d-flex align-items-center" title="Delete iterations" data-bs-toggle="modal"
                        data-bs-target="#delete-iterations" disabled={true}>
                    <span className="material-symbols-rounded">
                        delete
                    </span>
                    Delete
                </button>
                <button id="rename-button" className="btn btn-primary iterations-button mb-3 d-flex align-items-center" title="Rename iteration" data-bs-toggle="modal"
                        data-bs-target="#edit-iteration" disabled={true}>
                    <span className="material-symbols-rounded">
                        edit
                    </span>
                    Rename
                </button>
                <button id="compare-button" className="btn btn-success iterations-button mb-3 d-flex align-items-center" title="Compare iterations" disabled={true}>
                    <span className="material-symbols-rounded">
                        compare_arrows
                    </span>
                    Compare
                </button>
                <button id="clear-filters" onClick={clearFilters} className="btn btn-secondary iterations-button mb-3 d-flex align-items-center" title="Clear filters">
                    <span className="material-symbols-rounded">
                        filter_alt_off
                    </span>
                    Clear filters
                </button>
                <button id="clear-sort" onClick={clearSort} className="btn btn-secondary iterations-button mb-3 d-flex align-items-center" title="Clear sorting">
                    <span className="material-symbols-rounded">
                        filter_list_off
                    </span>
                    Clear sorting
                </button>
                <div className="ms-xxl-auto d-flex align-items-center">
                    <button id="export-csv" onClick={exportToCSV} className="btn btn-primary iterations-button mb-3 d-flex align-items-center" title="Export to .csv file">
                        <span className="material-symbols-rounded">
                            download
                        </span>
                        Export to CSV
                    </button>
                    <button id="refresh-page" onClick={refreshPage} className="btn btn-primary iterations-button mb-3 d-flex align-items-center" title="Refresh page">
                        <span className="material-symbols-rounded">
                            cached
                        </span>
                        Refresh
                    </button>
                </div>
            </div>

            {grid}

            <div className="modal fade" id="edit-iteration" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={handleEditIteration}>
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
                                {currentIterationDataEditable.iteration_name !== currentIterationData.iteration_name && currentIterationDataEditable.iteration_name !== "" ?
                                    <button id="edit-iteration-action" className="btn btn-primary float-end">
                                        <span className="d-flex align-items-center">
                                            <i id="edit-iteration-spinner" className="fa fa-spinner fa-spin me-1" style={{display: "none"}}></i>
                                            Rename
                                        </span>
                                    </button>

                                    :

                                    <button id="edit-iteration-action" className="btn btn-primary float-end" disabled={true}>
                                        <span className="d-flex align-items-center">
                                            <i id="edit-iteration-spinner" className="fa fa-spinner fa-spin me-1" style={{display: "none"}}></i>
                                            Rename
                                        </span>
                                    </button>

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
                                <button className="btn btn-danger float-end" id="delete-iterations-action">
                                    <span className="d-flex align-items-center">
                                        <i id="delete-iterations-spinner" className="fa fa-spinner fa-spin me-1" style={{display: "none"}}></i>
                                        Delete iterations
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Iterations;