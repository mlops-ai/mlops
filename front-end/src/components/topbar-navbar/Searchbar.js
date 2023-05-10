import React from "react";

/**
 * Searchbar component.
 * */
function Searchbar(props) {

    /**
     * Component rendering.
     * */
    return (
        <div id="search-bar" className="search-bar">
            <form className="search-form d-flex align-items-center" action="#">
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