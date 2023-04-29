import React from "react";

function ExperimentListItem(props) {
    return (
        <div className={"experiment-item pt-1 pb-1 " + (props.experimentActive ? "active" : "")}>
            <div className="d-flex align-items-center justify-content-between">

                <div className="d-flex align-items-center">
                    <input className="form-check-input m-0 me-1 shadow-none" type="checkbox" checked={props.experimentActive} name={props.experimentID}
                    onChange={props.handleChange}/>
                    <span style={{cursor: "pointer"}} experiment-id={props.experimentID} onClick={props.handleChangeSingle}>{props.experimentName}</span>
                </div>

                <div className="d-flex align-items-center">
                    <span className="material-symbols-rounded icon-basic" title="Edit experiment" data-bs-toggle="modal"
                          onClick={
                                  () => {
                                      props.setCurrentExperiment({
                                          id: props.experimentID,
                                          name: props.experimentName,
                                          description: props.experimentDescription || ""
                                      })
                                      props.setCurrentExperimentEditable({
                                          id: props.experimentID,
                                          name: props.experimentName,
                                          description: props.experimentDescription || ""
                                      })
                                  }
                                }
                          data-bs-target="#edit-experiment">
                        edit
                    </span>
                    <span className="material-symbols-rounded icon-basic" title="Delete experiment" data-bs-toggle="modal"
                          onClick={
                              () => props.setCurrentExperiment({
                                  id: props.experimentID,
                                  name: props.experimentName,
                                  description: props.experimentDescription || ""}
                              )}
                          data-bs-target="#delete-experiment">
                        delete
                    </span>
                </div>

            </div>
        </div>
    );
}

export default ExperimentListItem;