import React, {useEffect, useRef, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import ExperimentListItem from "../components/experiments/ExperimentListItem";
import Models from "../components/Models";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Experiments(props) {

    var moment = require('moment');

    const closeModalRef = useRef();
    const closeDeleteModalRef = useRef();
    const closeEditModalRef = useRef();

    const {project_id} = useParams();

    const [projectData, setProjectData] = useState();

    const [experimentList, setExperimentList] = useState(true);

    let navigate = useNavigate();

    const [searchData, setSearchData] = useState({
        searchExperiments: ""
    });


    const [refresh, setRefresh] = useState(0);

    const [currentExperimentData, setCurrentExperimentData] = useState({
        id: "",
        name: "",
        description: ""
    });

    const [currentExperimentDataEditable, setCurrentExperimentDataEditable] = useState({
        id: "",
        name: "",
        description: ""
    });

    function handleCurrentDataEditable(event) {
        setCurrentExperimentDataEditable(prevCurrentExperimentDataEditable => {
            return {
                ...prevCurrentExperimentDataEditable,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleSearch(event) {
        setSearchData(prevSearchData => {
            return {
                ...prevSearchData,
                [event.target.name]: event.target.value
            }
        })
    }

    const [formData, setFormData] = useState({
        experimentName: "",
        experimentDescription: ""
    });

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

                data.experiments = data.experiments.map((experiments, index) => {
                    if (index === 0) {
                        return {
                            id: experiments.id,
                            name: experiments.name,
                            description: experiments.description,
                            created_at: experiments.created_at,
                            checked: true
                        }
                    }
                    return {
                        id: experiments.id,
                        name: experiments.name,
                        description: experiments.description,
                        created_at: experiments.created_at,
                        checked: false
                    }
                });

                setProjectData(data)
            })
            .catch((response) => {
                navigate('/projects')
            });
    }, [refresh]);

    let experiments;
    let experiments_filtered;
    let active_experiments;

    if (projectData) {
        active_experiments = projectData.experiments.filter((experiment) => experiment.checked)

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

    }



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

    function handleHideExperiments(event) {
        setExperimentList((prevState) => {
            return !prevState
        })
    }

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

    function handleDeleteProject(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'DELETE'
        };
        fetch('http://localhost:8000/projects/' + projectData._id + '/experiments/' + currentExperimentData.id, requestOptions)
            .then((response) => {
                console.log(response.ok)
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

    return (
        <main id="content">

            <div className="page-path">
                <h1>Experiments & Models</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">Projects</li>
                        <li className="breadcrumb-item">{projectData && projectData.title}</li>
                        <li className="breadcrumb-item active">Experiments & Models</li>
                    </ol>
                </nav>
            </div>

            <section className="experiments section content-data">
                <div className="row">
                {experimentList ?


                        <div id="exp" className="col-3 me-2">
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
                            {projectData && projectData.experiments.length === 0 ?
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
                            {projectData && projectData.experiments.length !== 0 && experiments.length === 0 &&

                                <div className="d-flex flex-column align-items-center text-center">
                                    <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No experiments based on query</p>
                                    <p className="mb-3">All experiments are filtered out. Check the validity of the query.</p>
                                </div>

                            }

                        </div>

                    :

                        <div className="col-1 w-auto m-0">
                            <span className="material-symbols-rounded icon-border" title="Hide experiments" onClick={handleHideExperiments}>
                                chevron_right
                            </span>
                        </div>
                }
                    <div className="col w-auto ms-2">
                        {projectData && projectData.experiments.length !== 0 && active_experiments && active_experiments.length === 1 &&
                            <>
                                <h5>{active_experiments[0].name}</h5>
                                <p>Experiment ID: {active_experiments[0].id}</p>
                                <p>Creation Date: {moment(new Date(active_experiments[0].created_at)).format("DD-MM-YYYY, HH:mm:ss")}</p>
                                <p>{active_experiments[0].description}</p>
                                <Models />
                            </>
                        }

                        { projectData && projectData.experiments.length !== 0 && active_experiments && active_experiments.length > 1 &&
                            <>
                                <h5>Displaying runs from {active_experiments.length} experiments</h5>
                                <Models />
                            </>
                        }

                        { projectData && projectData.experiments.length === 0 &&
                            <div>Nothing to show.</div>
                        }

                    </div>
            </div>


                <div className="modal fade" id="add-experiment" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create Experiment</h5>
                                <button ref={closeModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddExperiment}>
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
                                    </div>
                                    {formData.experimentName !== "" ?

                                        <button className="btn btn-primary float-end">Add experiment</button>

                                        :

                                        <button className="btn btn-primary float-end" disabled={true}>Add experiment</button>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="edit-experiment" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit experiment</h5>
                                <button ref={closeEditModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditExperiment}>
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
                                    </div>
                                    {currentExperimentDataEditable.name !== currentExperimentData.name || currentExperimentDataEditable.description !== currentExperimentData.description ?
                                        <button className="btn btn-primary float-end">Update experiment</button>

                                        :

                                        <button className="btn btn-primary float-end" disabled={true}>Update experiment</button>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="delete-experiment" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Experiment "{currentExperimentData.name}"</h5>
                                <button ref={closeDeleteModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Deleting an experiment involves deleting all runs and models in it permanently. Are you sure you want to continue?</p>
                                <form onSubmit={handleDeleteProject}>
                                    <button className="btn btn-danger float-end">Delete experiment</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

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
};

export default Experiments;