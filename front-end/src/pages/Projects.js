import React, {useEffect, useRef, useState} from "react";

import Masonry from "react-masonry-css";

import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import BounceLoader from "react-spinners/BounceLoader";

import ProjectCard from "../components/projects/ProjectCard";
import {CSSProperties} from "react";
import LoadingData from "../components/LoadingData";

function Projects(props) {

    // Referencje do zamykania modali
    const closeModalRef = useRef();
    const closeDeleteModalRef = useRef();
    const closeArchiveModalRef = useRef();
    const closeRestoreModalRef = useRef();
    const closeEditModalRef = useRef();

    // Biblioteka do konwersji daty
    let moment = require('moment');

    // Stan do przechowywania danych dotyczących projektów (lista wszystkich projektów)
    const [allProjects, setAllProjects] = useState();

    // Stan do przechowywania aktualnej frazy wyszukiwania projektów
    const [searchData, setSearchData] = useState({
        searchActive: "",
        searchArchived: ""
    });

    // Stan do przechowywania danych formularza dodawania projektu
    const [formData, setFormData] = useState({
        projectTitle: "",
        projectDescription: ""
    });

    // Stan służący do odświeżania zawartości strony
    const [refresh, setRefresh] = useState(0);

    // Stan zawierający dane aktualnego projektu (np. edytowanego, usuwanego itd.)
    const [currentProjectData, setCurrentProjectData] = useState({
        _id: "",
        title: "",
        description: "",
        status: "",
        archived: ""
    });

    // Stan zawierający edytowalne dane aktualnego projektu (edytowanego)
    const [currentProjectDataEditable, setCurrentProjectDataEditable] = useState({
        _id: "",
        title: "",
        description: "",
        status: "",
        archived: ""
    });

    // Obsługa zmiennych do edycji projektu
    function handleCurrentDataEditable(event) {
        setCurrentProjectDataEditable(prevCurrentProjectDataEditable => {
            return {
                ...prevCurrentProjectDataEditable,
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

    // Obsługa danych z formularza dodawania projektu
    function handleFormData(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    // Dodawanie projektu
    function handleAddProject(event) {
        event.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: formData.projectTitle.trim(), description: formData.projectDescription.trim() })
        };

        fetch('http://localhost:8000/projects', requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {
                toast.success('Project created successfully!', {
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
                    projectTitle: "",
                    projectDescription: ""
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

    // Edycja projektu
    function handleEditProject(event) {
        event.preventDefault();
        let body;
        if (currentProjectDataEditable.title.trim() !== currentProjectData.title.trim()) {
            body = { title: currentProjectDataEditable.title.trim(), description: currentProjectDataEditable.description.trim(), status: currentProjectDataEditable.status };
        } else {
            body = { description: currentProjectDataEditable.description.trim(), status: currentProjectDataEditable.status };
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch('http://localhost:8000/projects/' + currentProjectDataEditable._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {
            toast.success('Project updated successfully!', {
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

    // Usuwanie projektu
    function handleDeleteProject(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'DELETE'
        };
        fetch('http://localhost:8000/projects/' + currentProjectData._id, requestOptions)
            .then((response) => {
                console.log(response.ok)
                if (response.ok) {
                    return response
                }
                return Promise.reject(response);
            }).then((response) => {
            toast.success('Project deleted successfully!', {
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

    // Archiwizacja projektu
    function handleArchiveProject(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ archived: true })
        };
        fetch('http://localhost:8000/projects/' + currentProjectData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {
            toast.success('Project archived successfully!', {
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
            closeArchiveModalRef.current.click();
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

    // Przywrócenie projektu
    function handleRestoreProject(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ archived: false })
        };
        fetch('http://localhost:8000/projects/' + currentProjectData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {
            toast.success('Project restored successfully!', {
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
            closeRestoreModalRef.current.click();
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

    // Breakpointy do grida
    const breakpointColumnsObj = {
        default: 4,
        1199: 3,
        767: 2,
        575: 1
    }

    // REST API do BACK-ENDU
    useEffect(() => {
        fetch('http://localhost:8000/projects')
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            })
            .then(data => setAllProjects({
                projects: data
            }
            ))
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
    }, [refresh]);

    // Zmienne pomocnicze
    let active_projects;
    let activeProjectsNumber;
    let active_projects_filtered;
    let activeProjectsFilteredNumber;

    let archived_projects;
    let archivedProjectsNumber;
    let archived_projects_filtered;
    let archivedProjectsFilteredNumber;

    if (allProjects) {
        // Aktywne projekty
        active_projects = allProjects.projects.filter((project) => !project.archived)

        activeProjectsNumber = active_projects.length

        active_projects_filtered = active_projects.filter((project) => project.title.toLowerCase().includes(searchData.searchActive.toLowerCase().trim()))

        activeProjectsFilteredNumber = active_projects_filtered.length

        if (activeProjectsFilteredNumber > 0) {
            active_projects_filtered = active_projects_filtered.map(project => {
                return <ProjectCard
                    key={project._id}
                    projectId={project._id}
                    projectName={project.title}
                    projectStatus={project.status}
                    projectDescription={project.description}
                    projectIsArchived={project.archived}
                    projectCreationDate={moment(new Date(project.created_at)).format("DD-MM-YYYY, HH:mm:ss")}
                    projectExperiments={project.experiments}
                    setCurrentProject={setCurrentProjectData}
                    setCurrentProjectEditable={setCurrentProjectDataEditable}
                />
            });
        }

        if (activeProjectsFilteredNumber < 4) {
            for (let i=1; i <= 4 - activeProjectsFilteredNumber; i++) {
                active_projects_filtered.push(<div key={i}></div>);
            }
        }

        // Zarchiwizowane projekty
        archived_projects = allProjects.projects.filter((project) => project.archived)

        archivedProjectsNumber = archived_projects.length

        archived_projects_filtered = archived_projects.filter((project) => project.title.toLowerCase().includes(searchData.searchArchived.toLowerCase().trim()))

        archivedProjectsFilteredNumber = archived_projects_filtered.length

        if (archivedProjectsFilteredNumber > 0) {
            archived_projects_filtered = archived_projects_filtered.map(project => {
                return <ProjectCard
                    key={project._id}
                    projectId={project._id}
                    projectName={project.title}
                    projectStatus={project.status}
                    projectDescription={project.description}
                    projectIsArchived={project.archived}
                    projectCreationDate={moment(new Date(project.created_at)).format("DD-MM-YYYY, HH:mm:ss")}
                    projectExperiments={project.experiments}
                    setCurrentProject={setCurrentProjectData}
                    setCurrentProjectEditable={setCurrentProjectDataEditable}
                />
            });
        }

        if (archivedProjectsFilteredNumber < 4) {
            for (let i=1; i <= 4 - archivedProjectsFilteredNumber; i++) {
                archived_projects_filtered.push(<div key={i}></div>);
            }
        }
    }

    if (allProjects) {
        return (
            <main id="content">

                <div className="page-path">
                    <h1>Projects</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Projects</li>
                        </ol>
                    </nav>
                </div>

                <section className="projects section content-data">

                    {/*
                        ZAKŁADKI - AKTYWNE PROJEKTY / ARCHIWUM
                    */}

                    <div>
                        <ul className="nav nav-tabs nav-tabs-bordered">

                            <li className="nav-item">
                                <button className="nav-link active" data-bs-toggle="tab"
                                        data-bs-target="#active-projects">
                                    Active projects
                                </button>
                            </li>

                            <li className="nav-item">
                                <button className="nav-link" data-bs-toggle="tab"
                                        data-bs-target="#archived-projects">
                                    Archive
                                </button>
                            </li>

                        </ul>
                    </div>

                    {/*
                        WYŚWIETLANIE PROJEKTÓW
                    */}

                    <div className="tab-content pt-2">
                        <div className="tab-pane fade show active" id="active-projects">

                            { activeProjectsNumber === 0 ?

                                <div className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                    <span className="material-symbols-rounded project-icon" style={{fontSize: 64 + "px"}}>
                                        dashboard
                                    </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No active projects</p>
                                        <p className="mb-3">There are no active projects in the database. Create new project for tracking experiments.</p>
                                        <button type="button" className="btn btn-primary" style={{width: "auto"}} name="add-project" data-bs-toggle="modal"
                                                data-bs-target="#add-project">
                                            Create Project
                                        </button>
                                    </div>
                                </div>

                                :

                                <div className="d-flex mt-2 mb-3 align-items-center">
                                    <button type="button" className="btn btn-primary d-flex add-button" style={{width: "auto"}} name="add-project" data-bs-toggle="modal"
                                            data-bs-target="#add-project">
                                         <span className="material-symbols-rounded">
                                            add
                                        </span>
                                        New project
                                    </button>
                                    <input className="search"
                                           type="text"
                                           name="searchActive"
                                           placeholder="Search in projects ..."
                                           title="Enter search keyword"
                                           size="40"
                                           onChange={handleSearch}
                                           value={searchData.searchActive}
                                    />
                                </div>

                            }

                            { activeProjectsNumber !== 0 && activeProjectsFilteredNumber === 0 &&
                                <div className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center width-resize" style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded project-icon" style={{fontSize: 64 + "px"}}>
                                            dashboard
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No active projects based on query</p>
                                        <p className="mb-3">All active projects are filtered out. Check the validity of the query.</p>
                                    </div>
                                </div>
                            }

                            { activeProjectsFilteredNumber > 0 &&
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column">
                                    {active_projects_filtered}
                                </Masonry>
                            }

                        </div>
                        <div className="tab-pane fade show" id="archived-projects">
                            { archivedProjectsNumber === 0 ?

                                <div className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                    <span className="material-symbols-rounded project-icon" style={{fontSize: 64 + "px"}}>
                                        dashboard
                                    </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No archived projects</p>
                                        <p className="mb-3">There are no archived projects in the database.</p>
                                    </div>
                                </div>

                                :

                                <div className="d-flex mt-2 mb-3 align-items-center">
                                    <input className="search"
                                           type="text"
                                           name="searchArchived"
                                           placeholder="Search in archived projects ..."
                                           title="Enter search keyword"
                                           size="40"
                                           onChange={handleSearch}
                                           value={searchData.searchArchived}
                                    />
                                </div>

                            }

                            { archivedProjectsNumber !== 0 && archivedProjectsFilteredNumber === 0 &&
                                <div className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded project-icon" style={{fontSize: 64 + "px"}}>
                                            dashboard
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No archived projects based on query</p>
                                        <p className="mb-3">All archived projects are filtered out. Check the validity of the query.</p>
                                    </div>
                                </div>
                            }

                            { archivedProjectsFilteredNumber > 0 &&

                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column">
                                    {archived_projects_filtered}
                                </Masonry>

                            }
                        </div>
                    </div>

                    {/*
                        MODAL - PANEL DODAWANIA PROJEKTU
                    */}

                    <div className="modal fade" id="add-project" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleAddProject}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Create Project</h5>
                                        <button ref={closeModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="project-name" className="form-label">
                                                Project name
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="project-name"
                                                   name="projectTitle"
                                                   placeholder="Project name ..."
                                                   required={true} minLength="1"
                                                   maxLength="40"
                                                   value={formData.projectTitle}
                                                   onChange={handleFormData}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="project-description" className="form-label">
                                                Project description
                                            </label>
                                            <textarea className="form-control shadow-none" id="project-description"
                                              name="projectDescription"
                                              rows="3" placeholder="Project description ..."
                                              style={{resize: "none"}} maxLength="150"
                                              value={formData.projectDescription}
                                              onChange={handleFormData}>
                                            </textarea>
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters)
                                            </small>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {formData.projectTitle !== "" ?

                                            <button className="btn btn-primary float-end">Add project</button>

                                            :

                                            <button className="btn btn-primary float-end" disabled={true}>Add project</button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/*
                        MODAL - MENU EDYCJI PROJEKTU
                    */}

                    <div className="modal fade" id="edit-project" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleEditProject}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit project</h5>
                                        <button ref={closeEditModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="project-name" className="form-label">
                                                Project name
                                            </label>
                                            <input type="text" className="form-control shadow-none" id="project-name"
                                                   name="title"
                                                   placeholder="Project name ..."
                                                   required={true} minLength="1"
                                                   maxLength="40"
                                                   onChange={handleCurrentDataEditable}
                                                   value={currentProjectDataEditable.title}
                                            />
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Required (max. 40 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="project-description" className="form-label">
                                                Project description
                                            </label>
                                            <textarea className="form-control shadow-none" id="project-description"
                                                      name="description"
                                                      rows="3" placeholder="Project description ..."
                                                      style={{resize: "none"}} maxLength="150"
                                                      onChange={handleCurrentDataEditable}
                                                      value={currentProjectDataEditable.description}>
                                            </textarea>
                                            <small className="form-text text-muted" style={{fontSize: 13 + "px"}}>
                                                Optional (max. 150 characters)
                                            </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="project-status" className="form-label">
                                                Project status
                                            </label>
                                            <select className="form-select shadow-none" aria-label="Default select example" id="project-status" name="status" onChange={handleCurrentDataEditable}
                                            value={currentProjectDataEditable.status}>
                                                <option value="not_started">Not Started</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Finished</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {currentProjectDataEditable.title !== currentProjectData.title || currentProjectDataEditable.description !== currentProjectData.description || currentProjectDataEditable.status !== currentProjectData.status ?
                                            <button className="btn btn-primary float-end">Update project</button>

                                            :

                                            <button className="btn btn-primary float-end" disabled={true}>Update project</button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/*
                        MODAL - USUWANIE PROJEKTU
                    */}

                    <div className="modal fade" id="delete-project" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete Project <span className="fst-italic fw-semibold">{currentProjectData.title}</span></h5>
                                    <button ref={closeDeleteModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-danger" style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        warning
                                    </span>
                                    <span>Deleting a project involves deleting all the experiments and&nbsp;models in it permanently. Are you sure you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleDeleteProject}>
                                        <button className="btn btn-danger float-end">Delete project</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*
                        MODAL - ARCHIWIZACJA PROJEKTU
                    */}

                    <div className="modal fade" id="archive-project" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Archive Project <span className="fst-italic fw-semibold">{currentProjectData.title}</span></h5>
                                    <button ref={closeArchiveModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-secondary" style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        archive
                                    </span>
                                    <span>Archiving a project will move it to the archive tab. You will not be able to edit or refer to it, but you can restore it at any time. Do you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleArchiveProject}>
                                        <button className="btn btn-secondary float-end">Archive project</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*
                        MODAL - PRZYWRÓCENIE PROJEKTU
                    */}

                    <div className="modal fade" id="restore-project" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Restore Project <span className="fst-italic fw-semibold">{currentProjectData.title}</span></h5>
                                    <button ref={closeRestoreModalRef} type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-secondary" style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        unarchive
                                    </span>
                                    <span>Restoring a project will bring it back to the active projects tab. Do you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleRestoreProject}>
                                        <button className="btn btn-secondary float-end">Restore project</button>
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
                    <h1>Projects</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Projects</li>
                        </ol>
                    </nav>
                </div>

                <section className="projects section content-data">

                    {/*
                        WCZYTYWANIE DANYCH - SPINNER LOADER
                    */}

                    <LoadingData
                        icon={"dashboard"}
                        dataSection={"projects"}
                    />

                </section>
            </main>
        );
    }
}

export default Projects;