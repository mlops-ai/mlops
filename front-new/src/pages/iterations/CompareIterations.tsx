import { Key, useMemo, useRef, useState } from "react";

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
import DataTableHeader from "@/components/data-table/data-table-header";
import DataTableContent from "@/components/data-table/data-table-content";
import DataTableRow from "@/components/data-table/data-table-row-single";
import DataTableRowWithHeader from "@/components/data-table/data-table-row-compare";
import moment from "moment-timezone";
import { VscProject } from "react-icons/vsc";
import { LayoutDashboard } from "lucide-react";
import PageHeader from "@/components/page-header";
import Breadcrumb from "@/components/breadcrumb";

const CompareIterations = () => {
    /**
     * React ref hooks for simultaneous scrolling multiple sections.
     */
    const iterations_data = useRef();
    const models_data = useRef();
    const datasets_data = useRef();
    const parameters_data = useRef();
    const metrics_data = useRef();

    const theme = useTheme();
    const data = useData();
    const [searchParams] = useSearchParams({
        iterations: "",
    });
    const navigate = useNavigate();

    const { project_id } = useParams();

    /**
     * State used for storing lightbox data (image charts viewer).
     * */
    const [status, setStatus] = useState({
        isOpen: false,
        key: 0,
    });

    const iterationsData = useMemo(() => {
        if (data.projects) {
            /**
             * Find project by project_id from url.
             * */
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

            return {
                iterations: iterations_list,
                project_title: project.title,
                numberOfExperiments: experiments.length,
            };
        }
        return null;
    }, [data.projects]);

    const [iterationsDetails, modelsDetails, datasetsDetails] = useMemo(() => {
        if (iterationsData) {
            let ids: string[] = [];
            let iterations_names: string[] = [];
            let experiments_names: string[] = [];
            let created_dates: string[] = [];
            let run_by: string[] = [];

            let models_paths: string[] = [];

            let datasets_names: string[] = [];
            let datasets_versions: string[] = [];

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
            });

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
                }
            ];
        }

        return [null, null, null];
    }, [iterationsData]);

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
                    <DataTableContainer>
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
                    <DataTableContainer>
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
                    <DataTableContainer>
                        <DataTableContent>
                            <DataTableRowWithHeader
                                header="Dataset Name"
                                cells={datasetsDetails?.datasets_names as string[]}
                            />
                            <DataTableRowWithHeader
                                header="Dataset Version"
                                cells={datasetsDetails?.datasets_versions as string[]}
                            />
                        </DataTableContent>
                    </DataTableContainer>
                </div>
            </div>
        </div>
    );
};

export default CompareIterations;
