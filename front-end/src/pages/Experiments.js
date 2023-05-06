import React, {useEffect, useMemo, useRef, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import ExperimentListItem from "../components/experiments/ExperimentListItem";
import Models from "../components/Models";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingData from "../components/LoadingData";

function Experiments(props) {

    console.log("EKSPERYMENTY")

    // Referencje do zamykania modali
    const closeModalRef = useRef();
    const closeDeleteModalRef = useRef();
    const closeEditModalRef = useRef();

    // Biblioteka do konwersji daty
    let moment = require('moment');

    // Pobranie identyfikatora projektu z parametrów URL
    const {project_id} = useParams();

    // Stan do przechowywania danych projektu (w tym eksperymentów oraz modeli)
    const [projectData, setProjectData] = useState();

    // Stan służący do przechowywania informacji o stanie panelu eksperymentów (ukryty, widoczny)
    const [experimentList, setExperimentList] = useState(true);

    // Funkcja służąca do przekierowania w przypadku braku projektu o podanym identyfikatorze
    let navigate = useNavigate();

    // Stan do przechowywania aktualnej frazy wyszukiwania eksperymentów
    const [searchData, setSearchData] = useState({
        searchExperiments: ""
    });

    // Stan służący do odświeżania zawartości strony
    const [refresh, setRefresh] = useState(0);

    // Stan zawierający dane aktualnego eksperymentu (np. edytowanego, usuwanego itd.)
    const [currentExperimentData, setCurrentExperimentData] = useState({
        id: "",
        name: "",
        description: ""
    });

    // Stan zawierający edytowalne dane aktualnego eksperymentu (edytowanego)
    const [currentExperimentDataEditable, setCurrentExperimentDataEditable] = useState({
        id: "",
        name: "",
        description: ""
    });

    // Obsługa zmiennych do edycji eksperymentu
    function handleCurrentDataEditable(event) {
        setCurrentExperimentDataEditable(prevCurrentExperimentDataEditable => {
            return {
                ...prevCurrentExperimentDataEditable,
                [event.target.name]: event.target.value
            }
        })
    }

    // Obsługa zmiennych do wyszukiwania
    function handleSearch(event) {
        setSearchData(prevSearchData => {
            return {
                ...prevSearchData,
                [event.target.name]: event.target.value
            }
        })
    }

    // Stan do przechowywania danych formularza dodawania projektu
    const [formData, setFormData] = useState({
        experimentName: "",
        experimentDescription: ""
    });

    // Obsługa danych z formularza dodawania projektu
    function handleFormData(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    // REST API do BACK-ENDU
    useEffect(() => {

        fetch('http://localhost:8000/projects/' + project_id)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            })
            .then(data => {
                const ids = data.experiments.map(experiment => experiment.id);
                let active_ids
                let filtered_ids

                if (active_experiments) {
                    active_ids = active_experiments.map(experiment => experiment.id)
                    filtered_ids = ids.filter(value => active_ids.includes(value));
                }

                if (filtered_ids && filtered_ids.length !== 0) {
                    data.experiments = data.experiments.map((experiment, index) => {
                        if (filtered_ids.includes(experiment.id)) {
                            return {
                                ...experiment,
                                checked: true
                            }
                        }
                        return {
                            ...experiment,
                            checked: false
                        }
                    });
                } else {
                    data.experiments = data.experiments.map((experiment, index) => {
                        if (index === 0) {
                            return {
                                ...experiment,
                                checked: true
                            }
                        }
                        return {
                            ...experiment,
                            checked: false
                        }
                    });
                }

                setProjectData(data)
            })
            .catch((response) => {
                navigate('/projects')
            });
    }, [refresh]);


    // Obsługa listy eksperymentów - checkboxy (możliwość wyświetlenia kilku eksperymentów)
    function handleCheckbox(event) {
        if (active_experiments.length === 1) {
            if (active_experiments[0].id === event.target.name) {
                return
            }
        }

        let experiments = projectData.experiments.map((experiment) => {
            if (experiment.id === event.target.name) {
                return {
                    ...experiment,
                    checked: !experiment.checked
                }
            }
            return experiment
        })

        setProjectData(prevProjectData => {
            return {
                ...prevProjectData,
                experiments: experiments
            }
        })
    }

    // Obsługa wyświetlania pojedynczego eksperymentu po kliknięciu na jego nazwę
    function handleCheckboxSingle(event) {

        let experiments = projectData.experiments.map((experiment) => {
            if (experiment.id === event.target.getAttribute("experiment-id")) {
                return {
                    ...experiment,
                    checked: true
                }
            }
            return {
                ...experiment,
                checked: false
            }
        })

        setProjectData(prevProjectData => {
            return {
                ...prevProjectData,
                experiments: experiments
            }
        })
    }

    // Obsługa przycisku ukrywania/pokazywania listy eksperymentów
    function handleHideExperiments(event) {
        setExperimentList((prevState) => {
            return !prevState
        })
    }

    // Obsługa dodawania eksperymentów
    function handleAddExperiment(event) {
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formData.experimentName.trim(), description: formData.experimentDescription.trim()})
        };
        fetch('http://localhost:8000/projects/' + projectData._id + '/experiments', requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {
            toast.success('Experiment created successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            closeModalRef.current.click();

            setRefresh(prevRefresh => {
                return prevRefresh+1
            });

            setFormData({
                experimentName: "",
                experimentDescription: ""
            });
        }).catch((response) => {
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

    // Obsługa edycji eksperymentów
    function handleEditExperiment(event) {
        event.preventDefault();

        let body;
        if (currentExperimentDataEditable.name.trim() !== currentExperimentData.name.trim()) {
            body = { name: currentExperimentDataEditable.name.trim(), description: currentExperimentDataEditable.description.trim()};
        } else {
            body = { description: currentExperimentDataEditable.description.trim()};
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch('http://localhost:8000/projects/' + projectData._id + '/experiments/' + currentExperimentDataEditable.id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {
            toast.success('Experiment updated successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setRefresh(prevRefresh => {
                return prevRefresh+1
            })
            closeEditModalRef.current.click();
        }).catch((response) => {
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

    // Obsługa usuwania eksperymentów
    function handleDeleteExperiment(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'DELETE'
        };
        fetch('http://localhost:8000/projects/' + projectData._id + '/experiments/' + currentExperimentData.id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response
                }
                return Promise.reject(response);
            }).then((response) => {
            toast.success('Experiment deleted successfully!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setRefresh(prevRefresh => {
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
    }

    // let experiments;
    // let experiments_filtered;
    // let active_experiments;
    //
    // if (projectData) {
    //     experiments_filtered = projectData.experiments.filter((experiment) => experiment.name.toLowerCase().includes(searchData.searchExperiments.toLowerCase().trim()))
    //
    //     active_experiments = projectData.experiments.filter((experiment) => experiment.checked);
    //
    //     experiments = experiments_filtered.map((experiment) => {
    //         return <ExperimentListItem
    //             key={experiment.id}
    //             experimentID={experiment.id}
    //             experimentName={experiment.name}
    //             experimentDescription={experiment.description}
    //             experimentActive={experiment.checked}
    //             handleChange={handleCheckbox}
    //             handleChangeSingle={handleCheckboxSingle}
    //             setCurrentExperiment={setCurrentExperimentData}
    //             setCurrentExperimentEditable={setCurrentExperimentDataEditable}
    //         />
    //     });
    // }

    const experiments = useMemo(() => {
        let experiments;
        let experiments_filtered;

        if (projectData) {
            experiments_filtered = projectData.experiments.filter((experiment) => experiment.name.toLowerCase().includes(searchData.searchExperiments.toLowerCase().trim()))

            experiments = experiments_filtered.map((experiment) => {
                return <ExperimentListItem
                    key={experiment.id}
                    experimentID={experiment.id}
                    experimentName={experiment.name}
                    experimentDescription={experiment.description}
                    experimentActive={experiment.checked}
                    handleChange={handleCheckbox}
                    handleChangeSingle={handleCheckboxSingle}
                    setCurrentExperiment={setCurrentExperimentData}
                    setCurrentExperimentEditable={setCurrentExperimentDataEditable}
                />
            });
            return experiments
        }
        return null
    }, [projectData, searchData, refresh])

    const active_experiments = useMemo(() => {
        if (projectData) {
            return projectData.experiments.filter((experiment) => experiment.checked)
        }
        return
    }, [projectData, refresh]);

    const models = useMemo(() => {
        return (
            <Models
                gridData={active_experiments}
                projectID={project_id}
                refresher={setRefresh}
            />
        );
    }, [active_experiments, refresh])

    if (projectData) {
        // let rowData = active_experiments.map(experiment => {
        //     return {
        //         ...experiment,
        //         iterations: experiment.iterations.map(iteration => {
        //             return {
        //                 ...iteration,
        //                 experiment_name: experiment.name,
        //                 experiment_id: experiment.id
        //             }
        //         })
        //     }
        // })
        // rowData = rowData.map(experiment => experiment.iterations)
        // rowData = rowData.flat()
        // console.log(rowData)
        return (
            <main id="content">

                <div className="page-path">
                    <h1>Experiments & Models</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item">{ projectData.title }</li>
                            <li className="breadcrumb-item active">Experiments & Models</li>
                        </ol>
                    </nav>
                </div>

                {/*
                    WYŚWIETLANIE EKSPERYMENTÓW I MODELI
                */}

                <section className="experiments section content-data">
                    <div className="row">

                        {/*
                            LISTA EKSPERYMENTÓW
                        */}

                        {experimentList ?

                            <div id="exp" className="col-xl-3 col-lg-3 col-md-12 mb-3">
                                <h5 className="d-flex align-items-center justify-content-between">
                                    Experiments
                                    <div className="d-flex align-items-center">
                                <span className="material-symbols-rounded icon-border" title="Add experiment" data-bs-toggle="modal"
                                      data-bs-target="#add-experiment">
                                    add
                                </span>
                                        <span className="material-symbols-rounded icon-border" title="Hide experiments" onClick={handleHideExperiments}>
                                    chevron_left
                                </span>
                                    </div>
                                </h5>
                                {projectData.experiments.length === 0 ?
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No experiments</p>
                                        <p className="mb-3">There are no experiments in this project. Create new experiment for tracking runs.</p>
                                    </div>

                                    :

                                    <>
                                        <input className="search w-100"
                                               type="text"
                                               name="searchExperiments"
                                               placeholder="Search in experiments ..."
                                               title="Enter search keyword"
                                               value={searchData.searchExperiments}
                                               onChange={handleSearch}
                                        />
                                        <div className="list-of-experiments">
                                            {experiments}
                                        </div>
                                    </>
                                }
                                { projectData.experiments.length !== 0 && experiments.length === 0 &&

                                    <div className="d-flex flex-column align-items-center text-center">
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No experiments based on query</p>
                                        <p className="mb-3">All experiments are filtered out. Check the validity of the query.</p>
                                    </div>

                                }

                            </div>

                            :

                            <div className="col-xl-1 col-lg-1 m-0">
                                <span className="material-symbols-rounded icon-border ms-0" title="Show experiments" onClick={handleHideExperiments}>
                                    chevron_right
                                </span>
                            </div>
                        }

                        {/*
                            MODELE - ITERACJE
                        */}

                        <div className={experimentList ? "col-xl-9 col-lg-9 col-md-12" : "col-xl-12 col-lg-12 col-md-12"}>
                            {projectData.experiments.length !== 0 && active_experiments && active_experiments.length === 1 &&
                                <>
                                    <h5><span className="fw-semibold">{active_experiments[0].name}</span></h5>
                                    <p><span className="fst-italic">{active_experiments[0].description}</span></p>
                                    <div className="d-flex align-items-center">
                                        <p style={{fontSize: 13 + "px"}} className="pe-3">Experiment ID: {active_experiments[0].id}</p>
                                        <p style={{fontSize: 13 + "px"}} className="pe-3">Creation Date: {moment(new Date(active_experiments[0].created_at)).format("DD-MM-YYYY, HH:mm:ss")}</p>
                                    </div>
                                </>
                            }

                            { projectData.experiments.length !== 0 && active_experiments && active_experiments.length > 1 &&
                                <>
                                    <h5><span className="fw-semibold">Displaying runs from {active_experiments.length} experiments</span></h5>
                                    <p><span className="fst-italic">{active_experiments.map(experiment => experiment.name).join(', ')}</span></p>
                                </>

                            }

                            { projectData.experiments.length !== 0 && active_experiments && active_experiments.length >= 1 &&
                                <>
                                    {models}
                                </>
                            }

                            { projectData.experiments.length === 0 &&
                                <div className="w-100 d-flex align-items-center justify-content-center text-center" style={{padding: 128 + "px"}}>
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded project-icon" style={{fontSize: 64 + "px"}}>
                                            science
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>Nothing to show.</p>
                                        <p className="mb-3">There are no experiments in this project. Create new experiment for tracking models.</p>
                                        <button type="button" className="btn btn-primary" style={{width: "auto"}} name="add-experiment" data-bs-toggle="modal"
                                                data-bs-target="#add-experiment">
                                            Create Experiment
                                        </button>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>


                    {/*
                        MODAL - PANEL DODAWANIA EKSPERYMENTU
                    */}

                    <div className="modal fade" id="add-experiment" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleAddExperiment}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Create Experiment</h5>
                                        <button ref={closeModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="experiment-name" className="form-label">
                                                Experiment name
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="experiment-name"
                                                   name="experimentName"
                                                   placeholder="Experiment name ..."
                                                   required={true} minLength="1"
                                                   maxLength="40"
                                                   value={formData.experimentName}
                                                   onChange={handleFormData}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="experiment-description" className="form-label">
                                                Experiment description
                                            </label>
                                            <textarea className="form-control shadow-none" id="experiment-description"
                                                      name="experimentDescription"
                                                      rows="3" placeholder="Experiment description ..."
                                                      minLength="1"
                                                      style={{resize: "none"}} maxLength="150"
                                                      value={formData.experimentDescription}
                                                      onChange={handleFormData}>
                                            </textarea>
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters)
                                            </small>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {formData.experimentName !== "" ?

                                            <button className="btn btn-primary float-end">Add experiment</button>

                                            :

                                            <button className="btn btn-primary float-end" disabled={true}>Add experiment</button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/*
                        MODAL - PANEL EDYCJI EKSPERYMENTU
                    */}

                    <div className="modal fade" id="edit-experiment" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleEditExperiment}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit experiment</h5>
                                        <button ref={closeEditModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="experiment-name" className="form-label">
                                                Experiment name
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="experiment-name"
                                                   name="name"
                                                   placeholder="Experiment name ..."
                                                   required={true} minLength="1"
                                                   maxLength="40"
                                                   onChange={handleCurrentDataEditable}
                                                   value={currentExperimentDataEditable.name}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="experiment-description" className="form-label">
                                                Experiment name
                                            </label>
                                            <textarea className="form-control shadow-none" id="experiment-description"
                                                      name="description"
                                                      rows="3" placeholder="Experiment description ..."
                                                      minLength="1"
                                                      style={{resize: "none"}} maxLength="150"
                                                      value={currentExperimentDataEditable.description}
                                                      onChange={handleCurrentDataEditable}>
                                            </textarea>
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters)
                                            </small>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {currentExperimentDataEditable.name !== currentExperimentData.name || currentExperimentDataEditable.description !== currentExperimentData.description ?
                                            <button className="btn btn-primary float-end">Update experiment</button>

                                            :

                                            <button className="btn btn-primary float-end" disabled={true}>Update experiment</button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/*
                        MODAL - USUWANIE EKSPERYMENTU
                    */}

                    <div className="modal fade" id="delete-experiment" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete Experiment <span className="fst-italic fw-semibold">{currentExperimentData.name}</span></h5>
                                    <button ref={closeDeleteModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-danger" style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        warning
                                    </span>
                                    <span>Deleting an experiment involves deleting all runs and models in it permanently. Are you sure you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleDeleteExperiment}>
                                        <button className="btn btn-danger float-end">Delete experiment</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*
                        TOAST - KONTENER DLA POWIADOMIEŃ
                    */}

                    <ToastContainer
                        position="bottom-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover={false}
                        theme="light"
                    />

                </section>
            </main>
        );
    } else {
        return (
            <main id="content">

                <div className="page-path">
                    <h1>Experiments & Models</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Projects</li>
                            <li className="breadcrumb-item">...</li>
                            <li className="breadcrumb-item active">Experiments & Models</li>
                        </ol>
                    </nav>
                </div>

                <section className="experiments section content-data">

                    {/*
                        WCZYTYWANIE DANYCH - SPINNER LOADER
                    */}

                    <LoadingData
                        icon={"science"}
                        dataSection={"experiments"}
                    />

                </section>
            </main>
        );
    }
}

export default Experiments;