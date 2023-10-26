import Breadcrumb from "@/components/breadcrumb";
import ExperimentList from "@/components/experiments/experiments-list/experiments-list";
import NoExperiments from "@/components/experiments/experiments-messages/no-experiments";
import PageHeader from "@/components/page-header";
import ProjectDropdownActions from "@/components/projects/project-dropdown-actions";
import { useData } from "@/hooks/use-data-hook";
import { Project } from "@/types/project";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VscProject } from "react-icons/vsc";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ExperimentHeader from "@/components/experiments/experiments-info/experiment-header";
import ExperimentInfo from "@/components/experiments/experiments-info/experiment-info";
import { Loading } from "@/components/icons";
import IterationsContainer from "@/components/experiments/iterations/iterations-container";
import { AiOutlineExperiment } from "react-icons/ai";

const Experiments = () => {
    console.log("Experiments");

    const navigate = useNavigate();

    const { project_id } = useParams();

    const [searchParams, setSearchParams] = useSearchParams({
        experiments: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const data = useData();

    const [projectData, setProjectData] = useState<null | undefined | Project>(
        null
    );

    useEffect(() => {
        console.log("dp", data.projects);
        if (data.projects) {
            let foundProject = data.projects.find(
                (project) => project._id === project_id
            );

            if (!foundProject) {
                console.log("test");
                setProjectData(undefined);
            } else {
                const experiments_ids = foundProject.experiments.map(
                    (experiment) => experiment.id
                );

                let experiments = searchParams.get("experiments");

                let intersection: string[] = [];

                if (experiments) {
                    let searchParamsExperiments = experiments.split(",");
                    intersection = experiments_ids.filter((id) =>
                        searchParamsExperiments.includes(id)
                    );
                }

                let activeExperiments: string[] = [];

                if (intersection.length > 0) {
                    foundProject.experiments = foundProject.experiments.map(
                        (experiment) => ({
                            ...experiment,
                            checked: intersection.includes(experiment.id),
                        })
                    );

                    setSearchParams(
                        (prev) => {
                            prev.set("experiments", intersection.join(","));
                            return prev;
                        },
                        { replace: true }
                    );

                    setProjectData(foundProject);
                } else {
                    foundProject.experiments = foundProject.experiments.map(
                        (experiment, index) => {
                            if (index === 0) {
                                activeExperiments.push(experiment.id);
                                return {
                                    ...experiment,
                                    checked: true,
                                };
                            }
                            return {
                                ...experiment,
                                checked: false,
                            };
                        }
                    );
                    if (activeExperiments.length > 0) {
                        setSearchParams(
                            (prev) => {
                                prev.set("experiments", activeExperiments[0]);
                                return prev;
                            },
                            { replace: true }
                        );
                    } else {
                        setSearchParams(
                            (prev) => {
                                prev.set("experiments", "none");
                                return prev;
                            },
                            { replace: true }
                        );
                    }
                    setProjectData(foundProject);
                }
            }
        }
    }, [data.projects, project_id]);

    const activeExperiments = useMemo(() => {
        console.log(data.projects);
        console.log(projectData);
        if (projectData) {
            return projectData.experiments.filter(
                (experiment) => experiment.checked
            );
        }
        return [];
    }, [data.projects, projectData]);
    
    console.log(activeExperiments);

    const handleCheckboxChange = (experiment_id: string) => {
        let experiments = searchParams.get("experiments");

        if (experiments && projectData) {
            let searchParamsExperiments = experiments.split(",");

            if (
                searchParamsExperiments.length === 1 &&
                searchParamsExperiments[0] === experiment_id
            ) {
                return;
            }

            let updatedExperiments = projectData.experiments.map(
                (experiment) => {
                    if (experiment.id === experiment_id) {
                        return {
                            ...experiment,
                            checked: !experiment.checked,
                        };
                    }
                    return experiment;
                }
            );

            if (searchParamsExperiments.includes(experiment_id)) {
                searchParamsExperiments = searchParamsExperiments.filter(
                    (id) => id !== experiment_id
                );
            } else {
                searchParamsExperiments.push(experiment_id);
            }

            setSearchParams(
                (prev) => {
                    prev.set("experiments", searchParamsExperiments.join(","));
                    return prev;
                },
                { replace: true }
            );

            setProjectData((prevState) => {
                if (prevState) {
                    return {
                        ...prevState,
                        experiments: updatedExperiments,
                    };
                }
                return prevState;
            });
        }
    };

    const handleCheckboxLabelClick = (experiment_id: string) => {
        if (projectData) {
            let updatedExperiments = projectData.experiments.map(
                (experiment) => {
                    if (experiment.id === experiment_id) {
                        return {
                            ...experiment,
                            checked: true,
                        };
                    }
                    return {
                        ...experiment,
                        checked: false,
                    };
                }
            );

            setSearchParams(
                (prev) => {
                    prev.set("experiments", experiment_id);
                    return prev;
                },
                { replace: true }
            );

            setProjectData((prevState) => {
                if (prevState) {
                    return {
                        ...prevState,
                        experiments: updatedExperiments,
                    };
                }
                return prevState;
            });
        }
    };

    if (projectData === undefined) {
        return navigate(
            `/projects${
                searchParams.get("ne") !== "default"
                    ? `?ne=${searchParams.get("ne")}`
                    : ""
            }`
        );
    }

    if (projectData === null) {
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
                        ]}
                    />
                </div>
                <div className="flex flex-col items-center justify-center m-32">
                    <AiOutlineExperiment className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                    <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                        Loading experiments and iterations data ...
                    </p>
                    <p className="text-sm text-center">Please, be patient.</p>
                    <Loading className="w-10 h-10 mt-8 animate-spin text-mlops-primary dark:text-mlops-primary-tx-dark" />
                </div>
            </>
        );
    }

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute top-[50%] left-[50%] w-full h-full z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 text-center backdrop-blur-[2px] rounded-md">
                    <div className="flex items-center px-2 py-1 font-semibold text-white rounded bg-mlops-primary">
                        <Loading className="animate-spin" />
                        Updating ...
                    </div>
                </div>
            )}
            <div className="mb-4">
                <PageHeader
                    title={projectData.title}
                    statusBadge={projectData.status}
                    archivedBadge={projectData.archived}
                    pin={projectData.pinned}
                    actionButton={
                        <ProjectDropdownActions
                            project={projectData}
                            setLoading={setIsLoading}
                        />
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
                            name: projectData.title,
                            Icon: VscProject,
                        },
                    ]}
                />
            </div>

            <div className="flex flex-col gap-5 lg:flex-row">
                {projectData.experiments.length > 0 ? (
                    <>
                        <ExperimentList
                            projectData={projectData}
                            handleCheckboxChange={handleCheckboxChange}
                            handleCheckboxLabelClick={handleCheckboxLabelClick}
                        />
                        <div className="flex flex-col w-full">
                            {activeExperiments.length === 1 ? (
                                <>
                                    <ExperimentHeader
                                        title={activeExperiments[0].name}
                                        description={
                                            activeExperiments[0].description
                                        }
                                    />

                                    <ExperimentInfo
                                        createdAt={
                                            activeExperiments[0].created_at
                                        }
                                        updatedAt={
                                            activeExperiments[0].updated_at
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    <ExperimentHeader
                                        title={`Displaying iterations from ${activeExperiments.length} experiments`}
                                        description={activeExperiments
                                            .map(
                                                (experiment) => experiment.name
                                            )
                                            .join(", ")}
                                    />
                                </>
                            )}
                            <IterationsContainer
                                projectData={projectData}
                                activeExperiments={activeExperiments}
                            />
                        </div>
                    </>
                ) : (
                    <NoExperiments projectData={projectData} />
                )}
            </div>
        </div>
    );
};

export default Experiments;
