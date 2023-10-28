import { useEffect, useMemo, useRef, useState } from "react";

import ReactEcharts from "echarts-for-react";
import { useTheme } from "@/components/providers/theme-provider";

import Lightbox from "@/components/image-lightbox/image-lightbox";
import "@/components/image-lightbox/light-box.css";

import Masonry from "react-masonry-css";
import { breakpointsMasonryImageCharts } from "@/config/breakpoints";
import ImageChart from "@/components/image-charts/image-chart";
import { useData } from "@/hooks/use-data-hook";
import { Iteration } from "@/types/iteration";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Keyable } from "@/types/types";
import { GoIterations } from "react-icons/go";
import Loading from "@/components/icons/loading";
import { Experiment } from "@/types/experiment";
import DataTableContainer from "@/components/data-table/data-table-container";
import DataTableContent from "@/components/data-table/data-table-content";
import DataTableRowWithHeader from "@/components/data-table/data-table-row-compare";
import moment from "moment-timezone";
import { VscProject } from "react-icons/vsc";
import { LayoutDashboard } from "lucide-react";
import PageHeader from "@/components/page-header";
import Breadcrumb from "@/components/breadcrumb";
import { addDuplicateNumber, dataImageType, transposeArray } from "@/lib/utils";
import { metricsComparationChartOptionsGenerator } from "@/pages/iterations/compare-iterations/metrics-chart-options";

const CompareIterations = () => {
    /**
     * React ref hooks for simultaneous scrolling multiple sections.
     */
    const iterations_data = useRef<HTMLDivElement>(null);
    const models_data = useRef<HTMLDivElement>(null);
    const datasets_data = useRef<HTMLDivElement>(null);
    const parameters_data = useRef<HTMLDivElement>(null);
    const metrics_data = useRef<HTMLDivElement>(null);

    const { theme } = useTheme();
    const data = useData();
    const [searchParams] = useSearchParams({
        iterations: "",
    });
    const navigate = useNavigate();

    const { project_id } = useParams();

    // console.log(project_id);
    // console.log(location.pathname);

    /**
     * State used for storing lightbox data (image charts viewer).
     * */
    const [status, setStatus] = useState({
        isOpen: false,
        key: 0,
    });

    const [iterationsData, setIterationsData] = useState<Keyable | null>(null);

    useEffect(() => {
        if (data.projects) {
            /**
             * Find project by project_id from url.
             * */
            // console.log(project_id);
            const project = data.projects.find(
                (project) => project._id === project_id
            );

            if (!project) {
                return navigate(
                    `/projects${
                        searchParams.get("ne") !== "default"
                            ? `?ne=${searchParams.get("ne")}`
                            : ""
                    }`
                );
            }

            /**
             * Parse iterations from search params.
             * */
            let iterations_from_search_params: Keyable;

            try {
                iterations_from_search_params = JSON.parse(
                    searchParams.get("iterations") as string
                );
            } catch (e) {
                return navigate(
                    `/projects/${project_id}/experiments${
                        searchParams.get("ne") !== "default"
                            ? `?ne=${searchParams.get("ne")}`
                            : ""
                    }`
                );
            }

            let experiment_ids: string[] = Object.getOwnPropertyNames(
                iterations_from_search_params
            );

            let experiments = project.experiments.filter((experiment) => {
                return experiment_ids.includes(experiment.id);
            });

            let iterations = experiments.map((experiment: Experiment) => {
                return {
                    ...experiment,
                    iterations: experiment.iterations.filter((iteration) =>
                        iterations_from_search_params[experiment.id].includes(
                            iteration.id
                        )
                    ),
                };
            });

            let iterations_list: Iteration[] = iterations
                .map((experiment) => experiment.iterations)
                .flat();

            if (iterations_list.length < 2) {
                return navigate(
                    `/projects/${project_id}/experiments${
                        searchParams.get("ne") !== "default"
                            ? `?ne=${searchParams.get("ne")}`
                            : ""
                    }`
                );
            }

            setIterationsData({
                iterations: iterations_list,
                project_title: project.title,
                numberOfExperiments: experiments.length,
            });
        }
    }, [data.projects]);

    const [
        iterationsDetails,
        modelsDetails,
        datasetsDetails,
        parameters,
        metrics,
        metricsChart,
        imageCharts,
    ] = useMemo(() => {
        if (iterationsData) {
            let ids: string[] = [];
            let iterations_names: string[] = [];
            let experiments_names: string[] = [];
            let created_dates: string[] = [];
            let run_by: string[] = [];

            let models_paths: string[] = [];

            let datasets_names: string[] = [];
            let datasets_versions: string[] = [];

            let parameters: any[] = [];
            let metrics: any[] = [];

            let metrics_chart: Keyable = {};

            let image_charts: Keyable[] = [];
            let image_charts_sources: Keyable[] = [];

            iterationsData.iterations.forEach((iteration: Iteration) => {
                ids.push(iteration.id);
                iterations_names.push(iteration.iteration_name);
                experiments_names.push(iteration.experiment_name);
                created_dates.push(
                    moment(iteration.created_at).format("DD.MM.YYYY, HH:mm")
                );
                run_by.push(iteration.user_name);

                models_paths.push(
                    iteration.path_to_model !== ""
                        ? iteration.path_to_model
                        : "-"
                );

                datasets_names.push(
                    iteration.dataset ? iteration.dataset.name : "-"
                );
                datasets_versions.push(
                    iteration.dataset && iteration.dataset.version !== ""
                        ? iteration.dataset.version
                        : "-"
                );

                parameters.push(
                    iteration.parameters
                        ? Object.getOwnPropertyNames(iteration.parameters)
                        : []
                );
                metrics.push(
                    iteration.metrics
                        ? Object.getOwnPropertyNames(iteration.metrics)
                        : []
                );
            });

            /**
             * Find iterations with duplicated names and add number to the end of the name.
             */
            iterations_names = addDuplicateNumber(iterations_names);

            /**
             * Prepare parameters data
             */

            let parametersUniqueSet = new Set();
            let parametersValuesArrays: any[] = [];
            let parametersUniqueArray: any[] = [];

            if (parameters.length > 0) {
                parameters.forEach((data) =>
                    data.forEach((parameter: string) => {
                        parametersUniqueSet.add(parameter);
                    })
                );

                parametersUniqueArray = Array.from(parametersUniqueSet);

                if (parametersUniqueArray.length > 0) {
                    parametersUniqueArray.forEach((parameter: any) => {
                        let parametersValues: (string | number)[] = [];
                        iterationsData.iterations.forEach(
                            (iteration: Iteration) => {
                                if (
                                    iteration.parameters &&
                                    iteration.parameters[parameter]
                                ) {
                                    parametersValues.push(
                                        iteration.parameters[parameter]
                                    );
                                } else {
                                    parametersValues.push("-");
                                }
                            }
                        );
                        parametersValuesArrays.push(parametersValues);
                    });
                }
            }

            /**
             * Prepare metrics data
             */

            let metricsUniqueSet = new Set();
            let metricsUniqueArray: any[] = [];
            let metricsValuesArrays: any[] = [];

            if (metrics.length > 0) {
                metrics.forEach((data) =>
                    data.forEach((metric: string) => {
                        metricsUniqueSet.add(metric);
                    })
                );

                metricsUniqueArray = Array.from(metricsUniqueSet);

                if (metricsUniqueArray.length > 0) {
                    metricsUniqueArray.forEach((metric: any) => {
                        let metricsValues: (string | number)[] = [];
                        iterationsData.iterations.forEach(
                            (iteration: Iteration) => {
                                if (
                                    iteration.metrics &&
                                    iteration.metrics[metric]
                                ) {
                                    metricsValues.push(
                                        iteration.metrics[metric]
                                    );
                                } else {
                                    metricsValues.push("-");
                                }
                            }
                        );
                        metricsValuesArrays.push(metricsValues);
                    });

                    /**
                     * Prepare metrics chart data
                     **/
                    const metricsValuesArraysTransposed =
                        transposeArray(metricsValuesArrays);

                    const series: Keyable[] = metricsValuesArraysTransposed.map(
                        (values: any, index: number) => {
                            return {
                                name: iterations_names[index],
                                data: values,
                                type: "bar",
                                emphasis: {
                                    focus: "series",
                                },
                            };
                        }
                    );

                    metrics_chart = metricsComparationChartOptionsGenerator(
                        theme,
                        metricsUniqueArray as string[],
                        series
                    );
                }
            }

            /**
             * Prepare image charts data
             */
            let imageChartsCount = 0;
            let imageChartsCountCumsum: number[] = [];
            let imageChartsListPerIteration: Keyable[] =
                iterationsData.iterations.map(
                    (iteration: Iteration, index: number) => {
                        if (
                            iteration.image_charts &&
                            iteration.image_charts.length !== 0
                        ) {
                            let filtered_charts = iteration.image_charts.filter(
                                (chart) => chart.comparable
                            );
                            imageChartsCount += filtered_charts.length;
                            imageChartsCountCumsum.push(imageChartsCount);
                            return {
                                charts: filtered_charts,
                                iteration_name: iterations_names[index],
                            };
                        }
                        return { charts: [], iteration_name: "" };
                    }
                );

            imageChartsListPerIteration = imageChartsListPerIteration.filter(
                (iteration) => iteration.charts.length !== 0
            );

            imageChartsCountCumsum.unshift(0);

            imageChartsListPerIteration.forEach(
                (iterationImageCharts: Keyable, idx: number) => {
                    let chartsPerIteration: React.ReactNode[] = [];

                    iterationImageCharts.charts.forEach(
                        (image_chart: Keyable, index: number) => {
                            let encoded_image = image_chart.encoded_image;
                            const data_image_type =
                                dataImageType(encoded_image);

                            if (data_image_type) {
                                chartsPerIteration.push(
                                    <ImageChart
                                        key={
                                            imageChartsCountCumsum[idx] + index
                                        }
                                        index={
                                            imageChartsCountCumsum[idx] + index
                                        }
                                        data_image_type={data_image_type}
                                        encoded_image={encoded_image}
                                        chart_name={image_chart.name}
                                        setStatus={setStatus}
                                    />
                                );

                                image_charts_sources.push({
                                    title: `${image_chart.name} @${iterationImageCharts.iteration_name}`,
                                    url: `${data_image_type},${encoded_image}`,
                                });
                            }
                        }
                    );
                    image_charts.push({
                        iteration_name: iterationImageCharts.iteration_name,
                        charts: chartsPerIteration,
                    });
                }
            );

            return [
                {
                    ids,
                    iterations_names,
                    experiments_names,
                    created_dates,
                    run_by,
                },
                {
                    models_paths,
                },
                {
                    datasets_names,
                    datasets_versions,
                },
                {
                    parametersUniqueArray,
                    parametersValuesArrays,
                },
                {
                    metricsUniqueArray,
                    metricsValuesArrays,
                },
                metrics_chart,
                {
                    image_charts,
                    image_charts_sources,
                },
            ];
        }

        return [null, null, null, null, null, null, null];
    }, [iterationsData, theme]);

    if (!data.projects || !iterationsData) {
        return (
            <>
                <div className="mb-4">
                    <PageHeader title="..." />
                    <Breadcrumb
                        items={[
                            {
                                name: "Projects",
                                Icon: LayoutDashboard,
                                href: "/projects",
                            },
                            {
                                name: "...",
                                Icon: VscProject,
                            },
                            {
                                name: "Compare iterations",
                                Icon: GoIterations,
                            },
                        ]}
                    />
                </div>
                <div className="flex flex-col items-center justify-center m-32">
                    <GoIterations className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                    <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                        Loading iterations data ...
                    </p>
                    <p className="text-sm text-center">Please, be patient.</p>
                    <Loading className="w-10 h-10 mt-8 animate-spin text-mlops-primary dark:text-mlops-primary-tx-dark" />
                </div>
            </>
        );
    }

    return (
        <div className="relative">
            <div className="mb-4">
                <PageHeader
                    title={`Comparing ${
                        iterationsData.iterations.length
                    } runs from ${
                        iterationsData.numberOfExperiments
                    } experiment${
                        iterationsData.numberOfExperiments > 1 ? "s" : ""
                    }`}
                    className="h-10"
                />
                <Breadcrumb
                    items={[
                        {
                            name: "Projects",
                            Icon: LayoutDashboard,
                            href: "/projects",
                        },
                        {
                            name: iterationsData.project_title as string,
                            Icon: VscProject,
                            href: `/projects/${project_id}/experiments`,
                        },
                        {
                            name: "Compare iterations",
                            Icon: GoIterations,
                        },
                    ]}
                />
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">
                        Iterations details
                    </h5>
                    <DataTableContainer
                        refContainer={iterations_data}
                        refs={[models_data, datasets_data, parameters_data, metrics_data]}
                    >
                        <DataTableContent>
                            <DataTableRowWithHeader
                                header="Iteration ID"
                                cells={iterationsDetails?.ids as string[]}
                            />
                            <DataTableRowWithHeader
                                header="Iteration Name"
                                cells={
                                    iterationsDetails?.iterations_names as string[]
                                }
                            />
                            <DataTableRowWithHeader
                                header="Experiment Name"
                                cells={
                                    iterationsDetails?.experiments_names as string[]
                                }
                            />
                            <DataTableRowWithHeader
                                header="Created"
                                cells={
                                    iterationsDetails?.created_dates as string[]
                                }
                            />
                            <DataTableRowWithHeader
                                header="Run By"
                                cells={iterationsDetails?.run_by as string[]}
                            />
                        </DataTableContent>
                    </DataTableContainer>
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Models details</h5>
                    <DataTableContainer refContainer={models_data} refs={[iterations_data, datasets_data, parameters_data, metrics_data]}>
                        <DataTableContent>
                            <DataTableRowWithHeader
                                header="Model Path"
                                cells={modelsDetails?.models_paths as string[]}
                            />
                        </DataTableContent>
                    </DataTableContainer>
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Datasets details</h5>
                    <DataTableContainer refContainer={datasets_data}>
                        <DataTableContent>
                            <DataTableRowWithHeader
                                header="Dataset Name"
                                cells={
                                    datasetsDetails?.datasets_names as string[]
                                }
                            />
                            <DataTableRowWithHeader
                                header="Dataset Version"
                                cells={
                                    datasetsDetails?.datasets_versions as string[]
                                }
                            />
                        </DataTableContent>
                    </DataTableContainer>
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Parameters</h5>
                    {parameters &&
                    parameters.parametersUniqueArray.length > 0 ? (
                        <DataTableContainer refContainer={parameters_data} refs={[models_data, datasets_data, iterations_data, metrics_data]}>
                            <DataTableContent>
                                {parameters.parametersUniqueArray.map(
                                    (parameter: any, index) => (
                                        <DataTableRowWithHeader
                                            key={index}
                                            header={parameter}
                                            cells={
                                                parameters
                                                    .parametersValuesArrays[
                                                    index
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </DataTableContent>
                        </DataTableContainer>
                    ) : (
                        <p>No parameters to show.</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Metrics</h5>
                    {metrics && metrics.metricsUniqueArray.length > 0 ? (
                        <>
                            <DataTableContainer refContainer={metrics_data} refs={[models_data, datasets_data, parameters_data, iterations_data]}>
                                <DataTableContent>
                                    {metrics.metricsUniqueArray.map(
                                        (metric: any, index) => (
                                            <DataTableRowWithHeader
                                                key={index}
                                                header={metric}
                                                cells={
                                                    metrics.metricsValuesArrays[
                                                        index
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </DataTableContent>
                            </DataTableContainer>
                            <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
                                <ReactEcharts
                                    option={metricsChart}
                                    theme="customed"
                                />
                            </div>
                        </>
                    ) : (
                        <p>No metrics to show.</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Image charts</h5>
                    {imageCharts && imageCharts.image_charts.length > 0 ? (
                        imageCharts.image_charts.map(
                            (imageChartsPerIterations: any) => (
                                <div
                                    key={
                                        imageChartsPerIterations.iteration_name
                                    }
                                >
                                    <p className="mb-2 text-base italic font-semibold">
                                        {
                                            imageChartsPerIterations.iteration_name
                                        }
                                    </p>
                                    <Masonry
                                        breakpointCols={
                                            breakpointsMasonryImageCharts
                                        }
                                        className="my-masonry-grid"
                                        columnClassName="my-masonry-grid-column"
                                    >
                                        {imageChartsPerIterations.charts}
                                    </Masonry>
                                </div>
                            )
                        )
                    ) : (
                        <p>No image charts to show.</p>
                    )}
                    {imageCharts &&
                        imageCharts.image_charts_sources.length > 0 &&
                        status.isOpen && (
                            <Lightbox
                                // @ts-ignore
                                images={imageCharts.image_charts_sources}
                                onClose={() =>
                                    setStatus((prevState) => {
                                        return { ...prevState, isOpen: false };
                                    })
                                }
                                startIndex={status.key}
                                doubleClickZoom={0}
                            />
                        )}
                </div>
            </div>
        </div>
    );
};

export default CompareIterations;