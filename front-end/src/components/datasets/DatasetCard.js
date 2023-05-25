import React from "react";
import {toast} from "react-toastify";

/**
 * Dataset card component.
 * */
function DatasetCard(props) {
    /**
     * Color palette for badges.
     * */
    const colors = ['#3E54AC', '#F0A04B', '#EB455F', '#A084DC', '#FF6969', '#F97B22', '#89375F', '#B2A4FF', '#EA5455', '#539165']

    /**
     * Generating labels.
     * */
    let labels = []
    let tags
    let version

    if (props.datasetTags !== "") {
        tags = props.datasetTags.split(',').map(tag => tag.trim())
        tags = tags.map((tag, index) => {
            if (index !== 0) {
                return <span key={index} className="badge"
                             style={{backgroundColor: colors[index % 10], marginLeft: 4 + "px"}}>{tag}</span>
            }
            return <span key={index} className="badge" style={{backgroundColor: colors[index % 10]}}>{tag}</span>
        })
        labels = labels.concat(tags)
    }

    if (props.datasetVersion !== "") {
        if (tags) {
            version = <span className="badge"
                            style={{backgroundColor: "#012970", marginLeft: 4 + "px"}}>{props.datasetVersion}</span>
        } else {
            version = <span className="badge"
                            style={{backgroundColor: "#012970"}}>{props.datasetVersion}</span>
        }

        labels = labels.concat(version)
    }

    return (<div className="dataset-card">

            <div className="card card-view">

                <div className="card-body">

                    <h5 className="card-title d-flex align-items-center justify-content-between">

                        <div className="dataset-title d-flex align-items-center">
                            <a className="nav-link" title={props.datasetName}>
                                {props.datasetName}
                            </a>
                            <span className="material-symbols-rounded" title="Copy dataset id"
                                  style={{fontSize: 16 + "px", marginLeft: 4 + "px"}} onClick={
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
                                    navigator.clipboard.writeText(props.datasetId)
                                }
                            }>
                                content_copy
                            </span>
                        </div>
                        <div className="more-action ps-3">
                                <span className="more-action-button material-symbols-rounded" data-bs-toggle="dropdown"
                                      title="Dataset actions">
                                    more_horiz
                                </span>

                            {!props.datasetIsArchived ?

                                <ul className="dropdown-menu dropdown-menu-end">

                                    <li className="dropdown-header">

                                        <h6>Dataset menu</h6>

                                    </li>

                                    <div className="dropdown-divider"></div>
                                    <li>
                                        <a onClick={() => {
                                            props.setCurrentDataset({
                                                _id: props.datasetId,
                                                dataset_name: props.datasetName,
                                                path_to_dataset: props.datasetPath,
                                                dataset_description: props.datasetDescription || "",
                                                tags: props.datasetTags || "",
                                                version: props.datasetVersion || "",
                                                archived: props.projectIsArchived
                                            })
                                            props.setCurrentDatasetEditable({
                                                _id: props.datasetId,
                                                dataset_name: props.datasetName,
                                                path_to_dataset: props.datasetPath,
                                                dataset_description: props.datasetDescription || "",
                                                tags: props.datasetTags || "",
                                                version: props.datasetVersion || "",
                                                archived: props.projectIsArchived
                                            })
                                        }}
                                           className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                           data-bs-target="#edit-dataset">
                                                <span className="material-symbols-rounded">
                                                    edit
                                                </span>
                                            Edit dataset
                                        </a>
                                    </li>

                                    <div className="dropdown-divider"></div>

                                    <li>
                                        <a onClick={() => {
                                            props.setCurrentDataset({
                                                _id: props.datasetId,
                                                dataset_name: props.datasetName,
                                                path_to_dataset: props.datasetPath,
                                                dataset_description: props.datasetDescription || "",
                                                tags: props.datasetTags || "",
                                                version: props.datasetVersion || "",
                                                archived: props.projectIsArchived
                                            })
                                        }}
                                           className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                           data-bs-target="#archive-dataset">
                                                <span className="material-symbols-rounded">
                                                    archive
                                                </span>
                                            Archive dataset
                                        </a>
                                    </li>

                                    <div className="dropdown-divider"></div>

                                    <li>
                                        <a onClick={() => {
                                            props.setCurrentDataset({
                                                _id: props.datasetId,
                                                dataset_name: props.datasetName,
                                                path_to_dataset: props.datasetPath,
                                                dataset_description: props.datasetDescription || "",
                                                tags: props.datasetTags || "",
                                                version: props.datasetVersion || "",
                                                archived: props.projectIsArchived
                                            })
                                        }}
                                           className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                           data-bs-target="#delete-dataset">
                                            <span className="material-symbols-rounded">
                                                delete
                                            </span>
                                            Delete dataset
                                        </a>
                                    </li>

                                    <div className="dropdown-divider"></div>

                                </ul>

                                :

                                <ul className="dropdown-menu dropdown-menu-end">

                                    <li className="dropdown-header">

                                        <h6>Dataset menu</h6>

                                    </li>

                                    <div className="dropdown-divider"></div>

                                    <li>
                                        <a onClick={() => {
                                            props.setCurrentDataset({
                                                _id: props.datasetId,
                                                dataset_name: props.datasetName,
                                                path_to_dataset: props.datasetPath,
                                                dataset_description: props.datasetDescription || "",
                                                tags: props.datasetTags || "",
                                                version: props.datasetVersion || "",
                                                archived: props.projectIsArchived
                                            })
                                        }}
                                           className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                           data-bs-target="#restore-dataset">
                                                <span className="material-symbols-rounded">
                                                    unarchive
                                                </span>
                                            Restore dataset
                                        </a>
                                    </li>

                                    <div className="dropdown-divider"></div>

                                    <li>
                                        <a onClick={() => {
                                            props.setCurrentDataset({
                                                _id: props.datasetId,
                                                dataset_name: props.datasetName,
                                                path_to_dataset: props.datasetPath,
                                                dataset_description: props.datasetDescription || "",
                                                tags: props.datasetTags || "",
                                                version: props.datasetVersion || "",
                                                archived: props.projectIsArchived
                                            })
                                        }}
                                           className="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                                           data-bs-target="#delete-dataset">
                                            <span className="material-symbols-rounded">
                                                delete
                                            </span>
                                            Delete dataset
                                        </a>
                                    </li>

                                    <div className="dropdown-divider"></div>

                                </ul>

                            }


                        </div>

                    </h5>

                    {labels}

                    <p className="card-text mb-0">
                        {props.datasetDescription}
                    </p>

                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="mb-1 fw-bold" style={{marginTop: 12 + "px"}}>
                                <div className="d-flex align-items-center path">
                                        <span className="material-symbols-rounded pe-1">
                                            link
                                        </span>
                                    Dataset Source
                                    <span className="material-symbols-rounded" title="Copy dataset path"
                                          style={{fontSize: 14 + "px", marginLeft: 4 + "px"}} onClick={
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
                                            navigator.clipboard.writeText(props.datasetPath)
                                        }
                                    }>
                                        content_copy
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex justify-content-start flex-wrap">
                                <p className="m-0"
                                   style={{overflow: "clip"}}>
                                    <a href={props.datasetPath !== "" && props.datasetPath}>
                                        {props.datasetPath !== "" ? props.datasetPath : "-"}
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="mb-1 fw-bold" style={{marginTop: 12 + "px"}}>

                                <div className="d-flex align-items-center">
                                    <span className="material-symbols-rounded pe-1">
                                        analytics
                                    </span>
                                    Dataset Version
                                </div>

                            </div>

                            <div className="d-flex justify-content-start flex-wrap">
                                {props.datasetVersion !== "" ? props.datasetVersion : "-"}
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="mb-1 fw-bold" style={{marginTop: 12 + "px"}}>

                                <div className="d-flex align-items-center">
                                    <span className="material-symbols-rounded pe-1">
                                        calendar_month
                                    </span>
                                    Creation Date
                                </div>

                            </div>

                            <div className="d-flex justify-content-start flex-wrap">
                                {props.datasetCreationDate}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="mb-1 fw-bold" style={{marginTop: 12 + "px"}}>

                                <div className="d-flex align-items-center">
                                    <span className="material-symbols-rounded pe-1">
                                        update
                                    </span>
                                    Last Modification
                                </div>

                            </div>

                            <div className="d-flex justify-content-start flex-wrap">
                                {props.datasetModifyDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DatasetCard;