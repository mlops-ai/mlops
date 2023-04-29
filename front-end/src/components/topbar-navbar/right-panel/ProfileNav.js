import React from "react";
import photo4 from "../../../assets/images/photo-1.jpg";

function ProfileNav(props) {
    return (
        <li className="dropdown pe-3">

            <a className="nav-link user-profile d-flex align-items-center pe-0" href="#"
               data-bs-toggle="dropdown">
                <img src={photo4} alt="User profile image"
                     className="rounded-circle"/>
                <span className="d-none d-md-block ps-2">P. Łączkowski</span>

            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                    <h6>Paweł Łączkowski</h6>
                    <span>Data Science Engineer</span>
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                                <span className="material-symbols-rounded">
                                    person
                                </span>
                        <span>My Profile</span>
                    </a>
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                                <span className="material-symbols-rounded">
                                    settings
                                </span>
                        <span>Account Settings</span>
                    </a>
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                                <span className="material-symbols-rounded">
                                    help
                                </span>
                        <span>Help</span>
                    </a>
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                                <span className="material-symbols-rounded">
                                    logout
                                </span>
                        <span>Sign Out</span>
                    </a>
                </li>

            </ul>
        </li>
    );
}

export default ProfileNav;