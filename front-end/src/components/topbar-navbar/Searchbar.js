import React, {useEffect, useState, useContext} from "react";
import { components } from "react-select";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import AsyncSelect from "react-select/async";
import {OptionsContext} from "../../App";

/**
 * Searchbar component for searching projects, experiments and iterations.
 * */
function Searchbar() {

    console.log("[FOR DEBUGGING PURPOSES]: SEARCHBAR !")

    /**
     * Function used for redirecting.
     * */
    let navigate = useNavigate();

    /**
     * State used for storing options data.
     * */
    const [optionsData, setOptionsData] = useState([])

    /**
     * React content hook for refreshing options list after changing data in database.
     * */
    const [refresher, setRefresher] = useContext(OptionsContext);

    /**
     * REST API request for options data.
     * */
    useEffect(() => {
        fetch('http://localhost:8000/projects')
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            })
            .then(data => {
                let options = []
                data.forEach(project => {
                    options.push(
                        {
                            value: '/projects/' + project._id + '/experiments',
                            label: project.title,
                            additionalInfo: 'Project',
                            type: 'project'
                        }
                    )
                    project.experiments.forEach(experiment => {
                        options.push(
                            {
                                value: '/projects/' + project._id + '/experiments?experiments=' + experiment.id,
                                label: experiment.name,
                                additionalInfo: 'Experiment, ' + project.title,
                                type: 'experiment'
                            }
                        )
                        experiment.iterations.forEach(iteration => {
                            options.push(
                                {
                                    value: '/projects/' + project._id + '/experiments/' + experiment.id + '/iterations/' + iteration.id,
                                    label: iteration.iteration_name,
                                    additionalInfo: 'Iteration, ' + project.title + ' > ' + experiment.name,
                                    type: 'iteration'
                                }
                            )
                        })
                    })
                })
                setOptionsData(options)
            })
            .catch((response) => {
                response.json().then((json: any) => {
                    toast.error(json.detail, {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
            });
    }, [refresher]);

    /**
     * Defining option list element.
     * */
    const Option = props => {
        return (
            <components.Option {...props}>
                <div>
                    <label>
                        <span>
                            {props.data.label}
                        </span>
                        <span className="text-secondary d-block" style={{fontSize: 12 + "px", marginLeft: 12 + "px"}}>
                            ({props.data.additionalInfo})
                        </span>
                    </label>
                </div>
            </components.Option>
        );
    };

    /**
     * Option on click event handler.
     * */
    const onClick = option => {
        navigate(option.value, {replace: false})
    }

    /**
     * Defining dropdown icon.
     * */
    const DropdownIndicator = props => {
        return (
            <components.DropdownIndicator {...props}>
                <span className="material-symbols-rounded">
                    search
                </span>
            </components.DropdownIndicator>
        );
    };

    /**
     * Custom styles for react-select.
     * */
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: state.isFocused ? '#012970' : 'rgba(1, 41, 112, 0.2)',
            borderWidth: '1.5px',
            minHeight: '40px',
            height: '40px',
            boxShadow: null,
            "&:hover": {
                borderColor: '#012970',
                borderWidth: '1.5px',
            }
        }),

        valueContainer: (provided, state) => ({
            ...provided,
            height: '40px',
            padding: '0 6px'
        }),

        input: (provided, state) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '40px',
        }),
    };

    /**
     * Component rendering.
     * */
    return (
        <div id="search-bar" className="search-bar">
            {optionsData &&

                <AsyncSelect
                    styles={customStyles}
                    placeholder= "Search for projects, experiments or iterations ..."
                    noOptionsMessage={()=>"No objects found based on search query."}
                    onChange={onClick}
                    components={{Option, DropdownIndicator}}
                    value={""}
                    loadOptions={(inputValue, callback) => {
                        callback(optionsData.filter(x => x.label.toLowerCase().trim().includes(inputValue.toLowerCase().trim())).slice(0, 50))
                    }}
                    cacheOptions
                    defaultOptions={optionsData.slice(0,50)}
                />

            }

        </div>
    )
}

export default Searchbar