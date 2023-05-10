import React from "react";

/**
 * Sidebar nav item component.
 * */
function NavItem(props) {
    let className = "nav-link";

    /**
     * Check for active state.
     * */
    if (props.location.startsWith(props.href)) {
        className += ' active';
    }

    /**
     * Component rendering.
     * */
    return (
        <li className="nav-item">
            <a className={className} href={props.href}>
                {props.icon}
                <span>{props.name}</span>
            </a>
        </li>
    );
}

export default NavItem;