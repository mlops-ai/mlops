import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import runs from "../assets/data/runs.json";

import {Eye, Pin} from "react-bootstrap-icons";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from 'ag-grid-community';
import {toast} from "react-toastify";
import moment from "moment/moment";
import experiments from "../pages/Experiments";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Models (props) {

    console.log("ITERACJE")

    const [refresh, setRefresh] = useState(0);

    const closeDeleteModalRef = useRef();

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

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true,
        lockPosition: 'left',
        unSortIcon: true
    }));

    // Definicje kolumn
    const [columnDefs, setColumnDefs] = useState([]);

    function dateToHumanize(date) {
        const difference = new moment.duration(Date.now() - Date.parse(date))
        return difference.humanize() + " ago";
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

    useEffect(() => {

        document.getElementById('delete-button').disabled = true
        document.getElementById('rename-button').disabled = true

        let model_info
        if (numberOfExperiments > 1) {
            model_info = [
                {
                    field: 'iteration_name',
                    headerName: 'Run Name',
                    filter: true,
                    cellRenderer: (props) => {
                        return <a href={"../model/" + props.data["id"]}>{props.data["iteration_name"]}</a>
                    }
                },
                {
                    field: 'created_at',
                    headerName: 'Created',
                    filter: 'agDateColumnFilter',
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
        } else {
            model_info = [
                {
                    field: 'iteration_name',
                    headerName: 'Run Name',
                    filter: true,
                    cellRenderer: (props) => {
                        return <a href={"../model/" + props.data["id"]}>{props.data["iteration_name"]}</a>
                    }
                },
                {
                    field: 'created_at',
                    headerName: 'Created',
                    filter: 'agDateColumnFilter',
                    cellRenderer: (props) => {
                        return <span title={moment(new Date(props.data["created_at"])).format("DD-MM-YYYY, HH:mm:ss")}>{dateToHumanize(props.data["created_at"])}</span>;
                    }
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
        }

        // Parsowanie metryk z danych
        let metrics_data = rowData.map(iteration => new Set(Object.getOwnPropertyNames(iteration.metrics)))

        let metrics_names = new Set();

        metrics_data.forEach(data => data.forEach(metric => {
            metrics_names.add(metric)
        }))

        metrics_names = Array.from(metrics_names)

        let metrics = [];

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
        }

        // Parsowanie parametrów z danych
        let parameters_data = rowData.map(iteration => new Set(Object.getOwnPropertyNames(iteration.parameters)))

        let parameters_names = new Set();

        parameters_data.forEach(data => data.forEach(parameter => {
            parameters_names.add(parameter)
        }))

        parameters_names = Array.from(parameters_names)

        let parameters = [];

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
        }

        // Definicje kolumn
        const columns = [
            {
                field: 'id',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                headerValueGetter: (props) => {
                    return ''
                },
                // headerComponentParams: { menuIcon: 'fa-bars' },
                // cellRenderer: (props) => {
                //     return ''
                // },
                width: 50,
                filter: false,
                sortable: false,
                resizable: false,
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
        let renameButton = document.getElementById('rename-button')
        let selectedRows = event.api.getSelectedRows().length
        if (selectedRows > 0) {
            deleteButton.disabled = false
            if (selectedRows == 1) {
                renameButton.disabled = false
            } else {
                renameButton.disabled = true
            }
        } else {
            deleteButton.disabled = true
            renameButton.disabled = true
        }
    }, []);

    const onSelectionChanged = useCallback((event) => {
        console.log(event.api.getSelectedRows().length)
        console.log(event.api.getSelectedRows())
    }, []);

    console.log(rowData)

    return (
        <div>
            <div className="d-flex mb-3">
                <button id="delete-button" className="btn btn-danger" data-bs-toggle="modal"
                         data-bs-target="#delete-iterations" disabled={true}>Delete</button>
                <button id="rename-button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#delete-iterations" disabled={true}>Rename</button>
             </div>
            <div className="ag-theme-alpine">

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
                    animateRows={true}

                    // Zaznaczanie iteracji (wierszy)
                    rowSelection='multiple' // Options - allows click selection of rows
                    suppressRowClickSelection={true}

                    // Stronicowanie
                    pagination={true}
                    paginationPageSize={10}

                    // Ustawienia layoutu
                    domLayout={'autoHeight'}

                    // Eventy
                    //onCellClicked={cellClickedListener}
                    onRowSelected={onRowSelected}
                    onSelectionChanged={onSelectionChanged}
                />
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
                            <span>The following number of iterations will be deleted permamently: <span className="fw-semibold">0</span>. Are you sure you want to continue?</span>
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