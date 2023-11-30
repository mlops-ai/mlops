import Breadcrumb from "@/components/breadcrumb";
import DataTableContainer from "@/components/data-table/data-table-container";
import DataTableContent from "@/components/data-table/data-table-content";
import DataTableHeader from "@/components/data-table/data-table-header";
import DataTableRow from "@/components/data-table/data-table-row-single";
import { Loading } from "@/components/icons";
import PageHeader from "@/components/page-header";
import { useData } from "@/hooks/use-data-hook";
import { Iteration } from "@/types/iteration";
import { LayoutDashboard } from "lucide-react";
import moment from "moment-timezone";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineExperiment } from "react-icons/ai";
import { GoIterations } from "react-icons/go";
import { VscProject } from "react-icons/vsc";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import ReactEcharts from "echarts-for-react";
import { useTheme } from "@/components/providers/theme-provider";
import { metricsChartOptionsGenerator } from "./single-iteration/metrics-chart-options";
import { Keyable } from "@/types/types";
import Masonry from "react-masonry-css";
import { breakpointsMasonryImageCharts } from "@/config/breakpoints";
import ImageChart from "@/components/image-charts/image-chart";

import Lightbox from "@/components/image-lightbox/image-lightbox";
import "@/components/image-lightbox/light-box.css";
import IterationDropdownActions from "./single-iteration/iteration-dropdown-actions";
import { dataImageType } from "@/lib/utils";
import CustomChart from "@/components/custom-charts/single/custom-chart";
import { Chart } from "@/types/chart";

const SingleIteration = () => {
    /**
     * Get :project_id, :experiment_id, :iteration_id params from url.
     * */
    const { project_id, experiment_id, iteration_id } = useParams();

    const data = useData();

    const [searchParams] = useSearchParams({
        ne: "default",
    });

    /**
     * State used for storing lightbox data (image charts viewer).
     * */
    const [status, setStatus] = useState({
        isOpen: false,
        key: 0,
    });

    console.log(status);

    const navigate = useNavigate();

    const { theme } = useTheme();

    console.log(theme);

    /**
     * State used for storing information iteration data.
     * */
    const [iterationData, setIterationData] = useState<null | Iteration>(null);

    /**
     * Retrieve iteration data from data store hook.
     * */
    useEffect(() => {
        if (data.projects) {
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

            const experiment = project.experiments.find(
                (experiment) => experiment.id === experiment_id
            );

            if (!experiment) {
                return navigate(
                    `/projects/${project_id}/experiments${
                        searchParams.get("ne") !== "default"
                            ? `?ne=${searchParams.get("ne")}`
                            : ""
                    }`
                );
            }
            const iteration = experiment.iterations.find(
                (iteration) => iteration.id === iteration_id
            );

            if (!iteration) {
                return navigate(
                    `/projects/${project_id}/experiments?experiments=${experiment_id}${
                        searchParams.get("ne") !== "default"
                            ? `&ne=${searchParams.get("ne")}`
                            : ""
                    }`
                );
            }
            setIterationData(iteration);
        }
    }, [data.projects, project_id, experiment_id, iteration_id]);

    const [
        parametersNames,
        parametersValues,
        metricsNames,
        metricsValues,
        metricsChartOptions,
        imageCharts,
        imageChartsSources,
        customCharts,
    ] = useMemo(() => {
        let parameters_names: string[] = [];
        let parameters_values: string[] = [];
        let metrics_names: string[] = [];
        let metrics_values: string[] = [];
        let metrics_chart_options: any = {};
        let image_charts: React.ReactNode[] = [];
        let image_charts_sources: Keyable[] = [];
        let custom_charts: React.ReactNode[] = [];

        if (iterationData) {
            if (iterationData.parameters) {
                parameters_names = Object.getOwnPropertyNames(
                    iterationData.parameters
                );
                parameters_values = Object.values(iterationData.parameters);
            }

            if (iterationData.metrics) {
                metrics_names = Object.getOwnPropertyNames(
                    iterationData.metrics
                );
                metrics_values = Object.values(iterationData.metrics);

                if (metrics_names.length > 0) {
                    let series = metrics_names.map((name, index) => {
                        let data = Array(metrics_names.length).fill(0);
                        data[index] = metrics_values[index];
                        return {
                            name: name,
                            data: data,
                            type: "bar",
                            stack: "stack",
                        };
                    });

                    metrics_chart_options = metricsChartOptionsGenerator(
                        theme,
                        metrics_names,
                        series,
                        "Metrics Chart"
                    );
                }
            }

            if (iterationData.image_charts) {
                let filtered_image_charts = iterationData.image_charts.filter(
                    (chart) => chart.comparable
                );

                filtered_image_charts.forEach((image_chart, index) => {
                    let encoded_image = image_chart.encoded_image;
                    const data_image_type = dataImageType(encoded_image);

                    if (data_image_type) {
                        image_charts.push(
                            <ImageChart
                                key={index}
                                index={index}
                                data_image_type={data_image_type}
                                encoded_image={encoded_image}
                                chart_name={image_chart.name}
                                setStatus={setStatus}
                            />
                        );

                        image_charts_sources.push({
                            title: image_chart.name,
                            url: `${data_image_type},${encoded_image}`,
                        });
                    }
                });
            }

            if (iterationData.interactive_charts) {
                custom_charts = iterationData.interactive_charts.map(
                    (chart_data: Keyable, index: number) => {
                        return (
                            <CustomChart
                                key={index}
                                theme={theme}
                                type={chart_data.chart_type}
                                iteration_name={iterationData.iteration_name}
                                chart_data={chart_data as Chart}
                            />
                        );
                    }
                );
            }

            return [
                parameters_names,
                parameters_values,
                metrics_names,
                metrics_values,
                metrics_chart_options,
                image_charts,
                image_charts_sources,
                custom_charts,
            ];
        }

        return [[], [], [], [], {}, [], [], [], []];
    }, [iterationData, theme, project_id, experiment_id, iteration_id]);

    if (iterationData === null) {
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
                                name: "...",
                                Icon: AiOutlineExperiment,
                            },
                            {
                                name: "...",
                                Icon: GoIterations,
                            },
                        ]}
                    />
                </div>
                <div className="flex flex-col items-center justify-center m-32">
                    <GoIterations className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                    <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                        Loading iteration data ...
                    </p>
                    <p className="text-sm text-center">Please, be patient.</p>
                    <Loading className="w-10 h-10 mt-8 animate-spin text-mlops-primary dark:text-mlops-primary-tx-dark" />
                </div>
            </>
        );
    }

    console.log(iterationData);

    return (
        <div className="relative">
            <div className="mb-4">
                <PageHeader
                    title={iterationData.iteration_name}
                    actionButton={
                        <IterationDropdownActions iteration={iterationData} />
                    }
                />
                <Breadcrumb
                    items={[
                        {
                            name: "Projects",
                            Icon: LayoutDashboard,
                            href: "/projects",
                        },
                        {
                            name: iterationData.project_title,
                            Icon: VscProject,
                            href: `/projects/${project_id}/experiments`,
                        },
                        {
                            name: iterationData.experiment_name,
                            Icon: AiOutlineExperiment,
                            href: `/projects/${project_id}/experiments?experiments=${experiment_id}`,
                            hasParams: true,
                        },
                        {
                            name: iterationData.iteration_name,
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
                    <DataTableContainer>
                        <DataTableHeader cols={["Created", "Run By"]} />
                        <DataTableContent>
                            <DataTableRow>
                                <td scope="row" className="px-6 py-4">
                                    {moment(iterationData.created_at).format(
                                        "DD.MM.YYYY, HH:mm"
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {iterationData.user_name}
                                </td>
                            </DataTableRow>
                        </DataTableContent>
                    </DataTableContainer>
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Model details</h5>
                    <DataTableContainer>
                        <DataTableHeader cols={["Model Path"]} />
                        <DataTableContent>
                            <DataTableRow>
                                <td scope="row" className="px-6 py-4">
                                    {iterationData.assigned_monitored_model_id &&
                                    iterationData.assigned_monitored_model_name ? (
                                        <Link
                                            to={`/models/${
                                                iterationData.assigned_monitored_model_id
                                            }/monitoring${
                                                searchParams.get("ne") !==
                                                "default"
                                                    ? `?ne=${searchParams.get(
                                                          "ne"
                                                      )}`
                                                    : ""
                                            }`}
                                            className="hover:underline text-[#0d6efd]"
                                        >
                                            {
                                                iterationData.assigned_monitored_model_name
                                            }
                                        </Link>
                                    ) : iterationData.path_to_model ? (
                                        <span>
                                            {iterationData.path_to_model}
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </DataTableRow>
                        </DataTableContent>
                    </DataTableContainer>
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Dataset details</h5>
                    <DataTableContainer>
                        <DataTableHeader
                            cols={["Dataset Name", "Dataset Version"]}
                        />
                        <DataTableContent>
                            <DataTableRow>
                                {iterationData.dataset ? (
                                    <>
                                        <td scope="row" className="px-6 py-4">
                                            <Link
                                                to={`/datasets${
                                                    searchParams.get("ne") !==
                                                    "default"
                                                        ? `?ne=${searchParams.get(
                                                              "ne"
                                                          )}`
                                                        : ""
                                                }#${iterationData.dataset.id}`}
                                                className="hover:underline text-[#0d6efd]"
                                            >
                                                {iterationData.dataset.name}
                                            </Link>
                                        </td>
                                        <td scope="row" className="px-6 py-4">
                                            {iterationData.dataset.version !==
                                            ""
                                                ? iterationData.dataset.version
                                                : "-"}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td scope="row" className="px-6 py-4">
                                            -
                                        </td>
                                        <td scope="row" className="px-6 py-4">
                                            -
                                        </td>
                                    </>
                                )}
                            </DataTableRow>
                        </DataTableContent>
                    </DataTableContainer>
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Parameters</h5>
                    {parametersNames.length > 0 ? (
                        <DataTableContainer>
                            <DataTableHeader cols={parametersNames} />
                            <DataTableContent>
                                <DataTableRow>
                                    {parametersValues.map(
                                        (parameter, index) => (
                                            <td
                                                key={index}
                                                scope={index === 0 ? "row" : ""}
                                                className="px-6 py-4"
                                            >
                                                {parameter}
                                            </td>
                                        )
                                    )}
                                </DataTableRow>
                            </DataTableContent>
                        </DataTableContainer>
                    ) : (
                        <p>No parameters to show.</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Metrics</h5>
                    {metricsNames.length > 0 ? (
                        <>
                            <DataTableContainer>
                                <DataTableHeader cols={metricsNames} />
                                <DataTableContent>
                                    <DataTableRow>
                                        {metricsValues.map((metric, index) => (
                                            <td
                                                key={index}
                                                scope={index === 0 ? "row" : ""}
                                                className="px-6 py-4"
                                            >
                                                {metric}
                                            </td>
                                        ))}
                                    </DataTableRow>
                                </DataTableContent>
                            </DataTableContainer>
                            <div className="px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-600 dark:bg-gray-800">
                                <ReactEcharts
                                    option={metricsChartOptions}
                                    theme="customed"
                                />
                            </div>
                        </>
                    ) : (
                        <p>No metrics to show.</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Custom charts</h5>
                    {customCharts.length > 0 ? (
                        customCharts
                    ) : (
                        <p>No custom charts to show.</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-semibold">Image charts</h5>
                    {imageCharts.length > 0 ? (
                        <Masonry
                            breakpointCols={breakpointsMasonryImageCharts}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid-column"
                        >
                            {imageCharts}
                        </Masonry>
                    ) : (
                        <p>No image charts to show.</p>
                    )}
                    {imageCharts.length > 0 && status.isOpen && (
                        <Lightbox
                            // @ts-ignore
                            images={imageChartsSources}
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

export default SingleIteration;
