import React from "react";
import {Github} from "react-bootstrap-icons";
import {useLocation} from "react-router-dom";

import AppLogo from "./topbar-navbar/AppLogo";
import Searchbar from "./topbar-navbar/Searchbar";
import RightPanel from "./topbar-navbar/RightPanel";
import NavItem from "./sidebar/NavItem";

/**
 * Navigation component.
 * */
function Navigation() {
    let path = useLocation().pathname;

    /**
     * Function for toggle sidebar.
     * */
    function toggleSidebar() {
        document.body.classList.toggle('toggle-sidebar');
    }

    /**
     * Function for toggle searchbar.
     * */
    function toggleSearchbar() {
        document.getElementById('search-bar').classList.toggle('search-bar-show');
    }

    /**
     * Component rendering.
     * */
    return (
        <React.Fragment>
            <header id="topbar-navbar" className="topbar-navbar sticky-top d-flex align-items-center">

                <AppLogo toogleSidebar={toggleSidebar}/>

                {/*<Searchbar />*/}
                <Searchbar />

                <RightPanel toggleSearchbar={toggleSearchbar}/>

            </header>

            <nav id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-section">Tracking</li>

                    <NavItem
                        location={path}
                        href={'/projects'}
                        name={'Projects'}
                        icon={
                            <span className="material-symbols-rounded">
                                dashboard
                            </span>
                        }/>

                    <li className="nav-section">Datasets</li>

                    <NavItem
                        location={path}
                        href={'/datasets'}
                        name={'Datasets'}
                        icon={
                            <span className="material-symbols-rounded">
                                dataset
                            </span>
                        }/>

                    <li className="nav-section">Help</li>

                    <NavItem
                        location={path}
                        href={'https://github.com'}
                        name={'Github'}
                        icon={
                            <Github/>
                        }/>

                    <li className="nav-item">
                        <a className="nav-link" href="#">
                    <span className="material-symbols-rounded">
                        article
                    </span>
                            <span>Documentation</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link" href="#">
                    <span className="material-symbols-rounded">
                        help
                    </span>
                            <span>FAQ</span>
                        </a>
                    </li>

                </ul>

            </nav>
        </React.Fragment>
    );
}

export default Navigation;