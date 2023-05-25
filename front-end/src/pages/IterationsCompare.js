import React, {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import LoadingData from "../components/LoadingData";
import moment from "moment/moment";
import * as echarts from 'echarts';
import {
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LegendScrollComponent,
    LegendPlainComponent
} from 'echarts/components';
import {BarChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import ReactEcharts from "echarts-for-react";
import custom_theme from "../js/customed.json";
import {toast} from "react-toastify";
import Toast from "../components/Toast";


/**
 * Echarts register theme and initial configuration.
 * */
echarts.registerTheme('customed', custom_theme)
echarts.use([TooltipComponent, GridComponent, LegendComponent, LegendScrollComponent, LegendPlainComponent, BarChart, CanvasRenderer]);

/**
 * Iterations compare page component for displaying information about multiple runs and models.
 * */

function IterationsCompare(props) {

    console.log("[FOR DEBUGGING PURPOSES]: ITERATION COMPARE VIEW !")

    /**
     * React ref hooks for simultaneous scrolling multiple sections.
     */
    const iteration_data = useRef();
    const model_data = useRef();
    const dataset_data = useRef();
    const parameter_data = useRef();
    const metric_data = useRef();

    /**
     * Import library for date manipulation.
     */
    let moment = require('moment');

    /**
     * React hook for search params.
     * */
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Get :project_id param from url.
     * */
    const {project_id} = useParams();

    /**
     * State used for storing information about compared iterations.
     * */
    const [iterationsData, setIterationsData] = useState();

    /**
     * Function used for redirecting.
     * */
    let navigate = useNavigate();

    /**
     * REST API request for iteration data based on url params (:project_id).
     * If project based on url params don't exist, user will be redirected to main page.
     * If not enough iterations was provided in url param (?iterations), user will be redirected to project page.
     * */
    useEffect(() => {
        fetch('http://localhost:8000/projects/' + project_id)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            })
            .then(data => {
                let iterations_data = JSON.parse(searchParams.get("iterations"))
                let experiments_ids = Object.getOwnPropertyNames(iterations_data)
                let experiments = data.experiments.filter(experiment => experiments_ids.includes(experiment.id))
                let iterations = experiments.map(experiment => {
                    return {
                        ...experiment,
                        iterations: experiment.iterations.filter(iteration => iterations_data[experiment.id].includes(iteration.id))
                    }
                })
                iterations = iterations.map(experiment => experiment.iterations)
                iterations = iterations.flat()
                if (iterations.length >= 2) {
                    setIterationsData({
                        iterations: iterations,
                        numberOfExperiments: experiments.length,
                        projectTitle: data.title
                    })
                } else {
                    navigate('/projects/' + project_id + '/experiments')
                }
            })
            .catch((response) => {
                navigate('/projects')
            });

    }, []);

    /**
     * Prepare data from REST API request to displayable form.
     * @ iterations_details: iterations details section data
     * @ models_details: models details section data
     * @ datasets_details: datasets details section data
     * @ parameters_data: parameters section data
     * @ metrics_data: metrics section data
     * @ metrics_chart: configuration of metrics comparasion chart
     * UseMemo is used for optimization purposes.
     * */
    const [iterations_details, models_details, datasets_details, parameters_data, metrics_data, metrics_chart] = useMemo(() => {
        if (iterationsData) {
            let ids = []
            let names = []
            let creation_dates = []
            let last_modification = []
            let experiment_names = []
            let users = []

            let model_names = []
            let model_paths = []

            let dataset_names = []
            let dataset_versions = []
            let dataset_paths = []

            let parameters = []
            let parameters_values = []
            let parameters_data = []

            let metrics = []
            let metrics_values = []
            let metrics_data = []

            let metrics_chart;
            let names_text = [];

            iterationsData.iterations.forEach(iteration => {
                ids.push(<td>{iteration.id}</td>);
                names.push(<td><a style={{display: "block", textOverflow: "ellipsis", overflow: "hidden"}} href={"/projects/" + iteration.project_id + "/experiments/" + iteration.experiment_id + "/iterations/" + iteration.id}>{iteration.iteration_name}</a></td>);
                names_text.push(iteration.iteration_name);
                creation_dates.push(<td>{moment(new Date(iteration.created_at)).format("DD-MM-YYYY, HH:mm:ss")}</td>);
                last_modification.push(<td>{moment(new Date(iteration.updated_at)).format("DD-MM-YYYY, HH:mm:ss")}</td>);
                experiment_names.push(<td><a style={{display: "block", textOverflow: "ellipsis", overflow: "hidden"}} href={"/projects/" + iteration.project_id + "/experiments?experiments=" + iteration.experiment_id}>{iteration.experiment_name}</a></td>);
                users.push(<td>{iteration.user_name}</td>);

                model_names.push(<td>{iteration.model_name}</td>);
                model_paths.push(iteration.path_to_model && iteration.path_to_model !== "" ?
                    <td>{iteration.path_to_model}</td> : <td>-</td>);

                dataset_names.push(iteration.dataset && iteration.dataset.name !== "" ?
                    <td>{iteration.dataset.name}</td> : <td>-</td>);
                dataset_versions.push(iteration.dataset && iteration.dataset.version !== "" ?
                    <td>{iteration.dataset.version}</td> : <td>-</td>);
                dataset_paths.push(iteration.dataset && iteration.dataset.path_to_dataset !== "" ?
                    <td>{iteration.dataset.path_to_dataset}</td> : <td>-</td>);

                parameters.push(new Set(iteration.parameters !== null ? Object.getOwnPropertyNames(iteration.parameters) : ''))
                metrics.push(new Set(iteration.metrics !== null ? Object.getOwnPropertyNames(iteration.metrics) : ''))
            })

            /**
             * Parameters
             * */
            let parameters_names = new Set();

            parameters.forEach(data => data.forEach(parameter => {
                parameters_names.add(parameter)
            }))

            parameters_names = Array.from(parameters_names)

            if (parameters_names.length > 0) {
                parameters_names.forEach(param => {
                    let data = []
                    iterationsData.iterations.forEach(iteration => {
                        if (iteration.parameters) {
                            if (iteration.parameters[param]) {
                                data.push(iteration.parameters[param])
                            } else {
                                data.push('-')
                            }
                        } else {
                            data.push('-')
                        }
                    })
                    parameters_values.push(data)
                    parameters_data.push(<tr><th>{param}</th>{data.map(value => <td>{value}</td>)}</tr>)
                })
            } else {
                parameters_data = null
            }

            /**
             * Metrics
             * */
            let metrics_names = new Set();

            metrics.forEach(data => data.forEach(metric => {
                metrics_names.add(metric)
            }))

            metrics_names = Array.from(metrics_names)

            if (metrics_names.length > 0) {
                iterationsData.iterations.forEach(iteration => {
                    let data = []
                    if (iteration.metrics) {
                        metrics_names.forEach(metric => {
                            if (iteration.metrics[metric]) {
                                data.push(iteration.metrics[metric])
                            } else {
                                data.push('-')
                            }
                        })
                        metrics_values.push(data)
                    } else {
                        metrics_values.push(Array(metrics_names.length).fill('-'))
                    }
                })

                metrics_names.forEach((metric, index) => {
                    let data = []
                    metrics_values.forEach(values => {
                        data.push(values[index])
                    })
                    metrics_data.push(<tr><th>{metric}</th>{data.map(value => <td>{value}</td>)}</tr>)
                })

                let series = metrics_values.map((values, index) => {
                    return {
                        name: names_text[index],
                        data: values,
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
                    }
                })

                metrics_chart = {
                    xAxis: {
                        type: "category",
                        data: metrics_names
                    },
                    yAxis: {
                        type: 'value'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                show: true,
                                yAxisIndex: "none"
                            },
                            brush: {
                                type: 'polygon',
                            },
                            restore: {
                                show: true,
                            },
                            saveAsImage: {},
                        }
                    },
                    title: {
                        left: 'center',
                        text: "Metrics Comparasion Chart"
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: [
                        {
                            type: 'scroll',
                            top: 'bottom'
                        },
                    ],
                    series: series
                };
            } else {
                metrics_data = null
                metrics_chart = null
            }

            return [
                {
                    ids: ids,
                    names: names,
                    creation_dates: creation_dates,
                    experiment_names: experiment_names,
                    last_modification: last_modification,
                    users: users
                },
                {
                    model_names: model_names,
                    model_paths: model_paths
                },
                {
                    dataset_names: dataset_names,
                    dataset_versions: dataset_versions,
                    dataset_paths: dataset_paths
                },
                parameters_data,
                metrics_data,
                metrics_chart
            ]
        }
        return [null, null, null, null, null, null]
    })

    /**
     * Component rendering.
     * If iterationsData is available, it returns compared iterations view.
     * If not, it returns loading screen.
     * */
    if (iterationsData) {
        return (
            <main id="content">

                <div className="page-path">
                    <h1 className="d-flex align-items-center">
                        <span className="fw-semibold">
                            Comparing {iterationsData.iterations.length} runs from {iterationsData.numberOfExperiments} experiments
                        </span>
                    </h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item"><a
                                href={"/projects/" + project_id + "/experiments"}>{iterationsData.projectTitle}</a></li>
                            <li className="breadcrumb-item active">Compare iterations</li>
                        </ol>
                    </nav>
                </div>

                <section className="iterations-compare-view section content-data">
                    <h5><span className="fw-semibold">Iterations details</span></h5>
                    <div className="card p-2">
                        <div ref={iteration_data} className="table-responsive"
                             onScroll={(event) => {
                                 model_data.current.scrollLeft = event.target.scrollLeft;
                                 dataset_data.current.scrollLeft = event.target.scrollLeft;
                                 parameter_data.current.scrollLeft = event.target.scrollLeft;
                                 metric_data.current.scrollLeft = event.target.scrollLeft;
                             }}>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th>Iteration&nbsp;ID:</th>
                                    {iterations_details.ids}
                                </tr>
                                <tr>
                                    <th>Iteration&nbsp;Name:</th>
                                    {iterations_details.names}
                                </tr>
                                <tr>
                                    <th>Creation&nbsp;Date:</th>
                                    {iterations_details.creation_dates}
                                </tr>
                                <tr>
                                    <th>Last&nbsp;Modification:</th>
                                    {iterations_details.last_modification}
                                </tr>
                                <tr>
                                    <th>Experiment Name:</th>
                                    {iterations_details.experiment_names}
                                </tr>
                                <tr>
                                    <th>User:</th>
                                    {iterations_details.users}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h5><span className="fw-semibold">Models details</span></h5>
                    <div className="card p-2">
                        <div ref={model_data} className="table-responsive"
                             onScroll={(event) => {
                                 iteration_data.current.scrollLeft = event.target.scrollLeft;
                                 dataset_data.current.scrollLeft = event.target.scrollLeft;
                                 parameter_data.current.scrollLeft = event.target.scrollLeft;
                                 metric_data.current.scrollLeft = event.target.scrollLeft;
                             }}>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th>Model&nbsp;Name:</th>
                                    {models_details.model_names}
                                </tr>
                                <tr>
                                    <th>Model&nbsp;Path:</th>
                                    {models_details.model_paths}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h5><span className="fw-semibold">Dataset details</span></h5>

                    <div className="card p-2">
                        <div ref={dataset_data} className="table-responsive"
                             onScroll={(event) => {
                                 model_data.current.scrollLeft = event.target.scrollLeft;
                                 iteration_data.current.scrollLeft = event.target.scrollLeft;
                                 parameter_data.current.scrollLeft = event.target.scrollLeft;
                                 metric_data.current.scrollLeft = event.target.scrollLeft;
                             }}>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th>Dataset&nbsp;Name:</th>
                                    {datasets_details.dataset_names}
                                </tr>
                                <tr>
                                    <th>Dataset&nbsp;Version:</th>
                                    {datasets_details.dataset_versions}
                                </tr>
                                <tr>
                                    <th>Dataset&nbsp;Path</th>
                                    {datasets_details.dataset_paths}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h5><span className="fw-semibold">Parameters</span></h5>

                    { parameters_data ?
                        <div className="card p-2">
                            <div ref={parameter_data} className="table-responsive"
                                 onScroll={(event) => {
                                     model_data.current.scrollLeft = event.target.scrollLeft;
                                     iteration_data.current.scrollLeft = event.target.scrollLeft;
                                     dataset_data.current.scrollLeft = event.target.scrollLeft;
                                     metric_data.current.scrollLeft = event.target.scrollLeft;
                                 }}>
                                <table className="table">
                                    <tbody>
                                    {parameters_data}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        :

                        <p><span className="fst-italic">No parameters data to show!</span></p>
                    }

                    <h5><span className="fw-semibold">Metrics</span></h5>

                    { metrics_data ?
                        <>
                            <div className="card p-2">
                                <div ref={metric_data} className="table-responsive"
                                     onScroll={(event) => {
                                         model_data.current.scrollLeft = event.target.scrollLeft;
                                         iteration_data.current.scrollLeft = event.target.scrollLeft;
                                         dataset_data.current.scrollLeft = event.target.scrollLeft;
                                         parameter_data.current.scrollLeft = event.target.scrollLeft;
                                     }}>
                                    <table className="table">
                                        <tbody>
                                        {metrics_data}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card p-2">
                                <ReactEcharts option={metrics_chart} theme="customed"/>
                            </div>
                        </>

                        :

                        <p><span className="fst-italic">No metrics data to show!</span></p>
                    }

                    <h5><span className="fw-semibold">Custom charts</span></h5>

                    <p><span className="fst-italic">Tu będą wykresy zdefiniowane przez użytkownika!</span></p>

                </section>

                <Toast/>

            </main>
        )
    } else {
        return (
            <main id="content">

                <div className="page-path">
                    <h1>...</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item">...</li>
                            <li className="breadcrumb-item active">Compare iterations</li>
                        </ol>
                    </nav>
                </div>

                <section className="iteration-view section content-data">

                    <LoadingData
                        icon={"labs"}
                        dataSection={"iterations"}
                    />

                </section>
            </main>

        );
    }
}

export default IterationsCompare;