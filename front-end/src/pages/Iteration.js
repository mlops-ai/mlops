import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LoadingData from "../components/LoadingData";
import moment from "moment/moment";
import * as echarts from 'echarts';
import { TooltipComponent, GridComponent, LegendComponent, LegendScrollComponent, LegendPlainComponent} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEcharts from "echarts-for-react";
import custom_theme from "../js/customed.json";


/**
 * Echarts register theme and initial configuration.
 * */
echarts.registerTheme('customed', custom_theme)
echarts.use([TooltipComponent, GridComponent, LegendComponent, LegendScrollComponent, LegendPlainComponent, BarChart, CanvasRenderer]);

/**
 * Iteration page component for displaying information about single run and model.
 * */

function Iteration(props) {

    console.log("[FOR DEBUGGING PURPOSES]: ITERATION VIEW !")

    /**
     * State used for rerun REST API request and rerender component after performing an action modifying data in the database.
     * */
    const [refresh, setRefresh] = useState(0);

    /**
     * Get :project_id, :experiment_id, :iteration_id params from url.
     * */
    const {project_id, experiment_id, iteration_id} = useParams();

    /**
     * State used for storing information about iteration.
     * */
    const [iterationData, setIterationData] = useState();

    /**
     * Function used for redirecting.
     * */
    let navigate = useNavigate();

    /**
     * REST API request for iteration data based on url params (:project_id, :experiment_id, :iteration_id).
     * If project, experiment or iteration based on url params don't exist, user will be redirected to main page.
     * */
    useEffect(() => {

        fetch('http://localhost:8000/projects/' + project_id + '/experiments/' + experiment_id + '/iterations/' + iteration_id)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                return Promise.reject(response);
            })
            .then(data => {
                setIterationData(data)
            })
            .catch((response) => {
                navigate('/projects')
            });

    }, [refresh]);

    /**
     * Prepare data from REST API request to displayable form.
     * @ parameters_names: array of parameters names
     * @ parameters_values: array of parameters values
     * @ metrics_names: array of metrics names
     * @ metrics_values: array of metrics values
     * @ metrics_chart_options: configuration of metrics chart
     * UseMemo is used for optimization purposes.
     * */
    const [parameters_names, parameters_values, metrics_names, metrics_values, metrics_chart_options] = useMemo(() => {
        let parameters_names
        let parameters_values
        let metrics_names
        let metrics_values
        let metrics_chart_options
        if (iterationData) {
            if (iterationData.parameters) {
                parameters_names = Object.getOwnPropertyNames(iterationData.parameters)
                parameters_values = Object.values(iterationData.parameters)
            }
            if (iterationData.metrics) {
                metrics_names = Object.getOwnPropertyNames(iterationData.metrics)
                metrics_values = Object.values(iterationData.metrics)
                if (metrics_names.length > 0) {
                    let series = metrics_names.map((name, index) => {
                        let data = Array(metrics_names.length).fill(0)
                        data[index] = metrics_values[index]
                        return {
                            name: name,
                            data: data,
                            type: 'bar',
                            stack: 'stack',
                        }
                    })
                    metrics_chart_options = {
                        tooltip: {},
                        xAxis: {
                            type: "category",
                            data: metrics_names
                        },
                        yAxis: {
                            type: 'value'
                        },
                        legend: {
                            data: metrics_names
                        },

                        series: series
                    };
                    console.log(metrics_chart_options)
                }
            }
            return [parameters_names, parameters_values, metrics_names, metrics_values, metrics_chart_options]
        }
        return [null, null, null, null, null]
    }, [iterationData])

    /**
     * Component rendering.
     * If iterationData is available, it returns single iteration view.
     * If not, it returns loading screen.
     * */
    if (iterationData) {
        return (
            <main id="content">

                <div className="page-path">
                    <h1>Iteration</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item">{iterationData.project_title}</li>
                            <li className="breadcrumb-item"><a href={"/projects/" + project_id + "/experiments"}>Experiments</a></li>
                            <li className="breadcrumb-item">{iterationData.experiment_name}</li>
                            <li className="breadcrumb-item">Iteration</li>
                            <li className="breadcrumb-item active">{iterationData.iteration_name}</li>
                        </ol>
                    </nav>
                </div>

                <section className="iteration-view section content-data">
                    <h4><span className="fw-semibold">{iterationData.iteration_name}</span></h4>
                    <p><span className="fst-italic">Tu mógłby być opis iteracji!</span></p>
                    <div className="row mb-3">
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-2">Iteration ID: {iterationData.id}</div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-2">Creation date: {moment(new Date(iterationData.created_at)).format("DD-MM-YYYY, HH:mm:ss")}</div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-2">User name: {iterationData.user_name}</div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-2">Model name: {iterationData.model_name}</div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-2">Path to model: {iterationData.path_to_model !== "" ? iterationData.path_to_model : '-'}</div>
                    </div>

                    <h5><span className="fw-semibold">Parameters</span></h5>

                    { parameters_names && parameters_names.length > 0 ?

                        <div className="card p-2" style={{overflowX: "auto"}}>
                            <table className="table">
                                <thead>
                                <tr>
                                    {parameters_names && parameters_names.map(param => <th key={param} scope="col">{param}</th>)}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {parameters_names && parameters_values.map(value => <td key={value}>{value}</td>)}
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        :

                        <p><span className="fst-italic">No parameters to show!</span></p>
                    }

                    <h5><span className="fw-semibold">Metrics</span></h5>

                    { metrics_names && metrics_names.length > 0 ?

                        <div className="card p-2" style={{overflowX: "auto"}}>
                            <table className="table">
                                <thead>
                                <tr>
                                    {metrics_names.map(param => <th key={param} scope="col">{param}</th>)}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {metrics_values.map(value => <td key={value}>{value}</td>)}
                                </tr>
                                </tbody>
                            </table>
                            <ReactEcharts option={metrics_chart_options} theme="customed"/>
                        </div>

                        :

                        <p><span className="fst-italic">No metrics to show!</span></p>

                    }

                    <h5><span className="fw-semibold">Custom charts</span></h5>

                    <p><span className="fst-italic">Tu będą wykresy zdefiniowane przez użytkownika!</span></p>

                </section>

            </main>
        )
    } else {
        return (
            <main id="content">

                <div className="page-path">
                    <h1>Iteration</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item">...</li>
                            <li className="breadcrumb-item">Experiments</li>
                            <li className="breadcrumb-item">...</li>
                            <li className="breadcrumb-item">Iteration</li>
                            <li className="breadcrumb-item active">...</li>
                        </ol>
                    </nav>
                </div>

                <section className="iteration-view section content-data">

                    <LoadingData
                        icon={"labs"}
                        dataSection={"iteration"}
                    />

                </section>
            </main>
        );
    }
}

export default Iteration;