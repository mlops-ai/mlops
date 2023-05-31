import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import LoadingData from "../components/LoadingData";
import moment from "moment/moment";
import * as echarts from 'echarts';
import {
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LegendScrollComponent,
    LegendPlainComponent,
    TransformComponent
} from 'echarts/components';
import {BarChart, BoxplotChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import ReactEcharts from "echarts-for-react";
import custom_theme from "../js/customed.json";
import {toast} from "react-toastify";
import Toast from "../components/Toast";
import chart from "../assets/chart.json";
import box from "../assets/box.json";


import { aggregate } from "echarts-simple-transform";

echarts.registerTransform(aggregate);
/**
 * Echarts register theme and initial configuration.
 * */
echarts.registerTheme('customed', custom_theme)
echarts.use([TooltipComponent, GridComponent, LegendComponent, LegendScrollComponent, LegendPlainComponent, BoxplotChart, BarChart, CanvasRenderer, TransformComponent]);


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
    const [parameters_names, parameters_values, metrics_names, metrics_values, metrics_chart_options, custom_charts] = useMemo(() => {
        let parameters_names
        let parameters_values
        let metrics_names
        let metrics_values
        let metrics_chart_options
        let custom_charts = []

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
                            text: "Metric Chart"
                        },
                        tooltip: {},
                        xAxis: {
                            type: "category",
                            data: metrics_names
                        },
                        yAxis: {
                            type: 'value'
                        },
                        legend: {
                            data: metrics_names,
                            top: 'bottom'
                        },
                        series: series
                    };
                }
            }

            if (chart.length > 0) {

                function onlyNumbers(array) {
                    return array.every(element => {
                        return !isNaN(element);
                    });
                }

                var min_value = (value) => {
                    return Math.floor(value.min, 0);
                }

                var max_value = (value) => {
                    return Math.ceil(value.max, 0);
                }

                chart.forEach((chart_data, index) => {
                    let options;
                    if (chart_data.chart_type === "line") {

                        let x_type = 'value';
                        chart_data.x_data.forEach(data => {
                            if (!onlyNumbers(data)) {
                                x_type = 'category'
                            }
                        })

                        let data = []

                        if (chart_data.x_data.length === 1) {
                            chart_data.y_data.forEach((data_y, index) => {
                                let data_for_series = []
                                chart_data.x_data[0].forEach((value, idx) => {
                                    data_for_series.push([value, data_y[idx]])
                                })
                                data.push(data_for_series)
                            })
                        } else {
                            chart_data.y_data.forEach((data_y, index) => {
                                let data_for_series = []
                                chart_data.x_data[index].forEach((value, idx) => {
                                    data_for_series.push([value, data_y[idx]])
                                })
                                data.push(data_for_series)
                            })
                        }

                        let series_data = [];

                        if (data.length >= 2) {
                            data.forEach((val, index) => {
                                series_data.push(
                                    {
                                        name: chart_data.y_data_names ? chart_data.y_data_names[index] : iterationData.iteration_name + ' (' + (index + 1) + ')',
                                        data: val,
                                        type: chart_data.chart_type,
                                        showSymbol: false,
                                        emphasis: {
                                            focus: 'series'
                                        },
                                    },
                                )
                            })
                        } else {
                            series_data.push(
                                {
                                    name: chart_data.y_data_names ? chart_data.y_data_names[0] : iterationData.iteration_name,
                                    data: data[0],
                                    type: chart_data.chart_type,
                                    showSymbol: false,
                                    emphasis: {
                                        focus: 'series'
                                    },
                                },
                            )
                        }

                        options = {
                            // Tytuł i podtytuł wykresu
                            title: {
                                text: chart_data.chart_title ? chart_data.chart_title : '',
                                subtext: chart_data.chart_subtitle ? chart_data.chart_subtitle : '',
                                left: "center",
                                textStyle: {
                                    fontSize: 18,
                                },
                                subtextStyle: {
                                    fontSize: 16
                                },
                            },
                            // Legenda
                            legend: {
                                top: 'bottom',
                                type: 'scroll',
                                show: true,
                                orient: 'horizontal',
                            },
                            // Siatka
                            grid: {
                                show: true,
                            },
                            // Oś X
                            xAxis: {
                                type: x_type,
                                name: chart_data.x_label ? chart_data.x_label : '',
                                nameLocation: 'center',
                                nameGap: 30,
                                min: chart_data.x_min ? chart_data.x_min : min_value,
                                max: chart_data.x_max ? chart_data.x_max : max_value,
                            },
                            // Oś Y
                            yAxis: {
                                type: 'value',
                                name: chart_data.y_label ? chart_data.y_label : '',
                                nameLocation: 'center',
                                nameGap: 30,
                                min: chart_data.y_min ? chart_data.y_min : min_value,
                                max: chart_data.y_max ? chart_data.y_max : max_value,
                            },
                            // Tooltip
                            tooltip: {
                                trigger: 'axis',
                                // formatter: callback,
                            },
                            // Toolbox
                            toolbox: {
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
                            // Dane
                            series: series_data
                        }
                    } else if (chart_data.chart_type === 'scatter') {
                        var callback = (args) => {
                            return args.marker + args.seriesName + ' (' + args.dataIndex + ')<br />' + '(' + args.data.join(', ') + ')'
                        }

                        let x_type = 'value';
                        chart_data.x_data.forEach(data => {
                            if (!onlyNumbers(data)) {
                                x_type = 'category'
                            }
                        })

                        let data = []

                        if (chart_data.x_data.length === 1) {
                            chart_data.y_data.forEach((data_y, index) => {
                                let data_for_series = []
                                chart_data.x_data[0].forEach((value, idx) => {
                                    data_for_series.push([value, data_y[idx]])
                                })
                                data.push(data_for_series)
                            })
                        } else {
                            chart_data.y_data.forEach((data_y, index) => {
                                let data_for_series = []
                                chart_data.x_data[index].forEach((value, idx) => {
                                    data_for_series.push([value, data_y[idx]])
                                })
                                data.push(data_for_series)
                            })
                        }

                        let series_data = [];

                        if (data.length >= 2) {
                            data.forEach((val, index) => {
                                series_data.push(
                                    {
                                        name: chart_data.y_data_names ? chart_data.y_data_names[index] : iterationData.iteration_name + ' (' + (index + 1) + ')',
                                        data: val,
                                        type: chart_data.chart_type,
                                        showSymbol: false,
                                        emphasis: {
                                            focus: 'series'
                                        },
                                    },
                                )
                            })
                        } else {
                            series_data.push(
                                {
                                    name: chart_data.y_data_names ? chart_data.y_data_names[0] : iterationData.iteration_name,
                                    data: data[0],
                                    type: chart_data.chart_type,
                                    showSymbol: false,
                                    emphasis: {
                                        focus: 'series'
                                    },
                                },
                            )
                        }

                        options = {
                            // Tytuł i podtytuł wykresu
                            title: {
                                text: chart_data.chart_title ? chart_data.chart_title : '',
                                subtext: chart_data.chart_subtitle ? chart_data.chart_subtitle : '',
                                left: "center",
                                textStyle: {
                                    fontSize: 18,
                                },
                                subtextStyle: {
                                    fontSize: 16
                                },
                            },
                            // Legenda
                            legend: {
                                top: 'bottom',
                                type: 'scroll',
                                show: true,
                                orient: 'horizontal',
                            },
                            // Siatka
                            grid: {
                                show: true,
                            },
                            // Oś X
                            xAxis: {
                                type: x_type,
                                name: chart_data.x_label ? chart_data.x_label : '',
                                nameLocation: 'center',
                                nameGap: 30,
                                min: chart_data.x_min ? chart_data.x_min : min_value,
                                max: chart_data.x_max ? chart_data.x_max : max_value,
                            },
                            // Oś Y
                            yAxis: {
                                type: 'value',
                                name: chart_data.y_label ? chart_data.y_label : '',
                                nameLocation: 'center',
                                nameGap: 30,
                                min: chart_data.y_min ? chart_data.y_min : min_value,
                                max: chart_data.y_max ? chart_data.y_max : max_value,
                            },
                            // Tooltip
                            tooltip: {
                                trigger: 'item',
                                formatter: callback,
                            },
                            // Toolbox
                            toolbox: {
                                feature: {
                                    dataZoom: {
                                        show: true,
                                        yAxisIndex: 0
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
                            // Dane
                            series: series_data
                        }
                    } else if (chart_data.chart_type === 'bar') {

                        let series_data = [];

                        if (chart_data.y_data.length >= 2) {
                            chart_data.y_data.forEach((val, index) => {
                                series_data.push(
                                    {
                                        name: chart_data.x_data ? chart_data.x_data[0][index] : iterationData.iteration_name + ' (' + (index + 1) + ')',
                                        data: val,
                                        type: chart_data.chart_type,
                                        showSymbol: false,
                                        emphasis: {
                                            focus: 'series'
                                        },
                                    },
                                )
                            })
                        } else {
                            series_data.push(
                                {
                                    name: chart_data.x_data[0] ? chart_data.x_data[0][0] : iterationData.iteration_name,
                                    type: chart_data.chart_type,
                                    showSymbol: false,
                                    emphasis: {
                                        focus: 'series'
                                    },
                                },
                            )
                        }

                        options = {
                            // Tytuł i podtytuł wykresu
                            title: {
                                text: chart_data.chart_title ? chart_data.chart_title : '',
                                subtext: chart_data.chart_subtitle ? chart_data.chart_subtitle : '',
                                left: "center",
                                textStyle: {
                                    fontSize: 18,
                                },
                                subtextStyle: {
                                    fontSize: 16
                                },
                            },
                            // Legenda
                            legend: {
                                top: 'bottom',
                                type: 'scroll',
                                show: true,
                                orient: 'horizontal',
                            },
                            // Siatka
                            grid: {
                                show: true,
                            },
                            // Oś X
                            xAxis: {
                                type: 'category',
                                data: chart_data.x_data[0],
                                name: chart_data.x_label ? chart_data.x_label : '',
                                nameLocation: 'center',
                                nameGap: 30,
                            },
                            // Oś Y
                            yAxis: {
                                type: 'value',
                                name: chart_data.y_label ? chart_data.y_label : '',
                                nameLocation: 'center',
                                nameGap: 30,
                            },
                            // Tooltip
                            tooltip: {
                                trigger: 'item'
                            },
                            // Toolbox
                            toolbox: {
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
                            // Dane
                            series: series_data
                        }
                    } else if (chart_data.chart_type === 'pie') {
                        var callback = (args) => {
                            return args.marker + args.seriesName + ' (' + args.dataIndex + ')<br />' + '(' + args.data.join(', ') + ')'
                        }

                        let data = [];

                        chart_data.x_data[0].forEach((name, index) => {
                            data.push(
                                {
                                    value: chart_data.y_data[0][index],
                                    name: name
                                }
                            )
                        })

                        console.log(data)

                        let series_data = [];

                        series_data.push(
                            {
                                data: data,
                                type: chart_data.chart_type,
                                radius: '50%',
                                emphasis: {
                                    focus: 'series'
                                },
                            },
                        )

                        options = {
                            // Tytuł i podtytuł wykresu
                            title: {
                                text: chart_data.chart_title ? chart_data.chart_title : '',
                                subtext: chart_data.chart_subtitle ? chart_data.chart_subtitle : '',
                                left: "center",
                                textStyle: {
                                    fontSize: 18,
                                },
                                subtextStyle: {
                                    fontSize: 16
                                },
                            },
                            // Legenda
                            legend: {
                                top: 'bottom',
                                type: 'scroll',
                                show: true,
                                orient: 'horizontal',
                            },
                            // Siatka
                            grid: {
                                show: false,
                            },
                            // Tooltip
                            tooltip: {
                                trigger: 'item',
                            },
                            // Toolbox
                            toolbox: {
                                feature: {
                                    restore: {
                                        show: true,
                                    },
                                    saveAsImage: {},
                                }
                            },
                            // Dane
                            series: series_data
                        }
                    } else if (chart_data.chart_type === "boxplot") {
                        options = {
                            // Tytuł i podtytuł wykresu
                            title: {
                                text: chart_data.chart_title ? chart_data.chart_title : '',
                                subtext: chart_data.chart_subtitle ? chart_data.chart_subtitle : '',
                                left: "center",
                                textStyle: {
                                    fontSize: 18,
                                },
                                subtextStyle: {
                                    fontSize: 16
                                },
                            },
                            // Legenda
                            legend: {
                                top: 'bottom',
                                type: 'scroll',
                                show: true,
                                orient: 'horizontal',
                            },
                            // Siatka
                            grid: {
                                show: false,
                            },
                            // Tooltip
                            tooltip: {
                                trigger: 'item',
                            },
                            // Oś X
                            xAxis: {
                                type: 'value',
                            },
                            // Oś Y
                            yAxis: {
                                type: 'category',
                                data: chart_data.x_data[0],
                            },
                            // Toolbox
                            toolbox: {
                                feature: {
                                    restore: {
                                        show: true,
                                    },
                                    saveAsImage: {},
                                }
                            },
                            // Dane
                            series: {
                                type: 'boxplot',
                                data: chart_data.y_data,
                                itemStyle: {
                                    color: '#b8c5f2'
                                },
                                encode: {
                                    tooltip: [1, 2, 3, 4, 5],
                                    x: [1, 2, 3, 4, 5],
                                    y: 0,
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                            }
                        }
                    }
                    custom_charts.push(
                        <div className="card p-2">
                            <ReactEcharts option={options}/>
                        </div>
                    )

                })
            }

            let box_plot_data = [["Column", "Value"]]

            box.data.forEach((values, index) => {
                values.forEach((val, idx) => {
                    box_plot_data.push(
                        [box.columns[idx], val]
                    )
                })
            })

            console.log(box_plot_data)

            let options = {
                dataset: [
                    {
                        id: 'data',
                        source: box_plot_data
                    },
                    {
                        id: 'income_aggregate',
                        fromDatasetId: 'data',
                        transform: [
                            {
                                type: 'ecSimpleTransform:aggregate',
                                config: {
                                    resultDimensions: [
                                        { name: 'min', from: 'Value', method: 'min' },
                                        { name: 'Q1', from: 'Value', method: 'Q1' },
                                        { name: 'median', from: 'Value', method: 'median' },
                                        { name: 'Q3', from: 'Value', method: 'Q3' },
                                        { name: 'max', from: 'Value', method: 'max' },
                                        { name: 'Column', from: 'Column' }
                                    ],
                                    groupBy: 'Column'
                                }
                            },
                            {
                                type: 'sort',
                                config: {
                                    dimension: 'Q3',
                                    order: 'asc'
                                }
                            }
                        ]
                    }
                ],
                title: {
                    text: 'Rozkład wartości atrybutów',
                    subtext: 'Diabetes dataset',
                    left: "center",
                    textStyle: {
                        fontSize: 18,
                    },
                    subtextStyle: {
                        fontSize: 16
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    confine: true
                },
                xAxis: {
                    name: 'Rozkład',
                    nameLocation: 'middle',
                    nameGap: 30,
                    scale: true
                },
                yAxis: {
                    type: 'category'
                },
                grid: {
                    bottom: 100
                },
                legend: {
                    selected: {
                        detail: false
                    },
                    top: 'bottom',
                    type: 'scroll',
                    show: true,
                    orient: 'horizontal',
                },
                series: [
                    {
                        name: 'boxplot',
                        type: 'boxplot',
                        datasetId: 'income_aggregate',
                        itemStyle: {
                            color: '#b8c5f2'
                        },
                        encode: {
                            x: ['min', 'Q1', 'median', 'Q3', 'max'],
                            y: 'Column',
                            itemName: ['Column'],
                            tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
                        },
                        emphasis: {
                            focus: 'series'
                        },
                    },
                    {
                        name: 'data',
                        type: 'scatter',
                        datasetId: 'data',
                        showSymbol: true,
                        tooltip: {
                            trigger: 'item'
                        },
                        encode: {
                            x: 'Value',
                            y: 'Column',
                            tooltip: ['Kolumna', 'Value']
                        },
                        emphasis: {
                            focus: 'series'
                        },
                    }
                ]
            };
            custom_charts.push(
                <div className="card p-2">
                    <ReactEcharts option={options} style={{height: '400px', width: '100%'}}/>
                </div>
            )


            if (iterationData.interactive_charts) {
                // console.log(iterationData)
                // iterationData.interactive_charts.forEach(chart_data => {
                //     let options;

                // options = {
                //
                //     // Tytuł oraz podtytuł wykresu
                //
                //     // Panel narzędzi
                //     toolbox: {
                //         feature: {
                //             dataZoom: {
                //                 show: true,
                //                 yAxisIndex: 0
                //             },
                //             brush: {
                //                 type: 'polygon',
                //             },
                //             restore: {
                //                 show: true,
                //             },
                //             saveAsImage: {},
                //         }
                //     },
                // }

                // if (chart_data.chart_type === 'scatter') {
                //     let data = []
                //
                //     var callback = (args) => {
                //         return args.marker + args.seriesName + ' (' + args.dataIndex +')<br />' + '(' + args.data.join(', ') + ')'
                //     }
                //
                //     chart_data.x_data.forEach((value, index) => {
                //         data.push([chart_data.x_data[index], chart_data.y_data[index]])
                //     })
                //
                //     options = {
                //         toolbox: {
                //             feature: {
                //                 dataZoom: {
                //                     show: true,
                //                     yAxisIndex: 0
                //                 },
                //                 brush: {
                //                     type: 'polygon',
                //                 },
                //                 restore: {
                //                     show: true,
                //                 },
                //                 saveAsImage: {},
                //             }
                //         },
                //         title: {
                //             left: 'center',
                //             text: chart_data.chart_name ? chart_data.chart_name : '',
                //         },
                //         tooltip: {
                //             trigger: 'item',
                //             formatter: callback,
                //         },
                //         legend: {
                //             top: 'bottom'
                //         },
                //         yAxis: {
                //             type: 'value',
                //             name: chart_data.y_label,
                //             nameLocation: 'center',
                //             nameGap: 30,
                //         },
                //         xAxis: {
                //             type: 'value',
                //             name: chart_data.x_label,
                //             nameLocation: 'center',
                //             nameGap: 30,
                //         },
                //         series: [
                //             {
                //                 name: iterationData.iteration_name,
                //                 data: data,
                //                 type: chart_data.chart_type,
                //             },
                //         ]
                //     }
                //     custom_charts.push(
                //         <div className="card p-2">
                //             <ReactEcharts option={options} theme="customed"/>
                //         </div>
                //     )
                // } else if (chart_data.chart_type === 'line') {
                //
                // let data = []
                // let data_2 = []
                //
                // var callback = (args) => {
                //     let tooltip_data = ''
                //     if (args.length >= 2) {
                //         args.forEach(arg => {
                //             // (arg.dataIndex + 1)
                //             tooltip_data += arg.marker + arg.seriesName + '&nbsp;&nbsp;&nbsp;&nbsp;<b>' + arg.data[1] + '</b><br />';
                //         })
                //     }
                //     return tooltip_data
                // }
                //
                // var min_value = (value) => {
                //     return Math.floor(value.min, 0);
                // }
                //
                // var max_value = (value) => {
                //     return Math.ceil(value.max, 0);
                // }
                //
                // let x_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
                // let y_data1 = [50.5319088547726, 10.628320563828309, 97.71336390119409, 16.609415565783927, 89.3264783839213, 77.72534422975275, 9.538739530190732, 15.756073457550347, 17.970687728198044, 21.10151539942923, 6.242549753890958, 88.16240393450107, 89.59573407392311, 92.88119580581031, 22.841700060253377, 94.10310307716594, 35.80651107830912, 80.82840528766017, 81.3911034817555, 48.027026028713614, 96.29614581718944, 44.79618007560693, 70.99562693804678, 51.57206560434655, 94.70764289124352, 27.124391062202736, 95.28140962217688, 55.612457564597996, 89.09180332950353, 52.63932621555425, 40.83179873215486, 46.95076811275989, 18.319593699463653, 44.018179594306474, 11.057623560531093, 97.27464975121156, 68.44091429672183, 28.13570336597303, 26.180006920469534, 67.26288131649464, 59.52070573851421, 89.58278446227375, 60.34911784102416, 60.148613380660365, 5.126469218510998, 44.94371982658368, 31.18829643849366, 66.66224334617779, 46.21509088150386, 51.91727306148714, 47.17813128087482, 6.861338073557088, 64.89729867242664, 54.304577934774464, 80.44605888956579, 46.1839553262031, 82.38877874773777, 4.789243395704101, 39.252000756802474, 60.150435213845086, 12.526460119091187, 1.5794534165637364, 15.97073660388012, 26.50892419201095, 52.133911554939836, 70.45307965893818, 94.80307406402055, 35.853096897198334, 70.08613654189054, 75.0928396046642, 18.37094309331918, 91.3214318635519, 69.95640597197183, 23.321000319454633, 99.2086502048956, 5.699863483699607, 70.16080706786927, 42.26060420480729, 51.93463166006506, 0.5397272848591039, 87.44623579849807, 83.65033462944416, 45.525186770425364, 19.526285261496422, 50.21727395455732, 72.15419494152214, 81.18761000415586, 44.47380742251899, 74.38967150874724, 10.72972062615446, 5.051473672478279, 22.3197044136075, 14.158076664284147, 50.80086383309688, 63.0566388214129, 9.892967666571828, 91.32217603427729, 79.51864846109417, 1.1890815715341563, 96.75227783641212];
                // let y_data2 = [54.19944565857624, 56.47467879794439, 43.380612079011414, 87.65924882996815, 86.04900047057998, 18.193776963868345, 72.31769697796607, 9.287011728976957, 66.02417369771977, 25.964173951206902, 86.18439969451784, 75.24694533138924, 55.36109910795282, 23.367001766925412, 64.3488971113337, 19.148064504911567, 53.47911191688163, 41.93598585068021, 47.74563032556133, 89.80800240461234, 39.50484325420863, 21.37460660959578, 31.214704910238943, 94.72122375483069, 25.158116729248505, 54.879124949638516, 55.27010646768863, 40.37244818158919, 10.514889609954059, 59.16183496652734, 14.541550336851806, 28.91316904258151, 82.94002800149435, 3.807177871815559, 69.56983748422346, 60.983181892182145, 62.99880565392558, 19.558415633572636, 93.96434774163308, 20.658996529317264, 98.24882946725671, 5.145361057435272, 50.201193304531024, 64.14781268720998, 50.35985524766484, 43.726138827959545, 10.61036213033766, 36.6087574004994, 32.51282311987713, 32.313237424668486, 73.27315072425816, 9.897228155775363, 11.477028077883366, 67.7794600762415, 41.893591522731256, 64.46397789817402, 45.80290295274635, 91.38023283827621, 45.55482773508469, 67.94687273054194, 70.26340839838952, 21.69372277671514, 77.73600723603953, 91.84868079068472, 64.92275844580223, 93.35750885679207, 58.21613060411717, 78.7186839648701, 4.129688929737563, 74.04284712919186, 84.2104217699742, 79.78463269292051, 55.371414076481884, 0.3385513965560416, 72.57348349852151, 4.774023728695687, 6.470987967707864, 81.39364442244435, 47.53425309947219, 98.26109225599153, 49.81404301941089, 83.4944214605356, 66.8641981232738, 51.40973771729907, 84.31084843413221, 88.7217767258137, 92.36808906366622, 73.91890118188441, 14.293995742803023, 8.444047435572399, 72.16040576572999, 22.83108047714908, 79.71558943911272, 9.150023724155165, 18.367561171653037, 25.313494054144403, 6.883470783916479, 56.14953852177017, 34.11659012874767, 72.77412080453301];
                //
                // x_data.forEach((value, index) => {
                //     data.push([x_data[index], y_data1[index]])
                // })
                //
                // x_data.forEach((value, index) => {
                //     data_2.push([x_data[index], y_data2[index]])
                // })
                //
                // options = {
                //     // Tytuł i podtytuł wykresu
                //     title: {
                //         text: "Błąd na zbiorze uczącym i testowym",
                //         subtext: "100 epok uczenia",
                //         left: "center",
                //         textStyle: {
                //             fontSize: 18,
                //         },
                //         subtextStyle: {
                //             fontSize: 16
                //         },
                //     },
                //     // Legenda
                //     legend: {
                //         top: 'bottom',
                //         type: 'scroll',
                //         show: true,
                //         orient: 'horizontal',
                //     },
                //     // Siatka
                //     grid: {
                //         show: true,
                //     },
                //     // Oś X
                //     xAxis: {
                //         type: 'value',
                //         name: "epoch",
                //         nameLocation: 'center',
                //         nameGap: 30,
                //         min: chart_data.x_min ? chart_data.x_min : min_value,
                //         max: chart_data.x_max ? chart_data.x_max : max_value,
                //     },
                //     // Oś Y
                //     yAxis: {
                //         type: 'value', // 'category'
                //         name: "loss",
                //         nameLocation: 'center',
                //         nameGap: 30,
                //         min: chart_data.y_min ? chart_data.y_min : min_value,
                //         max: chart_data.y_max ? chart_data.y_max : max_value,
                //     },
                //     // Tooltip
                //     tooltip: {
                //         trigger: 'axis',
                //         // formatter: callback,
                //     },
                //     // Toolbox
                //     toolbox: {
                //         feature: {
                //             dataZoom: {
                //                 show: true,
                //                 yAxisIndex: "none"
                //             },
                //             brush: {
                //                 type: 'polygon',
                //             },
                //             restore: {
                //                 show: true,
                //             },
                //             saveAsImage: {},
                //         }
                //     },
                //     // Dane
                //     series: [
                //         {
                //             name: iterationData.iteration_name + ' - 1',
                //             // name: 'training loss',
                //             data: data,
                //             type: chart_data.chart_type,
                //             showSymbol: false
                //         },
                //         {
                //             // name: 'validation loss',
                //             name: iterationData.iteration_name + ' - 2',
                //             data: data_2,
                //             type: chart_data.chart_type,
                //             showSymbol: false
                //         },
                //     ]
                // }
                // custom_charts.push(
                //     <div className="card p-2">
                //         <ReactEcharts option={options} theme="customed"/>
                //     </div>
                // )
                // } else if (chart_data.chart_type === 'bar') {
                //     options = {
                //         toolbox: {
                //             feature: {
                //                 dataZoom: {
                //                     show: true,
                //                     yAxisIndex: "none"
                //                 },
                //                 brush: {
                //                     type: 'polygon',
                //                 },
                //                 restore: {
                //                     show: true,
                //                 },
                //                 saveAsImage: {},
                //             }
                //         },
                //         title: {
                //             left: 'center',
                //             text: chart_data.chart_name ? chart_data.chart_name : '',
                //         },
                //         tooltip: {
                //             trigger: 'item',
                //         },
                //         legend: {
                //             top: 'bottom'
                //         },
                //         yAxis: {
                //             type: 'value',
                //             name: chart_data.y_label,
                //             nameLocation: 'center',
                //             nameGap: 30,
                //         },
                //         xAxis: {
                //             type: 'category',
                //             data: chart_data.x_data,
                //             name: chart_data.x_label,
                //             nameLocation: 'center',
                //             nameGap: 30,
                //         },
                //         series: [
                //             {
                //                 name: iterationData.iteration_name,
                //                 data: chart_data.y_data,
                //                 type: chart_data.chart_type,
                //             },
                //         ]
                //     }
                //     custom_charts.push(
                //         <div className="card p-2">
                //             <ReactEcharts option={options} theme="customed"/>
                //         </div>
                //     )
                // }
                // })

            }
            return [parameters_names, parameters_values, metrics_names, metrics_values, metrics_chart_options, custom_charts]
        }
        return [null, null, null, null, null, null]
    }, [iterationData])

    console.log(iterationData)

    /**
     * Component rendering.
     * If iterationData is available, it returns single iteration view.
     * If not, it returns loading screen.
     * */
    if (iterationData) {
        return (
            <main id="content">

                <div className="page-path">
                    <h1 className="d-flex align-items-center">
                        <span className="fw-semibold">
                            {iterationData.iteration_name}
                        </span>
                        <span className="project-info-id d-flex align-items-center" style={{fontWeight: "normal"}}>
                            @{iterationData.id}
                            <span className="material-symbols-rounded" title="Copy iteration id" onClick={
                                () => {
                                    toast.success('Copied to clipboard!', {
                                        position: "bottom-center",
                                        autoClose: 1000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: false,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                    });
                                    navigator.clipboard.writeText(iterationData.id)
                                }
                            }>
                                content_copy
                            </span>
                        </span>
                    </h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                            <li className="breadcrumb-item">{iterationData.project_title}</li>
                            <li className="breadcrumb-item"><a
                                href={"/projects/" + project_id + "/experiments"}>Experiments</a></li>
                            <li className="breadcrumb-item">{iterationData.experiment_name}</li>
                            <li className="breadcrumb-item">Iteration</li>
                            <li className="breadcrumb-item active">{iterationData.iteration_name}</li>
                        </ol>
                    </nav>
                </div>

                <section className="iteration-view section content-data">
                    <h5><span className="fw-semibold">Iteration details</span></h5>
                    <p><span className="fst-italic">Tu mógłby być opis iteracji!</span></p>
                    <div className="card p-2 table-responsive">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Creation Date</th>
                                    <th>Last Modification</th>
                                    <th>User</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{moment(new Date(iterationData.created_at)).format("DD-MM-YYYY, HH:mm:ss")}</td>
                                    <td>{moment(new Date(iterationData.updated_at)).format("DD-MM-YYYY, HH:mm:ss")}</td>
                                    <td>{iterationData.user_name}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h5><span className="fw-semibold">Model details</span></h5>
                    <div className="card p-2">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Model Name</th>
                                    <th>Model Path</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{iterationData.model_name}</td>
                                    <td>{iterationData.path_to_model !== "" ? iterationData.path_to_model : '-'}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h5><span className="fw-semibold">Dataset details</span></h5>

                    {iterationData.dataset ?
                        <div className="card p-2">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Dataset Name</th>
                                        <th>Dataset Version</th>
                                        <th>Dataset Path</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{iterationData.dataset.name}</td>
                                        <td>{iterationData.dataset.version !== "" ? iterationData.dataset.version : '-'}</td>
                                        <td>{iterationData.dataset.path_to_dataset !== "" ? iterationData.dataset.path_to_dataset : '-'}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        :

                        <p><span className="fst-italic">No dataset details to show!</span></p>
                    }

                    <h5><span className="fw-semibold">Parameters</span></h5>

                    {parameters_names && parameters_names.length > 0 ?

                        <div className="card p-2">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        {parameters_names && parameters_names.map(param => <th key={param}
                                                                                               scope="col">{param}</th>)}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        {parameters_names && parameters_values.map(value => <td
                                            key={value}>{value}</td>)}
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        :

                        <p><span className="fst-italic">No parameters to show!</span></p>
                    }

                    <h5><span className="fw-semibold">Metrics</span></h5>

                    {metrics_names && metrics_names.length > 0 ?

                        <>
                            <div className="card p-2">
                                <div className="table-responsive">
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
                                </div>
                            </div>

                            <div className="card p-2">
                                <ReactEcharts option={metrics_chart_options} theme="customed"/>
                            </div>
                        </>

                        :

                        <p><span className="fst-italic">No metrics to show!</span></p>

                    }

                    <h5><span className="fw-semibold">Custom charts</span></h5>

                    {custom_charts.length > 0 ?
                        custom_charts

                        :

                        <p><span className="fst-italic">No custom charts to show!</span></p>
                    }

                </section>

                <Toast/>

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