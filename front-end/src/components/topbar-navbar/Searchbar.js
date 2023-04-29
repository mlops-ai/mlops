import React from "react";

function Searchbar(props) {

    return (
        <div id="search-bar" className="search-bar">
            <form className="search-form d-flex align-items-center" method="POST" action="#">
                <input id="search-input" type="text" name="query"
                       placeholder="Search for experiments, models, teams or members ..."
                       title="Enter search keyword"/>
                <button id="search-submit" type="submit" title="Search">
                    <span className="material-symbols-rounded">
                        search
                    </span>
                </button>
            </form>
        </div>
    );
}

export default Searchbar;