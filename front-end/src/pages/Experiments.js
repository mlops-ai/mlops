import React, {useEffect, useMemo, useRef, useState} from "react";
import {useParams, useNavigate, useSearchParams} from "react-router-dom";
import ExperimentListItem from "../components/experiments/ExperimentListItem";
import Iterations from "../components/Iterations";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingData from "../components/LoadingData";
import custom_theme from "../js/customed.json";

/**
 * Experiments component for displaying list of experiments and iterations grid.
 */

function Experiments(props) {

    console.log("[FOR DEBUGGING PURPOSES]: EXPERIMENTS !")

    /**
     * React hook for search params.
     * */
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Import library for date manipulation.
     */
    let moment = require('moment');

    /**
     * React ref hooks for close modal buttons.
     */
    const closeModalRef = useRef();
    const closeDeleteModalRef = useRef();
    const closeEditModalRef = useRef();

    /**
     * Get :project_id param from url.
     * */
    const {project_id} = useParams();

    /**
     * State used for storing current project data.
     */
    const [projectData, setProjectData] = useState();

    /**
     * State used for storing information about experiments panel state (visible, hidden).
     */
    const [experimentList, setExperimentList] = useState(true);

    /**
     * Function for redirecting.
     * */
    let navigate = useNavigate();

    /**
     * State used for storing current experiments filter query.
     * */
    const [searchData, setSearchData] = useState({
        searchExperiments: ""
    });

    /**
     * State used for storing current experiment data (edited, deleted ...).
     */
    const [currentExperimentData, setCurrentExperimentData] = useState({
        id: "",
        name: "",
        description: ""
    });

    /**
     * State used for storing current experiment editable data (edited).
     */
    const [currentExperimentDataEditable, setCurrentExperimentDataEditable] = useState({
        id: "",
        name: "",
        description: ""
    });

    /**
     * Handle editable experiment data change.
     * */
    function handleCurrentDataEditable(event) {
        setCurrentExperimentDataEditable(prevCurrentExperimentDataEditable => {
            return {
                ...prevCurrentExperimentDataEditable,
                [event.target.name]: event.target.value
            }
        })
    }

    /**
     * Handle experiment filter query change.
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
     * State used for storing data from experiment add form.
     */
    const [formData, setFormData] = useState({
        experimentName: "",
        experimentDescription: ""
    });

    /**
     * Handle experiment add form data change.
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
     * React hook for executing code after component mounting (after rendering).
     * */
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
                let experiments = searchParams.get("experiments")

                let intersection
                if (experiments !== null) {
                    experiments = experiments.split(',')
                    intersection = ids.filter(id => experiments.includes(id));
                }

                let active_ids = []

                if (intersection && intersection.length > 0) {
                    data.experiments = data.experiments.map((experiment, index) => {
                        if (intersection.includes(experiment.id)) {
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
                    setSearchParams({experiments: intersection.join(',')}, {replace: true})
                } else {
                    data.experiments = data.experiments.map((experiment, index) => {
                        if (index === 0) {
                            active_ids.push(experiment.id)
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
                    if (active_ids.length > 0) {
                        setSearchParams({experiments: active_ids[0]}, {replace: true});
                    } else {
                        setSearchParams({experiments: 'none'}, {replace: true});
                    }
                }
                setProjectData(data)
            })
            .catch((response) => {
                navigate('/projects')
            });
    }, []);

    /**
     * Handle multiple experiment display on checkbox click action.
     * */
    function handleCheckbox(event) {
        if (active_experiments.length === 1) {
            if (active_experiments[0].id === event.target.name) {
                return
            }
        }

        let experiments_ids = []

        let experiments = projectData.experiments.map((experiment) => {
            if (experiment.id === event.target.name) {
                return {
                    ...experiment,
                    checked: !experiment.checked
                }
            }
            return experiment
        })

        experiments_ids = experiments.filter(experiment => experiment.checked).map(experiment => {
            return experiment.id
        })

        setSearchParams((prevParams) => {
            return new URLSearchParams({
                ...Object.fromEntries(prevParams.entries()),
                experiments: experiments_ids.join(',')
            });
        }, {replace: true});

        setProjectData(prevProjectData => {
            return {
                ...prevProjectData,
                experiments: experiments
            }
        })
    }

    /**
     * Handle single experiment display on label click action.
     * */
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

        setSearchParams((prevParams) => {
            return new URLSearchParams({
                ...Object.fromEntries(prevParams.entries()),
                experiments: event.target.getAttribute("experiment-id")
            });
        }, {replace: true});

        setProjectData(prevProjectData => {
            return {
                ...prevProjectData,
                experiments: experiments
            }
        })
    }

    /**
     * Handle hiding and showing experiments list panel.
     * */
    function handleHideExperiments(event) {
        setExperimentList((prevState) => {
            return !prevState
        })
    }

    /**
     * Function handling adding experiment request.
     * */
    function handleAddExperiment(event) {
        event.preventDefault()

        let add_spinner = document.getElementById('add-experiment-spinner')
        let add_button = document.getElementById('add-experiment-action')

        add_button.disabled = true
        add_spinner.style.display = "inline"

        /**
         * Validate data.
         * */
        let name = formData.experimentName.trim()
        let description = formData.experimentDescription.trim()

        if (name.length === 0) {
            toast.error("Experiment name cannot be empty!", {
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
            toast.error("Experiment name cannot be longer than 40 characters!", {
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
            toast.error("Experiment description cannot be longer than 150 characters!", {
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
            body: JSON.stringify({name: name, description: description})
        };

        fetch('http://localhost:8000/projects/' + projectData._id + '/experiments', requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setFormData({
                experimentName: "",
                experimentDescription: ""
            });

            if (experiments.length > 0) {
                setProjectData(prevProjectData => {
                    return {
                        ...prevProjectData,
                        experiments: [...prevProjectData.experiments, json]
                    }
                })
            } else {
                setSearchParams({experiments: json.id}, {replace: true});
                setProjectData(prevProjectData => {
                    let exp = json;
                    exp = {...exp, checked: true}
                    return {
                        ...prevProjectData,
                        experiments: [...prevProjectData.experiments, exp]
                    }
                })
            }


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
     * Function handling editing experiment request.
     * */
    function handleEditExperiment(event) {
        event.preventDefault();

        let edit_spinner = document.getElementById('edit-experiment-spinner')
        let edit_button = document.getElementById('edit-experiment-action')

        edit_button.disabled = true
        edit_spinner.style.display = "inline"

        /**
         * Validate data.
         * */
        let name = currentExperimentDataEditable.name.trim()
        let description = currentExperimentDataEditable.description.trim()

        if (name.length === 0) {
            toast.error("Experiment name cannot be empty!", {
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
            toast.error("Experiment name cannot be longer than 40 characters!", {
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
            toast.error("Experiment description cannot be longer than 150 characters!", {
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
        if (name !== currentExperimentData.name.trim()) {
            body = {name: name, description: description};
        } else {
            body = {description: description};
        }

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        };

        fetch('http://localhost:8000/projects/' + projectData._id + '/experiments/' + currentExperimentDataEditable.id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setProjectData(prevProjectData => {
                let experiments = prevProjectData.experiments
                let foundIndex = experiments.findIndex(experiment => experiment.id === currentExperimentDataEditable.id);
                experiments[foundIndex] = {...json, checked: experiments[foundIndex].checked}
                return {
                    ...prevProjectData,
                    experiments: experiments
                }
            })

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

            edit_spinner.style.display = "none"
            edit_button.disabled = false

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
     * Function handling deleting experiment request.
     * */
    function handleDeleteExperiment(event) {
        event.preventDefault();

        let delete_spinner = document.getElementById('delete-experiment-spinner')
        let delete_button = document.getElementById('delete-experiment-action')

        delete_button.disabled = true
        delete_spinner.style.display = "inline"

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

            delete_spinner.style.display = "none"
            delete_button.disabled = false

            let active_ids = active_experiments.map(experiment => experiment.id)

            if (active_ids.includes(currentExperimentData.id)) {
                if (experiments.length === 1) {
                    setSearchParams({experiments: 'none'}, {replace: true});
                    setProjectData(prevProjectData => {
                        let experiments = prevProjectData.experiments.filter((experiment) => experiment.id !== currentExperimentData.id)
                        return {
                            ...prevProjectData,
                            experiments: experiments
                        }
                    })
                }
                if (experiments.length > 1 && active_experiments.length === 1) {
                    let experiments = projectData.experiments.filter((experiment) => experiment.id !== currentExperimentData.id)
                    experiments[0] = {...experiments[0], checked: true}
                    setSearchParams({experiments: experiments[0].id}, {replace: true});
                    setProjectData(prevProjectData => {
                        return {
                            ...prevProjectData,
                            experiments: experiments
                        }
                    })
                }
                if (experiments.length > 1 && active_experiments.length > 1) {
                    let experiments = projectData.experiments.filter((experiment) => experiment.id !== currentExperimentData.id)
                    active_ids = active_ids.filter(id => id !== currentExperimentData.id)
                    setSearchParams({experiments: active_ids.join(',')}, {replace: true});
                    setProjectData(prevProjectData => {
                        return {
                            ...prevProjectData,
                            experiments: experiments
                        }
                    })
                }
            } else {
                let experiments = projectData.experiments.filter((experiment) => experiment.id !== currentExperimentData.id)
                setProjectData(prevProjectData => {
                    return {
                        ...prevProjectData,
                        experiments: experiments
                    }
                })
            }

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

    // /**
    //  * Variable containing number of iterations in experiments chart data.
    //  * UseMemo is used for optimization purposes.
    //  * */
    // const chart_data = useMemo(() => {
    //     let chart_data;
    //     let counts;
    //
    //     if (projectData) {
    //         counts = projectData.experiments.map((experiment) => {
    //             return {
    //                 experiment_name: experiment.name,
    //                 iterations: experiment.iterations.length
    //             }
    //         })
    //
    //         let experiments_names = counts.map((experiment) => experiment.experiment_name);
    //         let experiments_values = counts.map((experiment) => experiment.iterations);
    //
    //         let series = experiments_names.map((name, index) => {
    //             let data = Array(experiments_names.length).fill(0)
    //             data[index] = experiments_values[index]
    //             return {
    //                 name: name,
    //                 data: data,
    //                 type: 'bar',
    //                 stack: 'stack',
    //             }
    //         })
    //
    //         if (experiments_names.length > 0) {
    //             chart_data = {
    //                 toolbox: {
    //                     show: true,
    //                     feature: {
    //                         saveAsImage: {
    //                             type: 'png'
    //                         },
    //                     },
    //                 },
    //                 title: {
    //                     text: "Number of iterations in experiments",
    //                     left: 'center',
    //                 },
    //                 xAxis: {
    //                     type: "category",
    //                     data: experiments_names,
    //                 },
    //                 "yAxis": {
    //                     "type": "value"
    //                 },
    //                 tooltip: {},
    //                 legend: {
    //                     data: experiments_names,
    //                     orient: 'horizontal',
    //                     left: 'center',
    //                     top: 30,
    //                 },
    //                 series: series
    //             }
    //         } else {
    //             return null
    //         }
    //         return chart_data
    //     }
    //     return null
    // })

    /**
     * Variable containing all experiments.
     * UseMemo is used for optimization purposes.
     * */
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
    }, [projectData, searchData])

    /**
     * Variable containing all active experiments.
     * UseMemo is used for optimization purposes.
     * */
    const active_experiments = useMemo(() => {
        if (projectData) {
            return projectData.experiments.filter((experiment) => experiment.checked)
        }
        return
    }, [projectData]);

    /**
     * Variable containing iterations grid component.
     * UseMemo is used for optimization purposes.
     * */
    const iterations = useMemo(() => {
        return (
            <Iterations
                gridData={active_experiments}
                projectID={project_id}
                projectData={projectData}
                setProjectData={setProjectData}
            />
        );
    }, [active_experiments])

    /**
     * Component rendering.
     * */
    if (projectData) {
        return (
            <main id="content">

                <div className="page-path">
                    <h1 className="d-flex align-items-center">
                        <span className="fw-semibold">
                            {projectData.title}
                        </span>
                        <span className="project-info-id d-flex align-items-center" style={{fontWeight: "normal"}}>
                            @{project_id}
                            <span className="material-symbols-rounded" title="Copy project id" onClick={
                                () => {
                                    toast.success('Copied to clipboard!', {
                                        position: "bottom-center",
                                        autoClose: 1000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: false,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                    });
                                    navigator.clipboard.writeText(project_id)
                                }
                            }>
                                content_copy
                            </span>
                        </span>
                    </h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item active">{projectData.title}</li>
                        </ol>
                    </nav>
                </div>


                {/*
                    WYŚWIETLANIE EKSPERYMENTÓW I ITERACJI
                */}

                <section className="experiments section content-data">

                    <div className="row">

                        {/*
                            LISTA EKSPERYMENTÓW
                        */}

                        {experimentList ?

                            <div id="exp" className="col-xl-3 col-lg-3 col-md-12 mb-3">
                                <h5 className="d-flex align-items-center justify-content-between">
                                    <span className="fw-semibold">Experiments</span>
                                    <div className="d-flex align-items-center">
                                <span className="material-symbols-rounded icon-border" title="Add experiment"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add-experiment">
                                    add
                                </span>
                                        <span className="material-symbols-rounded icon-border" title="Hide experiments"
                                              onClick={handleHideExperiments}>
                                    chevron_left
                                </span>
                                    </div>
                                </h5>
                                {projectData.experiments.length === 0 ?
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No experiments</p>
                                        <p className="mb-3">There are no experiments in this project. Create new
                                            experiment for tracking runs.</p>
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
                                {projectData.experiments.length !== 0 && experiments.length === 0 &&

                                    <div className="d-flex flex-column align-items-center text-center">
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No experiments based
                                            on query</p>
                                        <p className="mb-3">All experiments are filtered out. Check the validity of the
                                            query.</p>
                                    </div>

                                }

                            </div>

                            :

                            <div className="col-xl-1 col-lg-1 m-0">
                                <span className="material-symbols-rounded icon-border ms-0" title="Show experiments"
                                      onClick={handleHideExperiments}>
                                    chevron_right
                                </span>
                            </div>
                        }

                        {/*
                            MODELE - ITERACJE
                        */}

                        <div
                            className={experimentList ? "col-xl-9 col-lg-9 col-md-12" : "col-xl-12 col-lg-12 col-md-12"}>
                            {projectData.experiments.length !== 0 && active_experiments && active_experiments.length === 1 &&
                                <>
                                    <h4 className="d-flex align-items-center">
                                                <span className="fw-semibold">
                                                    {active_experiments[0].name}
                                                </span>
                                        <span className="project-info-id d-flex align-items-center">
                                                        @{active_experiments[0].id}

                                            <span className="material-symbols-rounded" title="Copy experiment id"
                                                  onClick={
                                                      () => {
                                                          toast.success('Copied to clipboard!', {
                                                              position: "bottom-center",
                                                              autoClose: 1000,
                                                              hideProgressBar: true,
                                                              closeOnClick: true,
                                                              pauseOnHover: false,
                                                              draggable: true,
                                                              progress: undefined,
                                                              theme: "light",
                                                          });
                                                          navigator.clipboard.writeText(active_experiments[0].id)
                                                      }
                                                  }>
                                                        content_copy
                                                    </span>

                                                </span>
                                    </h4>
                                    <p><span className="fst-italic">{active_experiments[0].description}</span></p>
                                    <div className="row d-flex align-items-center" style={{fontSize: 14 + "px"}}>
                                        <div
                                            className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-3 d-flex align-items-center">
                                                    <span className="material-symbols-rounded pe-1"
                                                          style={{fontSize: 18 + "px"}}>
                                                        calendar_month
                                                    </span>
                                            Creation
                                            date: {moment(new Date(active_experiments[0].created_at)).format("DD-MM-YYYY, HH:mm:ss")}
                                        </div>
                                        <div
                                            className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-3 d-flex align-items-center">
                                                    <span className="material-symbols-rounded pe-1"
                                                          style={{fontSize: 18 + "px"}}>
                                                        update
                                                    </span>
                                            Last
                                            modification: {moment(new Date(active_experiments[0].updated_at)).format("DD-MM-YYYY, HH:mm:ss")}
                                        </div>
                                    </div>
                                </>
                            }

                            {projectData.experiments.length !== 0 && active_experiments && active_experiments.length > 1 &&
                                <>
                                    <h4><span
                                        className="fw-semibold">Displaying runs from {active_experiments.length} experiments</span>
                                    </h4>
                                    <p><span
                                        className="fst-italic">{active_experiments.map(experiment => experiment.name).join(', ')}</span>
                                    </p>
                                </>

                            }

                            {projectData.experiments.length !== 0 && active_experiments && active_experiments.length >= 1 &&
                                <>
                                    {iterations}
                                </>
                            }

                            {projectData.experiments.length === 0 &&
                                <div className="w-100 d-flex align-items-center justify-content-center text-center"
                                     style={{padding: 128 + "px"}}>
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded project-icon"
                                              style={{fontSize: 64 + "px"}}>
                                            science
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>Nothing to show.</p>
                                        <p className="mb-3">There are no experiments in this project. Create new
                                            experiment for tracking models.</p>
                                        <button type="button" className="btn btn-primary" style={{width: "auto"}}
                                                name="add-experiment" data-bs-toggle="modal"
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
                                        <button ref={closeModalRef} type="button" className="btn-close"
                                                data-bs-dismiss="modal"
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
                                            <button id="add-experiment-action" className="btn btn-primary float-end">
                                                <span className="d-flex align-items-center">
                                                    <i id="add-experiment-spinner"
                                                       className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Add experiment
                                                </span>
                                            </button>

                                            :

                                            <button id="add-experiment-action" className="btn btn-primary float-end"
                                                    disabled={true}>
                                                <span className="d-flex align-items-center">
                                                    <i id="add-experiment-spinner"
                                                       className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Add experiment
                                                </span>
                                            </button>
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
                                        <button ref={closeEditModalRef} type="button" className="btn-close"
                                                data-bs-dismiss="modal"
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
                                        {(currentExperimentDataEditable.name !== currentExperimentData.name && currentExperimentDataEditable.name !== "") || currentExperimentDataEditable.description !== currentExperimentData.description ?

                                            <button id="edit-experiment-action" className="btn btn-primary float-end">
                                                <span className="d-flex align-items-center">
                                                    <i id="edit-experiment-spinner"
                                                       className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Update experiment
                                                </span>
                                            </button>

                                            :

                                            <button id="edit-experiment-action" className="btn btn-primary float-end"
                                                    disabled={true}>
                                                <span className="d-flex align-items-center">
                                                    <i id="edit-experiment-spinner"
                                                       className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Update experiment
                                                </span>
                                            </button>
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
                                    <h5 className="modal-title">Delete Experiment <span
                                        className="fst-italic fw-semibold">{currentExperimentData.name}</span></h5>
                                    <button ref={closeDeleteModalRef} type="button" className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-danger"
                                          style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        warning
                                    </span>
                                    <span>Deleting an experiment involves deleting all runs and models in it permanently. Are you sure you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleDeleteExperiment}>
                                        <button id="delete-experiment-action" className="btn btn-danger float-end">
                                            <span className="d-flex align-items-center">
                                                <i id="delete-experiment-spinner" className="fa fa-spinner fa-spin me-1"
                                                   style={{display: "none"}}></i>
                                                Delete experiment
                                            </span>
                                        </button>
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
                        // pauseOnFocusLoss
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
                            <li className="breadcrumb-item active">...</li>
                        </ol>
                    </nav>
                </div>

                <section className="experiments section content-data">

                    {/*
                        WCZYTYWANIE DANYCH - SPINNER LOADER
                    */}

                    <LoadingData
                        icon={"science"}
                        dataSection={"project, experiments & iterations"}
                    />

                </section>
            </main>
        );
    }
}

export default Experiments;