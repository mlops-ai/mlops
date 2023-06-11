import React from "react";
import photo3 from "../../../assets/images/photo-4.jpg";
import photo2 from "../../../assets/images/photo-3.jpg";

function Messages() {
    return (
        <li className="dropdown">

            <a className="nav-link panel-icon" href="#" data-bs-toggle="dropdown">
                        <span className="material-symbols-rounded">
                            chat
                        </span>
                <span className="badge bg-success badge-number">2</span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                    You have 2 new messages
                    <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="message-item">
                    <a href="#">
                        <img src={photo3} alt=""
                             className="rounded-circle"/>
                        <div>
                            <h4>Matthew Cote</h4>
                            <p>Hey, I found out that we have a serious bug in our ...</p>
                            <p>10 min. ago</p>
                        </div>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="message-item">
                    <a href="#">
                        <img src={photo2} alt=""
                             className="rounded-circle"/>
                        <div>
                            <h4>Jessica Parker</h4>
                            <p>Hey, I have very important information about our next project ...</p>
                            <p>2 hrs. ago</p>
                        </div>
                    </a>
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li className="dropdown-footer">
                    <a href="#">Show all messages</a>
                </li>

            </ul>

        </li>
    );
}

export default Messages;