import React, {useEffect, useMemo, useRef, useState} from "react";
import LoadingData from "../components/LoadingData";

import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Toast from "../components/Toast";
import DatasetCard from "../components/datasets/DatasetCard";
import moment from "moment/moment";
import Masonry from "react-masonry-css";

/**
 * Datasets page component for displaying datasets.
 * */
function Datasets(props) {
    console.log("[FOR DEBUGGING PURPOSES]: DATASETS !")

    /**
     * React ref hooks for close modal buttons.
     */
    const closeModalRef = useRef();
    const closeDeleteModalRef = useRef();
    const closeArchiveModalRef = useRef();
    const closeRestoreModalRef = useRef();
    const closeEditModalRef = useRef();

    /**
     * Import library for date manipulation.
     */
    let moment = require('moment');

    /**
     * State used for storing information about all datasets.
     * */
    const [datasetsData, setDatasetsData] = useState();

    /**
     * State used for storing current datasets (active and archived) filter query.
     * */
    const [searchData, setSearchData] = useState({
        searchActive: "",
        searchArchived: ""
    });

    /**
     * State used for storing data from dataset add form.
     */
    const [formData, setFormData] = useState({
        datasetName: "",
        datasetPath: "",
        datasetVersion: "",
        datasetTags: "",
        datasetDescription: ""
    });

    /**
     * State used for storing current dataset data (edited, deleted ...).
     */
    const [currentDatasetData, setCurrentDatasetData] = useState({
        _id: "",
        dataset_name: "",
        path_to_dataset: "",
        dataset_description: "",
        tags: "",
        version: "",
        archived: ""
    });

    /**
     * State used for storing current dataset editable data (edited).
     */
    const [currentDatasetDataEditable, setCurrentDatasetDataEditable] = useState({
        _id: "",
        dataset_name: "",
        path_to_dataset: "",
        dataset_description: "",
        tags: "",
        version: "",
        archived: ""
    });

    /**
     * Handle editable dataset data change.
     * */
    function handleCurrentDataEditable(event) {
        setCurrentDatasetDataEditable(prevCurrentDatasetDataEditable => {
            return {
                ...prevCurrentDatasetDataEditable,
                [event.target.name]: event.target.value
            }
        })
    }

    /**
     * Handle dataset (active and archived) filter query change.
     * */
    function handleSearch(event) {
        setSearchData(prevSearchData => {
            return {
                ...prevSearchData,
                [event.target.name]: event.target.value
            }
        })
    }

    /**
     * Handle dataset add form data change.
     * */
    function handleFormData(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    /**
     * Function handling adding dataset request.
     * */
    function handleAddDataset(event) {
        event.preventDefault()

        let add_spinner = document.getElementById('add-dataset-spinner')
        let add_button = document.getElementById('add-dataset-action')

        add_button.disabled = true
        add_spinner.style.display = "inline"

        /**
         * Validate data.
         * */
        let name = formData.datasetName.trim()
        let description = formData.datasetDescription.trim()
        let version = formData.datasetVersion.trim()
        let tags = formData.datasetTags.trim()
        let path = formData.datasetPath.trim()

        if (name.length === 0) {
            toast.error("Dataset name cannot be empty!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            add_spinner.style.display = "none"
            add_button.disabled = false

            return
        }

        if (!(name.length > 0 && name.length <= 40)) {
            toast.error("Dataset title cannot be longer than 40 characters!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            add_spinner.style.display = "none"
            add_button.disabled = false

            return
        }

        if (path.length === 0) {
            toast.error("Dataset path cannot be empty!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            add_spinner.style.display = "none"
            add_button.disabled = false

            return
        }

        if (!(description.length <= 150)) {
            toast.error("Dataset description cannot be longer than 150 characters!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            add_spinner.style.display = "none"
            add_button.disabled = false

            return
        }

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({dataset_name: name, path_to_dataset: path, dataset_description: description, version: version, tags: tags})
        };

        fetch('http://localhost:8000/datasets', requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setFormData({
                datasetName: "",
                datasetPath: "",
                datasetVersion: "",
                datasetTags: "",
                datasetDescription: ""
            });

            setDatasetsData(prevState => {
                return [...prevState, json]
            })

            toast.success('Dataset created successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            add_spinner.style.display = "none"
            add_button.disabled = false

            closeModalRef.current.click();

        }).catch((response) => {

            add_spinner.style.display = "none"
            add_button.disabled = false

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
     * Function handling editing dataset request.
     * */
    function handleEditDataset(event) {
        event.preventDefault();

        let edit_spinner = document.getElementById('edit-dataset-spinner')
        let edit_button = document.getElementById('edit-dataset-action')

        edit_button.disabled = true
        edit_spinner.style.display = "inline"

        /**
         * Validate data.
         * */
        let name = currentDatasetDataEditable.dataset_name.trim()
        let description = currentDatasetDataEditable.dataset_description.trim()
        let version = currentDatasetDataEditable.version.trim()
        let tags = currentDatasetDataEditable.tags.trim()
        let path = currentDatasetDataEditable.path_to_dataset.trim()

        if (name.length === 0) {
            toast.error("Dataset title cannot be empty!", {
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
            toast.error("Dataset title cannot be longer than 40 characters!", {
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

        if (path.length === 0) {
            toast.error("Dataset path cannot be empty!", {
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

        if (!(description.length <= 150)) {
            toast.error("Dataset description cannot be longer than 150 characters!", {
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

        let body;

        if (name !== currentDatasetData.dataset_name.trim()) {
            body = {dataset_name: name, path_to_dataset: path, dataset_description: description, version: version, dataset_tags: tags};
        } else {
            body = {path_to_dataset: path, dataset_description: description, version: version, tags: tags};
        }

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        };

        fetch('http://localhost:8000/datasets/' + currentDatasetDataEditable._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            edit_spinner.style.display = "none"
            edit_button.disabled = false

            setDatasetsData(prevState => {
                let datasets_copy = [...prevState];
                let foundIndex = datasets_copy.findIndex(dataset => dataset._id === currentDatasetDataEditable._id);
                datasets_copy[foundIndex] = json;
                return datasets_copy
            })

            toast.success('Dataset updated successfully!', {
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
     * Function handling deleting dataset request.
     * */
    function handleDeleteDataset(event) {
        event.preventDefault();

        let delete_spinner = document.getElementById('delete-dataset-spinner')
        let delete_button = document.getElementById('delete-dataset-action')

        delete_button.disabled = true
        delete_spinner.style.display = "inline"

        const requestOptions = {
            method: 'DELETE'
        };

        fetch('http://localhost:8000/datasets/' + currentDatasetData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response
                }
                return Promise.reject(response);
            }).then((response) => {

            delete_spinner.style.display = "none"
            delete_button.disabled = false

            setDatasetsData(prevState => {
                return prevState.filter(dataset => dataset._id !== currentDatasetData._id)
            })

            toast.success('Dataset deleted successfully!', {
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
     * Function handling archiving dataset request.
     * */
    function handleArchiveDataset(event) {
        event.preventDefault();

        let archive_spinner = document.getElementById('archive-dataset-spinner')
        let archive_button = document.getElementById('archive-dataset-action')

        archive_button.disabled = true
        archive_spinner.style.display = "inline"

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({archived: true})
        };

        fetch('http://localhost:8000/datasets/' + currentDatasetData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setDatasetsData(prevState => {
                let datasets_copy = [...prevState];
                let foundIndex = datasets_copy.findIndex(dataset => dataset._id === currentDatasetData._id);
                datasets_copy[foundIndex] = json;
                return datasets_copy
            })

            toast.success('Dataset archived successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            archive_spinner.style.display = "none"
            archive_button.disabled = false

            closeArchiveModalRef.current.click();
        }).catch((response) => {

            archive_spinner.style.display = "none"
            archive_button.disabled = false

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
     * Function handling restoring dataset request.
     * */
    function handleRestoreDataset(event) {
        event.preventDefault();

        let restore_spinner = document.getElementById('restore-dataset-spinner')
        let restore_button = document.getElementById('restore-dataset-action')

        restore_button.disabled = true
        restore_spinner.style.display = "inline"

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({archived: false})
        };

        fetch('http://localhost:8000/datasets/' + currentDatasetData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setDatasetsData(prevState => {
                let datasets_copy = [...prevState];
                let foundIndex = datasets_copy.findIndex(dataset => dataset._id === currentDatasetData._id);
                datasets_copy[foundIndex] = json;
                return datasets_copy
            })

            toast.success('Dataset restored successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            restore_spinner.style.display = "none"
            restore_button.disabled = false

            closeRestoreModalRef.current.click();
        }).catch((response) => {
            restore_spinner.style.display = "none"
            restore_button.disabled = false
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
     * React hook for executing code after component mounting (after rendering).
     * */
    useEffect(() => {
        fetch('http://localhost:8000/datasets/')
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            })
            .then(data => setDatasetsData(() => {
                    return data
            }))
            .catch((response) => {
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
    }, [])

    /**
     * Prepare data from REST API request to displayable form.
     * @ active_datasets: array of active datasets
     * @ activeDatasetsNumber: number of active datasets
     * @ archived_datasets: array of archived datasets ??
     * @ archivedDatasetsNumber: number of archived datasets ??
     * UseMemo is used for optimization purposes.
     * */
    const [active_datasets, activeDatasetsNumber, archived_datasets, archivedDatasetsNumber] = useMemo(() => {
        let active_datasets;
        let activeDatasetsNumber;
        let archived_datasets;
        let archivedDatasetsNumber;

        if (datasetsData) {
            active_datasets = [...datasetsData].filter((dataset) => !dataset.archived).sort((a, b) => {
                return new Date(b.updated_at) - new Date(a.updated_at)
            })
            activeDatasetsNumber = active_datasets.length
            archived_datasets = [...datasetsData].filter((dataset) => dataset.archived).sort((a, b) => {
                return new Date(b.updated_at) - new Date(a.updated_at)
            })
            archivedDatasetsNumber = archived_datasets.length

            return [active_datasets, activeDatasetsNumber, archived_datasets, archivedDatasetsNumber]
        }
        return [null, null, null, null]
    }, [datasetsData])

    /**
     * Prepare data from REST API request to displayable form.
     * @ active_datasets_filtered: array of active datasets filtered based on search query
     * @ activeDatasetsFilteredNumber: number of active datasets filtered based on search query
     * @ archived_datasets_filtered: array of archived datasets filtered based on search query
     * @ archivedDatasetsFilteredNumber: number of archived datasets filtered based on search query
     * UseMemo is used for optimization purposes.
     * */
    const [active_datasets_filtered, activeDatasetsFilteredNumber, archived_datasets_filtered, archivedDatasetsFilteredNumber] = useMemo(() => {
        let active_datasets_filtered;
        let activeDatasetsFilteredNumber;
        let archived_datasets_filtered;
        let archivedDatasetsFilteredNumber;

        if (datasetsData) {
            let query = searchData.searchActive.toLowerCase().trim();

            active_datasets_filtered = active_datasets.filter((dataset) =>
                dataset.dataset_name.toLowerCase().includes(query) || dataset.dataset_description.toLowerCase().includes(query) ||
                dataset.tags.toLowerCase().includes(query) || dataset.version.toLowerCase().includes(query) ||
                dataset.path_to_dataset.toLowerCase().includes(query)
            )

            activeDatasetsFilteredNumber = active_datasets_filtered.length

            if (activeDatasetsFilteredNumber > 0) {
                active_datasets_filtered = active_datasets_filtered.map(dataset => {
                    return <DatasetCard
                        key={dataset._id}
                        datasetId={dataset._id}
                        datasetName={dataset.dataset_name}
                        datasetTags={dataset.tags}
                        datasetPath={dataset.path_to_dataset}
                        datasetVersion={dataset.version}
                        datasetDescription={dataset.dataset_description}
                        datasetIsArchived={dataset.archived}
                        datasetCreationDate={moment(new Date(dataset.created_at)).format("DD-MM-YYYY, HH:mm:ss")}
                        datasetModifyDate={moment(new Date(dataset.updated_at)).format("DD-MM-YYYY, HH:mm:ss")}
                        setCurrentDataset={setCurrentDatasetData}
                        setCurrentDatasetEditable={setCurrentDatasetDataEditable}
                    />
                });
            }

            query = searchData.searchArchived.toLowerCase().trim();
            archived_datasets_filtered = archived_datasets.filter((dataset) =>
                dataset.dataset_name.toLowerCase().includes(query) || dataset.dataset_description.toLowerCase().includes(query) ||
                dataset.tags.toLowerCase().includes(query) || dataset.version.toLowerCase().includes(query) ||
                dataset.path_to_dataset.toLowerCase().includes(query)
            )

            archivedDatasetsFilteredNumber = archived_datasets_filtered.length

            if (archivedDatasetsFilteredNumber > 0) {
                archived_datasets_filtered = archived_datasets_filtered.map(dataset => {
                    return <DatasetCard
                        key={dataset._id}
                        datasetId={dataset._id}
                        datasetName={dataset.dataset_name}
                        datasetTags={dataset.tags}
                        datasetDescription={dataset.dataset_description}
                        datasetIsArchived={dataset.archived}
                        datasetCreationDate={moment(new Date(dataset.created_at)).format("DD-MM-YYYY, HH:mm:ss")}
                        datasetModifyDate={moment(new Date(dataset.updated_at)).format("DD-MM-YYYY, HH:mm:ss")}
                        setCurrentDataset={setCurrentDatasetData}
                        setCurrentDatasetEditable={setCurrentDatasetDataEditable}
                    />
                });
            }
            return [active_datasets_filtered, activeDatasetsFilteredNumber, archived_datasets_filtered, archivedDatasetsFilteredNumber];
        }
        return [null, null, null, null]
    }, [datasetsData, searchData])

    /**
     * Component rendering.
     * */
    if (datasetsData) {
        return (
            <main id="content">
                <div className="page-path">
                    <h1>Datasets</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Datasets</li>
                        </ol>
                    </nav>
                </div>

                <section className="datasets section content-data">

                    <div>
                        <ul className="nav nav-tabs nav-tabs-bordered">

                            <li className="nav-item">
                                <button className="nav-link active" data-bs-toggle="tab"
                                        data-bs-target="#active-datasets">
                                    Active datasets
                                </button>
                            </li>

                            <li className="nav-item">
                                <button className="nav-link" data-bs-toggle="tab"
                                        data-bs-target="#archived-datasets">
                                    Archive
                                </button>
                            </li>

                        </ul>
                    </div>

                    <div className="tab-content pt-2">

                        <div className="tab-pane fade show active" id="active-datasets">

                            {activeDatasetsNumber === 0 ?

                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-datasets">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                    <span className="material-symbols-rounded dataset-icon"
                                          style={{fontSize: 64 + "px"}}>
                                        dataset
                                    </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No active datasets</p>
                                        <p className="mb-3">There are no active datasets in the database. Create new
                                            datasets for training.</p>
                                        <button type="button" className="btn btn-primary" style={{width: "auto"}}
                                                name="add-dataset" data-bs-toggle="modal"
                                                data-bs-target="#add-dataset">
                                            Create Dataset
                                        </button>
                                    </div>
                                </div>

                                :

                                <div className="d-flex mt-2 mb-3 align-items-center">
                                    <button type="button" className="btn btn-primary d-flex add-button"
                                            style={{width: "auto"}} name="add-dataset" data-bs-toggle="modal"
                                            data-bs-target="#add-dataset">
                                         <span className="material-symbols-rounded">
                                            add
                                        </span>
                                        New dataset
                                    </button>
                                    <input className="search"
                                           type="text"
                                           name="searchActive"
                                           placeholder="Search in datasets ..."
                                           title="Enter search keyword"
                                           size="40"
                                           onChange={handleSearch}
                                           value={searchData.searchActive}
                                    />
                                </div>

                            }

                            {activeDatasetsNumber !== 0 && activeDatasetsFilteredNumber === 0 &&
                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-datasets">
                                    <div className="d-flex flex-column align-items-center width-resize"
                                         style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded dataset-icon"
                                              style={{fontSize: 64 + "px"}}>
                                            dataset
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No active datasets
                                            based on query</p>
                                        <p className="mb-3">All active datasets are filtered out. Check the validity of
                                            the query.</p>
                                    </div>
                                </div>
                            }

                            {activeDatasetsFilteredNumber > 0 &&
                                active_datasets_filtered
                            }
                        </div>

                        <div className="tab-pane fade show" id="archived-datasets">

                            {archivedDatasetsNumber === 0 ?

                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-datasets">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                    <span className="material-symbols-rounded dataset-icon"
                                          style={{fontSize: 64 + "px"}}>
                                        dataset
                                    </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No archived
                                            datasets</p>
                                        <p className="mb-3">There are no archived datasets in the database.</p>
                                    </div>
                                </div>

                                :

                                <div className="d-flex mt-2 mb-3 align-items-center">
                                    <input className="search"
                                           type="text"
                                           name="searchArchived"
                                           placeholder="Search in archived datasets ..."
                                           title="Enter search keyword"
                                           size="40"
                                           onChange={handleSearch}
                                           value={searchData.searchArchived}
                                    />
                                </div>

                            }

                            {archivedDatasetsNumber !== 0 && archivedDatasetsFilteredNumber === 0 &&
                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-datasets">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded dataset-icon"
                                              style={{fontSize: 64 + "px"}}>
                                            dataset
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No archived datasets
                                            based on query</p>
                                        <p className="mb-3">All archived datasets are filtered out. Check the validity
                                            of the query.</p>
                                    </div>
                                </div>
                            }

                            {archivedDatasetsFilteredNumber > 0 &&
                                archived_datasets_filtered
                            }

                        </div>

                    </div>


                    <div className="modal fade" id="add-dataset" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleAddDataset}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Create Dataset</h5>
                                        <button ref={closeModalRef} type="button" className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="dataset-name" className="form-label">
                                                Dataset name
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-name"
                                                   name="datasetName"
                                                   placeholder="e.g. Titanic Dataset ..."
                                                   required={true} minLength="1"
                                                   maxLength="40"
                                                   value={formData.datasetName}
                                                   onChange={handleFormData}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-path" className="form-label">
                                                Dataset path (link)
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-path"
                                                   name="datasetPath"
                                                   placeholder="e.g. https://www.kaggle.com/c/titanic/download/train.csv ..."
                                                   required={true} minLength="1"
                                                   value={formData.datasetPath}
                                                   onChange={handleFormData}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (web link or local disk path)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-version" className="form-label">
                                                Dataset version
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-version"
                                                   name="datasetVersion"
                                                   placeholder="e.g. 1.0.0 ..."
                                                   value={formData.datasetVersion}
                                                   onChange={handleFormData}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-tags" className="form-label">
                                                Dataset tags
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-tags"
                                                   name="datasetTags"
                                                   placeholder="eg. Classification, Numeric Data ..."
                                                   value={formData.datasetTags}
                                                   onChange={handleFormData}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters, comma separated)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-description" className="form-label">
                                                Dataset description
                                            </label>
                                            <textarea className="form-control shadow-none" id="dataset-description"
                                                      name="datasetDescription"
                                                      rows="3" placeholder="e.g. Titanic dataset is classification dataset with 12 columns ..."
                                                      style={{resize: "none"}} maxLength="150"
                                                      value={formData.datasetDescription}
                                                      onChange={handleFormData}>
                                            </textarea>
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters)
                                            </small>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {formData.datasetName !== "" && formData.datasetPath !== "" ?

                                            <button id="add-dataset-action" className="btn btn-primary float-end">
                                                <span className="d-flex align-items-center">
                                                    <i id="add-dataset-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Add dataset
                                                </span>
                                            </button>

                                            :

                                            <button id="add-dataset-action" className="btn btn-primary float-end"
                                                    disabled={true}>
                                                <span className="d-flex align-items-center">
                                                    <i id="add-dataset-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Add dataset
                                                </span>
                                            </button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="edit-dataset" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleEditDataset}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Dataset</h5>
                                        <button ref={closeEditModalRef} type="button" className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="dataset-name" className="form-label">
                                                Dataset name
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-name"
                                                   name="dataset_name"
                                                   placeholder="e.g. Titanic Dataset ..."
                                                   required={true} minLength="1"
                                                   maxLength="40"
                                                   value={currentDatasetDataEditable.dataset_name}
                                                   onChange={handleCurrentDataEditable}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-path" className="form-label">
                                                Dataset path (link)
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-path"
                                                   name="path_to_dataset"
                                                   placeholder="e.g. https://www.kaggle.com/c/titanic/download/train.csv ..."
                                                   required={true} minLength="1"
                                                   value={currentDatasetDataEditable.path_to_dataset}
                                                   onChange={handleCurrentDataEditable}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (web link or local disk path)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-version" className="form-label">
                                                Dataset version
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-version"
                                                   name="version"
                                                   placeholder="e.g. 1.0.0 ..."
                                                   value={currentDatasetDataEditable.version}
                                                   onChange={handleCurrentDataEditable}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-tags" className="form-label">
                                                Dataset tags
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="dataset-tags"
                                                   name="tags"
                                                   placeholder="eg. Classification, Numeric Data ..."
                                                   value={currentDatasetDataEditable.tags}
                                                   onChange={handleCurrentDataEditable}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters, comma separated)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataset-description" className="form-label">
                                                Dataset description
                                            </label>
                                            <textarea className="form-control shadow-none" id="dataset-description"
                                                      name="dataset_description"
                                                      rows="3" placeholder="e.g. Titanic dataset is classification dataset with 12 columns ..."
                                                      style={{resize: "none"}} maxLength="150"
                                                      value={currentDatasetDataEditable.dataset_description}
                                                      onChange={handleCurrentDataEditable}>
                                            </textarea>
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters)
                                            </small>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {currentDatasetDataEditable.dataset_name !== "" && currentDatasetDataEditable.path_to_dataset !== "" &&
                                        (currentDatasetDataEditable.dataset_name !== currentDatasetData.dataset_name ||
                                        currentDatasetDataEditable.path_to_dataset !== currentDatasetData.path_to_dataset ||
                                        currentDatasetDataEditable.dataset_description !== currentDatasetData.dataset_description ||
                                        currentDatasetDataEditable.tags !== currentDatasetData.tags ||
                                        currentDatasetDataEditable.version !== currentDatasetData.version) ?

                                            <button id="edit-dataset-action" className="btn btn-primary float-end">
                                                <span className="d-flex align-items-center">
                                                    <i id="edit-dataset-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Edit dataset
                                                </span>
                                            </button>

                                            :

                                            <button id="edit-dataset-action" className="btn btn-primary float-end"
                                                    disabled={true}>
                                                <span className="d-flex align-items-center">
                                                    <i id="edit-dataset-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Edit dataset
                                                </span>
                                            </button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="delete-dataset" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete Dataset <span
                                        className="fst-italic fw-semibold">{currentDatasetData.dataset_name}</span></h5>
                                    <button ref={closeDeleteModalRef} type="button" className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-danger"
                                          style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        warning
                                    </span>
                                    <span>Deleting a datasets involves deleting all dataset references to the iterations and is permanent. Are you sure you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleDeleteDataset}>
                                        <button id="delete-dataset-action" className="btn btn-danger float-end">
                                            <span className="d-flex align-items-center">
                                                <i id="delete-dataset-spinner" className="fa fa-spinner fa-spin me-1"
                                                   style={{display: "none"}}></i>
                                                Delete dataset
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="archive-dataset" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Archive Dataset <span
                                        className="fst-italic fw-semibold">{currentDatasetData.dataset_name}</span></h5>
                                    <button ref={closeArchiveModalRef} type="button" className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-secondary"
                                          style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        archive
                                    </span>
                                    <span>Archiving a dataset will move it to the archive tab. You will not be able to edit or refer to it, but you can restore it at any time. Do you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleArchiveDataset}>
                                        <button id="archive-dataset-action" className="btn btn-secondary float-end">
                                            <span className="d-flex align-items-center">
                                                <i id="archive-dataet-spinner" className="fa fa-spinner fa-spin me-1"
                                                   style={{display: "none"}}></i>
                                                Archive dataset
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="restore-dataset" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Restore Dataset <span
                                        className="fst-italic fw-semibold">{currentDatasetData.dataset_name}</span></h5>
                                    <button ref={closeRestoreModalRef} type="button" className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-secondary"
                                          style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        unarchive
                                    </span>
                                    <span>Restoring a dataset will bring it back to the active dataset tab. Do you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleRestoreDataset}>
                                        <button id="restore-dataset-action" className="btn btn-secondary float-end">
                                            <span className="d-flex align-items-center">
                                                <i id="restore-dataset-spinner" className="fa fa-spinner fa-spin me-1"
                                                   style={{display: "none"}}></i>
                                                Restore dataset
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Toast/>

                </section>
            </main>
        )
    } else {
        return (<main id="content">

                <div className="page-path">
                    <h1>Datasets</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Datasets</li>
                        </ol>
                    </nav>
                </div>

                <section className="datasets section content-data">

                    {/*
                        WCZYTYWANIE DANYCH - SPINNER LOADER
                    */}

                    <LoadingData
                        icon={"dataset"}
                        dataSection={"datasets"}
                    />

                </section>
            </main>
        )
    }
}

export default Datasets;