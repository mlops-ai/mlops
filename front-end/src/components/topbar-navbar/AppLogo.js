import React from "react";
import logo from '../../assets/logos/mlops.png';

function AppLogo(props) {

    return (
        <div className="d-flex align-items-center justify-content-between">
            <a href="#" className="app-logo d-flex align-items-center">
                <img src={logo} alt="MLOps application logo"/>
                <span className="app-name d-none d-lg-block">MLOps</span>
            </a>
            <span className="material-symbols-rounded toggle-sidebar-btn" onClick={props.toogleSidebar}>
                menu
            </span>
        </div>
    );
}

export default AppLogo;