import React from "react";

function RightPanel(props) {
    return (
        <nav className="right-panel ms-auto">
            <ul className="d-flex align-items-center">

                <li className="d-block d-lg-none">
                    <a className="nav-link panel-icon search-bar-toggle" href="#" onClick={props.toggleSearchbar}>
                        <span className="material-symbols-rounded toggle-searchbar-btn d-block">
                            search
                        </span>
                    </a>
                </li>

            </ul>
        </nav>
    );
}

export default RightPanel;