import React from "react";

function Notifications(props) {
    return (
        <li className="dropdown">

            <a className="nav-link panel-icon" href="#" data-bs-toggle="dropdown">
                        <span className="material-symbols-rounded">
                            notifications
                        </span>
                <span className="badge bg-primary badge-number">2</span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                    You have 2 new notifications
                    <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="notification-item">
                            <span className="material-symbols-rounded text-warning">
                                task_alt
                            </span>
                    <div>
                        <h4>Added task in <span className="fw-bold fst-italic">Cat or not</span> team.
                        </h4>
                        <p>User <span className="fw-bold fst-italic text-danger">MLOps</span> added
                            task <span className="fw-bold fst-italic">Create model ...</span></p>
                        <p>2 hrs. ago</p>
                    </div>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="notification-item">
                            <span className="material-symbols-rounded text-primary">
                                groups
                            </span>
                    <div>
                        <h4>You have been added to the team!</h4>
                        <p>User <span className="fw-bold fst-italic text-danger">MLOps</span> added you
                            to
                            the <span className="fw-bold fst-italic">Cat or not</span> team.</p>
                        <p>4 hrs. ago</p>
                    </div>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="dropdown-footer">
                    <a href="#">Show all notifications</a>
                </li>

            </ul>

        </li>
    );
}

export default Notifications;