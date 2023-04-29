import React from "react";

function NavItem(props) {
    let className = "nav-link";
    if (props.location.startsWith(props.href)) {
        className += ' active';
    }
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