import React, {useContext, useEffect, useMemo, useRef, useState} from "react";

import Masonry from "react-masonry-css";

import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import ProjectCard from "../components/projects/ProjectCard";
import LoadingData from "../components/LoadingData";
import Toast from "../components/Toast";
import {OptionsContext} from "../App";

/**
 * Project page component for displaying projects.
 * */

function Projects() {

    console.log("[FOR DEBUGGING PURPOSES]: PROJECTS !")

    /**
     * React ref hooks for close modal buttons.
     */
    const closeModalRef = useRef();
    const closeDeleteModalRef = useRef();
    const closeArchiveModalRef = useRef();
    const closeRestoreModalRef = useRef();
    const closeEditModalRef = useRef();

    /**
     * React content hook for refreshing options list after changing data in database.
     * */
    const [refresher, setRefresher] = useContext(OptionsContext);

    /**
     * Import library for date manipulation.
     */
    let moment = require('moment');

    /**
     * State used for storing information about all projects.
     * */
    const [allProjects, setAllProjects] = useState();

    /**
     * State used for storing current projects (active and archived) filter query.
     * */
    const [searchData, setSearchData] = useState({
        searchActive: "",
        searchArchived: ""
    });

    /**
     * State used for storing data from project add form.
     */
    const [formData, setFormData] = useState({
        projectTitle: "",
        projectDescription: ""
    });

    /**
     * State used for storing current project data (edited, deleted ...).
     */
    const [currentProjectData, setCurrentProjectData] = useState({
        _id: "",
        title: "",
        description: "",
        status: "",
        archived: ""
    });

    /**
     * State used for storing current project editable data (edited).
     */
    const [currentProjectDataEditable, setCurrentProjectDataEditable] = useState({
        _id: "",
        title: "",
        description: "",
        status: "",
        archived: ""
    });

    /**
     * Handle editable project data change.
     * */
    function handleCurrentDataEditable(event) {
        setCurrentProjectDataEditable(prevCurrentProjectDataEditable => {
            return {
                ...prevCurrentProjectDataEditable,
                [event.target.name]: event.target.value
            }
        })
    }

    /**
     * Handle project (active and archived) filter query change.
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
     * Handle project add form data change.
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
     * Function handling adding project request.
     * */
    function handleAddProject(event) {
        event.preventDefault()

        let add_spinner = document.getElementById('add-project-spinner')
        let add_button = document.getElementById('add-project-action')

        add_button.disabled = true
        add_spinner.style.display = "inline"

        /**
         * Validate data.
         * */
        let title = formData.projectTitle.trim()
        let description = formData.projectDescription.trim()

        if (title.length === 0) {
            toast.error("Project title cannot be empty!", {
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

        if (!(title.length > 0 && title.length <= 40)) {
            toast.error("Project title cannot be longer than 40 characters!", {
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
            toast.error("Project description cannot be longer than 150 characters!", {
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
            body: JSON.stringify({title: title, description: description})
        };

        fetch('http://localhost:8000/projects', requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setFormData({
                projectTitle: "",
                projectDescription: ""
            });

            setAllProjects(prevAllProjectData => {
                return [...prevAllProjectData, json]
            })

            setRefresher(prevRefresher => prevRefresher + 1)

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
     * Function handling editing project request.
     * */
    function handleEditProject(event) {
        event.preventDefault();

        let edit_spinner = document.getElementById('edit-project-spinner')
        let edit_button = document.getElementById('edit-project-action')

        edit_button.disabled = true
        edit_spinner.style.display = "inline"

        /**
         * Validate data.
         * */
        let title = currentProjectDataEditable.title.trim()
        let description = currentProjectDataEditable.description.trim()

        if (title.length === 0) {
            toast.error("Project title cannot be empty!", {
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

        if (!(title.length > 0 && title.length <= 40)) {
            toast.error("Project title cannot be longer than 40 characters!", {
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
            toast.error("Project description cannot be longer than 150 characters!", {
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

        if (title !== currentProjectData.title.trim()) {
            body = {title: title, description: description, status: currentProjectDataEditable.status};
        } else {
            body = {description: description, status: currentProjectDataEditable.status};
        }

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        };

        fetch('http://localhost:8000/projects/' + currentProjectDataEditable._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            edit_spinner.style.display = "none"
            edit_button.disabled = false

            setAllProjects(prevState => {
                let projects_copy = [...prevState];
                let foundIndex = projects_copy.findIndex(project => project._id === currentProjectDataEditable._id);
                projects_copy[foundIndex] = json;
                return projects_copy
            })

            setRefresher(prevRefresher => prevRefresher + 1)

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
     * Function handling deleting project request.
     * */
    function handleDeleteProject(event) {
        event.preventDefault();

        let delete_spinner = document.getElementById('delete-project-spinner')
        let delete_button = document.getElementById('delete-project-action')

        delete_button.disabled = true
        delete_spinner.style.display = "inline"

        const requestOptions = {
            method: 'DELETE'
        };

        fetch('http://localhost:8000/projects/' + currentProjectData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response
                }
                return Promise.reject(response);
            }).then(() => {

            delete_spinner.style.display = "none"
            delete_button.disabled = false

            setAllProjects(prevState => {
                return prevState.filter(project => project._id !== currentProjectData._id)
            })

            setRefresher(prevRefresher => prevRefresher + 1)

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
     * Function handling archiving project request.
     * */
    function handleArchiveProject(event) {
        event.preventDefault();

        let archive_spinner = document.getElementById('archive-project-spinner')
        let archive_button = document.getElementById('archive-project-action')

        archive_button.disabled = true
        archive_spinner.style.display = "inline"

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({archived: true})
        };

        fetch('http://localhost:8000/projects/' + currentProjectData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setAllProjects(prevState => {
                let projects_copy = [...prevState];
                let foundIndex = projects_copy.findIndex(project => project._id === currentProjectData._id);
                projects_copy[foundIndex] = json;
                return projects_copy
            })

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
     * Function handling restoring project request.
     * */
    function handleRestoreProject(event) {
        event.preventDefault();

        let restore_spinner = document.getElementById('restore-project-spinner')
        let restore_button = document.getElementById('restore-project-action')

        restore_button.disabled = true
        restore_spinner.style.display = "inline"

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({archived: false})
        };

        fetch('http://localhost:8000/projects/' + currentProjectData._id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            }).then((json) => {

            setAllProjects(prevState => {
                let projects_copy = [...prevState];
                let foundIndex = projects_copy.findIndex(project => project._id === currentProjectData._id);
                projects_copy[foundIndex] = json;
                return projects_copy
            })

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
     * Masonry Grid breakpoints definitions.
     * UseMemo is used for optimization purposes.
     * */
    const breakpointColumnsObj = useMemo(() => {
        return {
            default: 4,
            1199: 3,
            767: 2,
            575: 1
        }
    })

    /**
     * React hook for executing code after component mounting (after rendering).
     * */
    useEffect(() => {
        fetch('http://localhost:8000/projects/base')
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            })
            .then(data => setAllProjects(() => {
                data = data.sort((a, b) => {
                    // return new Date(a.updated_at) - new Date(b.updated_at)
                    return new Date(b.updated_at) - new Date(a.updated_at)
                })
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
    }, []);

    /**
     * Prepare data from REST API request to displayable form.
     * @ active_projects: array of active projects
     * @ activeProjectsNumber: number of active projects
     * @ archived_projects: array of archived projects
     * @ archivedProjectsNumber: number of archived projects
     * UseMemo is used for optimization purposes.
     * */
    const [active_projects, activeProjectsNumber, archived_projects, archivedProjectsNumber] = useMemo(() => {
        let active_projects;
        let activeProjectsNumber;
        let archived_projects;
        let archivedProjectsNumber;

        if (allProjects) {
            active_projects = [...allProjects].filter((project) => !project.archived).sort((a, b) => {
                return new Date(b.updated_at) - new Date(a.updated_at)
            })
            activeProjectsNumber = active_projects.length
            archived_projects = [...allProjects].filter((project) => project.archived).sort((a, b) => {
                return new Date(b.updated_at) - new Date(a.updated_at)
            })
            archivedProjectsNumber = archived_projects.length
            return [active_projects, activeProjectsNumber, archived_projects, archivedProjectsNumber]
        }
        return [null, null, null, null]
    }, [allProjects])

    /**
     * Prepare data from REST API request to displayable form.
     * @ active_projects_filtered: array of active projects filtered based on search query
     * @ activeProjectsFilteredNumber: number of active projects filtered based on search query
     * @ archived_projects_filtered: array of archived projects filtered based on search query
     * @ archivedProjectsFilteredNumber: number of archived projects filtered based on search query
     * UseMemo is used for optimization purposes.
     * */
    const [active_projects_filtered, activeProjectsFilteredNumber, archived_projects_filtered, archivedProjectsFilteredNumber] = useMemo(() => {
        let active_projects_filtered;
        let activeProjectsFilteredNumber;
        let archived_projects_filtered;
        let archivedProjectsFilteredNumber;

        if (allProjects) {
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
                        projectModifyDate={moment(new Date(project.updated_at)).format("DD-MM-YYYY, HH:mm:ss")}
                        projectExperiments={project.experiments}
                        setCurrentProject={setCurrentProjectData}
                        setCurrentProjectEditable={setCurrentProjectDataEditable}
                    />
                });
            }

            if (activeProjectsFilteredNumber < 4) {
                for (let i = 1; i <= 4 - activeProjectsFilteredNumber; i++) {
                    active_projects_filtered.push(<div key={i}></div>);
                }
            }

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
                        projectModifyDate={moment(new Date(project.updated_at)).format("DD-MM-YYYY, HH:mm:ss")}
                        projectExperiments={project.experiments}
                        setCurrentProject={setCurrentProjectData}
                        setCurrentProjectEditable={setCurrentProjectDataEditable}
                    />
                });
            }

            if (archivedProjectsFilteredNumber < 4) {
                for (let i = 1; i <= 4 - archivedProjectsFilteredNumber; i++) {
                    archived_projects_filtered.push(<div key={i}></div>);
                }
            }
            return [active_projects_filtered, activeProjectsFilteredNumber, archived_projects_filtered, archivedProjectsFilteredNumber]
        }
        return [null, null, null, null]
    }, [allProjects, searchData])

    /**
     * Component rendering.
     * */
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

                            {activeProjectsNumber === 0 ?

                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                    <span className="material-symbols-rounded project-icon"
                                          style={{fontSize: 64 + "px"}}>
                                        dashboard
                                    </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No active projects</p>
                                        <p className="mb-3">There are no active projects in the database. Create new
                                            project for tracking experiments.</p>
                                        <button type="button" className="btn btn-primary" style={{width: "auto"}}
                                                name="add-project" data-bs-toggle="modal"
                                                data-bs-target="#add-project">
                                            Create Project
                                        </button>
                                    </div>
                                </div>

                                :

                                <div className="d-flex mt-2 mb-3 align-items-center">
                                    <button type="button" className="btn btn-primary d-flex add-button"
                                            style={{width: "auto"}} name="add-project" data-bs-toggle="modal"
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

                            {activeProjectsNumber !== 0 && activeProjectsFilteredNumber === 0 &&
                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center width-resize"
                                         style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded project-icon"
                                              style={{fontSize: 64 + "px"}}>
                                            dashboard
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No active projects
                                            based on query</p>
                                        <p className="mb-3">All active projects are filtered out. Check the validity of
                                            the query.</p>
                                    </div>
                                </div>
                            }

                            {activeProjectsFilteredNumber > 0 &&
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column">
                                    {active_projects_filtered}
                                </Masonry>
                            }

                        </div>
                        <div className="tab-pane fade show" id="archived-projects">
                            {archivedProjectsNumber === 0 ?

                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                    <span className="material-symbols-rounded project-icon"
                                          style={{fontSize: 64 + "px"}}>
                                        dashboard
                                    </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No archived
                                            projects</p>
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

                            {archivedProjectsNumber !== 0 && archivedProjectsFilteredNumber === 0 &&
                                <div
                                    className="w-100 d-flex align-items-center justify-content-center text-center no-projects">
                                    <div className="d-flex flex-column align-items-center" style={{maxWidth: 50 + "%"}}>
                                        <span className="material-symbols-rounded project-icon"
                                              style={{fontSize: 64 + "px"}}>
                                            dashboard
                                        </span>
                                        <p className="fw-bold mb-0" style={{fontSize: 18 + "px"}}>No archived projects
                                            based on query</p>
                                        <p className="mb-3">All archived projects are filtered out. Check the validity
                                            of the query.</p>
                                    </div>
                                </div>
                            }

                            {archivedProjectsFilteredNumber > 0 &&

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
                                        <button ref={closeModalRef} type="button" className="btn-close"
                                                data-bs-dismiss="modal"
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

                                            <button id="add-project-action" className="btn btn-primary float-end">
                                                <span className="d-flex align-items-center">
                                                    <i id="add-project-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Add project
                                                </span>
                                            </button>

                                            :

                                            <button id="add-project-action" className="btn btn-primary float-end"
                                                    disabled={true}>
                                                <span className="d-flex align-items-center">
                                                    <i id="add-project-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Add project
                                                </span>
                                            </button>
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
                                        <button ref={closeEditModalRef} type="button" className="btn-close"
                                                data-bs-dismiss="modal"
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
                                            <select className="form-select shadow-none"
                                                    aria-label="Default select example" id="project-status"
                                                    name="status" onChange={handleCurrentDataEditable}
                                                    value={currentProjectDataEditable.status}>
                                                <option value="not_started">Not Started</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Finished</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {(currentProjectDataEditable.title !== currentProjectData.title && currentProjectDataEditable.title !== "") || currentProjectDataEditable.description !== currentProjectData.description || currentProjectDataEditable.status !== currentProjectData.status ?
                                            <button id="edit-project-action" className="btn btn-primary float-end">
                                                <span className="d-flex align-items-center">
                                                    <i id="edit-project-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Update project
                                                </span>
                                            </button>

                                            :

                                            <button id="edit-project-action" className="btn btn-primary float-end"
                                                    disabled={true}>
                                                <span className="d-flex align-items-center">
                                                    <i id="edit-project-spinner" className="fa fa-spinner fa-spin me-1"
                                                       style={{display: "none"}}></i>
                                                    Update project
                                                </span>
                                            </button>
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
                                    <h5 className="modal-title">Delete Project <span
                                        className="fst-italic fw-semibold">{currentProjectData.title}</span></h5>
                                    <button ref={closeDeleteModalRef} type="button" className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-danger"
                                          style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        warning
                                    </span>
                                    <span>Deleting a project involves deleting all the experiments and&nbsp;models in it permanently. Are you sure you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleDeleteProject}>
                                        <button id="delete-project-action" className="btn btn-danger float-end">
                                            <span className="d-flex align-items-center">
                                                <i id="delete-project-spinner" className="fa fa-spinner fa-spin me-1"
                                                   style={{display: "none"}}></i>
                                                Delete project
                                            </span>
                                        </button>
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
                                    <h5 className="modal-title">Archive Project <span
                                        className="fst-italic fw-semibold">{currentProjectData.title}</span></h5>
                                    <button ref={closeArchiveModalRef} type="button" className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-secondary"
                                          style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        archive
                                    </span>
                                    <span>Archiving a project will move it to the archive tab. You will not be able to edit or refer to it, but you can restore it at any time. Do you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleArchiveProject}>
                                        <button id="archive-project-action" className="btn btn-secondary float-end">
                                            <span className="d-flex align-items-center">
                                                <i id="archive-project-spinner" className="fa fa-spinner fa-spin me-1"
                                                   style={{display: "none"}}></i>
                                                Archive project
                                            </span>
                                        </button>
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
                                    <h5 className="modal-title">Restore Project <span
                                        className="fst-italic fw-semibold">{currentProjectData.title}</span></h5>
                                    <button ref={closeRestoreModalRef} type="button" className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex align-items-center justify-content-between">
                                    <span className="material-symbols-rounded text-secondary"
                                          style={{fontSize: 40 + "px", paddingRight: 8 + "px"}}>
                                        unarchive
                                    </span>
                                    <span>Restoring a project will bring it back to the active projects tab. Do you want to continue?</span>
                                </div>
                                <div className="modal-footer">
                                    <form onSubmit={handleRestoreProject}>
                                        <button id="restore-project-action" className="btn btn-secondary float-end">
                                            <span className="d-flex align-items-center">
                                                <i id="restore-project-spinner" className="fa fa-spinner fa-spin me-1"
                                                   style={{display: "none"}}></i>
                                                Restore project
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

                    <Toast/>

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