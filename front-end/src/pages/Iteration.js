import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LoadingData from "../components/LoadingData";
import moment from "moment/moment";
import Chart from 'react-apexcharts';

import * as echarts from 'echarts';
import { TooltipComponent, GridComponent, LegendComponent, LegendScrollComponent, LegendPlainComponent} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEcharts from "echarts-for-react";

import custom_theme from "../js/customed.json";

echarts.registerTheme('customed', custom_theme)

echarts.use([TooltipComponent, GridComponent, LegendComponent, LegendScrollComponent, LegendPlainComponent, BarChart, CanvasRenderer]);

/**
 * Iteration page component for displaying information about single run and model.
 * */
function Iteration(props) {

    console.log("[DEBUG] ITERATION VIEW !")

    /**
     * State used for rerun REST API request and rerender component after performing an action modifying data in the database.
     * */

    const [refresh, setRefresh] = useState(0);

    /**
     * Get :project_id, :experiment_id, :iteration_id params from url.
     * */
    const {project_id, experiment_id, iteration_id} = useParams();

    /**
     * States used for storing information about project, experiment and iteration.
     * */
    const [iterationData, setIterationData] = useState();
    const [experimentData, setExperimentData] = useState();
    const [projectData, setProjectData] = useState();

    // Funkcja służąca do przekierowania w przypadku braku projektu o podanym identyfikatorze
    let navigate = useNavigate();

    /**
     * REST API request for iteration information based on url params.
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

        // fetch('http://localhost:8000/projects/' + project_id + '/experiments/' + experiment_id)
        //     .then(response => {
        //         if (response.ok) {
        //             return response.json()
        //         }
        //         return Promise.reject(response);
        //     })
        //     .then(data => {
        //         setExperimentData(data)
        //     })
        //     .catch((response) => {
        //         navigate('/projects')
        //     });
        //
        // fetch('http://localhost:8000/projects/' + project_id)
        //     .then(response => {
        //         if (response.ok) {
        //             return response.json()
        //         }
        //         return Promise.reject(response);
        //     })
        //     .then(data => {
        //         setProjectData(data)
        //     })
        //     .catch((response) => {
        //         navigate('/projects')
        //     });
    }, [refresh]);

    const [parameters_names, parameters_values, metrics_names, metrics_values, metrics_chart, options] = useMemo(() => {
        let parameters_names
        let parameters_values
        let metrics_names
        let metrics_values
        let metrics_chart
        let options
        if (iterationData) {
            if (iterationData.parameters) {
                parameters_names = Object.getOwnPropertyNames(iterationData.parameters)
                parameters_values = Object.values(iterationData.parameters)
            }
            if (iterationData.metrics) {
                metrics_names = Object.getOwnPropertyNames(iterationData.metrics)
                metrics_values = Object.values(iterationData.metrics)
                if (metrics_names.length > 0) {
                    metrics_chart = {
                        options: {
                            title: {
                                text: "Metrics",
                                align: 'center',
                            },
                            theme: {
                                palette: 'palette1' // upto palette10
                            },
                            plotOptions: {
                                bar: {
                                    columnWidth: '45%',
                                    distributed: true,
                                }
                            },
                            dataLabels: {
                                enabled: false
                            },
                            chart: {
                                id: 'metrics'
                            },
                            xaxis: {
                                categories: metrics_names,
                            },
                            yaxis: {
                                min: Math.floor(Math.min(...metrics_values)),
                                max: Math.ceil(Math.max(...metrics_values)),
                                title: {
                                    text: "values",
                                },
                                decimalsInFloat: 3,
                            }
                        },
                        series: [
                            {
                                name: 'value',
                                data: metrics_values
                            }
                        ]
                    }
                    options = {
                        tooltip: {},
                        xAxis: {
                            data: metrics_names
                        },
                        yAxis: {
                            type: 'value'
                        },
                        legend: {
                            data: metrics_names
                        },
                        series: [
                            {
                                data: metrics_values,
                                type: 'bar'
                            }
                        ],
                    };
                }
            }
            return [parameters_names, parameters_values, metrics_names, metrics_values, metrics_chart, options]
        }
        return [null, null, null, null, null, null]
    }, [iterationData])

    if (iterationData) {
        return (
            <main id="content">

                <div className="page-path">
                    <h1>Iteration</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item">{project_id}</li>
                            <li className="breadcrumb-item"><a href={"/projects/" + project_id + "/experiments"}>Experiments</a></li>
                            <li className="breadcrumb-item">{experiment_id}</li>
                            <li className="breadcrumb-item">Iteration</li>
                            <li className="breadcrumb-item active">{iterationData.iteration_name}</li>
                        </ol>
                    </nav>
                </div>

                <section className="iteration-view section content-data">
                    <h4><span className="fw-semibold">{iterationData.iteration_name}</span></h4>
                    <p><span className="fst-italic">Tu mógłby być opis iteracji!</span></p>
                    <div className="row mb-3">
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">Iteration ID: {iterationData.id}</div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">Creation date: {moment(new Date(iterationData.created_at)).format("DD-MM-YYYY, HH:mm:ss")}</div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">User name: {iterationData.user_name}</div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">Model name: {iterationData.model_name}</div>
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
                            <div className=" mx-auto">
                                <Chart options={metrics_chart.options} series={metrics_chart.series} type="bar" width={500} height={300} />
                            </div>
                            <ReactEcharts option={options} theme="customed"/>
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