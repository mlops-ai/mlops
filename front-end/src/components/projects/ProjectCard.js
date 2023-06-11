import React from "react";

/**
 * Project card component.
 * */
function ProjectCard(props) {
    /**
     * Function for string captitalization.
     * */
    const capitalizeFirstLetter = str => {
        return (
            str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        );
    }

    /**
     * Variable defining the maximum number of experiments in the list.
     * */
    const displayMaxExperiments = 3;

    /**
     * Variable containing the number of experiments in project.
     * */
    let experimentsNumber = props.projectExperiments.length

    /**
     * Generating experiments list.
     * */
    let experiments;

    if (experimentsNumber === 0) {
        experiments = "This project has no experiments.";
    } else {

        let experimentsList = props.projectExperiments.slice(0, displayMaxExperiments).map(experiment => {
            return (
                <li key={experiment.id}>{experiment}</li>
            )
        });

        if (experimentsNumber <= displayMaxExperiments) {
            experiments = <ul key={"experiments"}>{experimentsList.slice(0, displayMaxExperiments)}</ul>
        } else {
            experiments = <ul key={"experiments"}>{experimentsList.slice(0, displayMaxExperiments)}<span
                style={{fontSize: 13 + "px"}}>and {experimentsNumber - displayMaxExperiments} more ...</span></ul>
        }

    }

    /**
     * Component rendering.
     * */
    return (
            <div className="project-card">

                <div className="card card-view">

                    <div className="card-body">

                        <h5 className="card-title d-flex align-items-center justify-content-between">

                            <div className="project-title">
                                <a className="nav-link" href={'/projects/' + props.projectId + '/experiments'} title={props.projectName}>
                                    {props.projectName}
                                </a>
                            </div>
                            <div className="more-action ps-3">
                                <span className="more-action-button material-symbols-rounded" data-bs-toggle="dropdown" title="Project actions">
                                    more_vert
                                </span>

                                {!props.projectIsArchived ?

                                    <ul className="dropdown-menu dropdown-menu-end">

                                        <li className="dropdown-header">

                                            <h6>Project menu</h6>

                                        </li>

                                        <div className="dropdown-divider"></div>

                                        <li>
                                            <a onClick={
                                                () => {
                                                    props.setCurrentProject({
                                                        _id: props.projectId,
                                                        title: props.projectName,
                                                        description: props.projectDescription || "",
                                                        status: props.projectStatus,
                                                        archived: props.projectIsArchived
                                                    })
                                                    props.setCurrentProjectEditable({
                                                        _id: props.projectId,
                                                        title: props.projectName,
                                                        description: props.projectDescription || "",
                                                        status: props.projectStatus,
                                                        archived: props.projectIsArchived
                                                    })
                                                }}
                                               className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                               data-bs-target="#edit-project">
                                                <span className="material-symbols-rounded">
                                                    edit
                                                </span>
                                                Edit project
                                            </a>
                                        </li>

                                        <div className="dropdown-divider"></div>

                                        <li>
                                            <a onClick={
                                                () => props.setCurrentProject({
                                                    _id: props.projectId,
                                                    title: props.projectName,
                                                    description: props.projectDescription || "",
                                                    status: props.projectStatus,
                                                    archived: props.projectIsArchived}
                                                )}
                                               className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                               data-bs-target="#archive-project">
                                                <span className="material-symbols-rounded">
                                                    archive
                                                </span>
                                                Archive project
                                            </a>
                                        </li>

                                        <div className="dropdown-divider"></div>

                                        <li>
                                            <a onClick={
                                                () => props.setCurrentProject({
                                                    _id: props.projectId,
                                                    title: props.projectName,
                                                    description: props.projectDescription || "",
                                                    status: props.projectStatus,
                                                    archived: props.projectIsArchived}
                                                )}
                                               className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                               data-bs-target="#delete-project">
                                            <span className="material-symbols-rounded">
                                                delete
                                            </span>
                                                Delete project
                                            </a>
                                        </li>

                                        <div className="dropdown-divider"></div>

                                    </ul>

                                    :

                                    <ul className="dropdown-menu dropdown-menu-end">

                                        <li className="dropdown-header">

                                            <h6>Project menu</h6>

                                        </li>

                                        <div className="dropdown-divider"></div>

                                        <li>
                                            <a onClick={
                                                () => {
                                                    props.setCurrentProject({
                                                        _id: props.projectId,
                                                        title: props.projectName,
                                                        description: props.projectDescription || "",
                                                        status: props.projectStatus,
                                                        archived: props.projectIsArchived
                                                    })
                                                }
                                            }  className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                               data-bs-target="#restore-project">
                                                <span className="material-symbols-rounded">
                                                    unarchive
                                                </span>
                                                Restore project
                                            </a>
                                        </li>

                                        <div className="dropdown-divider"></div>

                                        <li>
                                            <a onClick={
                                                () => props.setCurrentProject({
                                                    _id: props.projectId,
                                                    title: props.projectName,
                                                    description: props.projectDescription || "",
                                                    status: props.projectStatus,
                                                    archived: props.projectIsArchived}
                                                )}
                                               className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                               data-bs-target="#delete-project">
                                            <span className="material-symbols-rounded">
                                                delete
                                            </span>
                                                Delete project
                                            </a>
                                        </li>

                                        <div className="dropdown-divider"></div>

                                    </ul>

                                }

                            </div>

                        </h5>



                        { props.projectStatus === 'completed' ?
                            <span className={"badge finished"}>Finished</span>

                            :

                            <span className={"badge " + props.projectStatus.replace('_', '-')}>{capitalizeFirstLetter(props.projectStatus.replace(/_/g, ' '))}</span>
                        }

                        { props.projectIsArchived && <span className="badge archived" style={{marginLeft: 4 + "px"}}>Archived</span>}

                        <p className="card-text mb-0">
                            {props.projectDescription}
                        </p>

                        <div className="mb-1 fw-bold" style={{marginTop: 12 + "px"}}>

                            <div className="d-flex align-items-center">
                                <span className="material-symbols-rounded pe-1">
                                    calendar_month
                                </span>
                                Creation Date
                            </div>

                        </div>

                        <div className="d-flex justify-content-start flex-wrap">
                            {props.projectCreationDate}
                        </div>

                        <div className="mb-1 fw-bold" style={{marginTop: 12 + "px"}}>

                            <div className="d-flex align-items-center">
                                <span className="material-symbols-rounded pe-1">
                                    update
                                </span>
                                Last Modification
                            </div>

                        </div>

                        <div className="d-flex justify-content-start flex-wrap">
                            {props.projectModifyDate}
                        </div>

                        <div className="mb-1 fw-bold"  style={{marginTop: 12 + "px"}}>
                            <span className="float-end">
                                ({experimentsNumber})
                            </span>
                            <div className="d-flex align-items-center">
                                <span className="material-symbols-rounded pe-1">
                                    science
                                </span>
                                Experiments
                            </div>

                        </div>

                        <div className="experiments-list">
                            {experiments}
                        </div>

                    </div>

                </div>

            </div>
    );
}

export default ProjectCard;