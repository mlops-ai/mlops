import React from "react";

import ProfileNav from "./right-panel/ProfileNav";
import Messages from "./right-panel/Messages";
import Notifications from "./right-panel/Notifications";

function RightPanel(props) {
    return (
        <nav className="right-panel ms-auto">
            <ul className="d-flex align-items-center">

                <li className="d-block d-lg-none">
                    <a className="nav-link panel-icon search-bar-toggle " href="#" onClick={props.toggleSearchbar}>
                        <span className="material-symbols-rounded">
                            search
                        </span>
                    </a>
                </li>

                <Notifications />

                <Messages />

                <ProfileNav />

            </ul>
        </nav>
    );
}

export default RightPanel;