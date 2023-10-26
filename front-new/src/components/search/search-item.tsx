import { modelStatusesMap, projectStatusesMap } from "@/config/maping";

import { AiOutlineExperiment } from "react-icons/ai";
import { GoIterations } from "react-icons/go";
import { VscProject } from "react-icons/vsc";

import { CommandItem } from "@/components/ui/command-searchbar";
import { Badge } from "@/components/ui/badge";

import { ProjectData, ExperimentData, IterationData } from "@/types/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Model } from "@/types/model";
import Cycle from "../icons/cycle";
import { Dataset } from "@/types/dataset";
import { Database } from "lucide-react";

interface SearchItemData {
    project?: ProjectData;
    experiment?: ExperimentData;
    iteration?: IterationData;
    model?: Model;
    dataset?: Dataset;
}

interface SearchItemProps {
    type: "project" | "experiment" | "iteration" | "dataset" | "model";
    data: SearchItemData;
    handleClose: () => void;
}

const SearchItem = ({ type, data, handleClose }: SearchItemProps) => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams({
        ne: "default",
    });

    switch (type) {
        case "project":
            if (data.project) {
                return (
                    <CommandItem
                        key={data.project._id}
                        className="flex items-center justify-between w-full cursor-pointer"
                        onSelect={() => {
                            handleClose();
                            navigate(
                                `/projects/${data.project?._id}/experiments${
                                    searchParams.get("ne") !== "default"
                                        ? `?ne=${searchParams.get("ne")}`
                                        : ""
                                }`
                            );
                        }}
                    >
                        <div className="flex items-center mr-3">
                            <VscProject className="flex-shrink-0 mr-2" />{" "}
                            {data.project.title}
                        </div>
                        <div className="flex items-center gap-x-1">
                            <Badge
                                variant="mlops"
                                className="border-none h-[20px] px-1 bg-[#279EFF] gap-x-[1px]"
                                title="Number of Iterations"
                            >
                                <GoIterations
                                    className="flex-shrink-0"
                                    style={{
                                        width: "12px",
                                        heigth: "12px",
                                    }}
                                />
                                <span>{data.project.iterations_count}</span>
                            </Badge>
                            <Badge
                                variant="mlops"
                                className="border-none h-[20px] px-1 bg-mlops-primary-tx gap-x-[1px]"
                                title="Number of Experiments"
                            >
                                <AiOutlineExperiment
                                    className="flex-shrink-0"
                                    style={{
                                        width: "12px",
                                        heigth: "12px",
                                    }}
                                />
                                <span>{data.project.experiments_count}</span>
                            </Badge>

                            {data.project.archived ? (
                                <Badge
                                    variant="archived"
                                    className="border-none"
                                    title="Project is archived"
                                >
                                    Archived
                                </Badge>
                            ) : (
                                <Badge
                                    variant={data.project.status}
                                    className="border-none"
                                    title="Project Status"
                                >
                                    {projectStatusesMap[data.project.status]}
                                </Badge>
                            )}
                        </div>
                        <span className="hidden">{data.project._id}</span>
                    </CommandItem>
                );
            } else {
                console.log("No project data");
                return null;
            }
        case "experiment":
            if (data.experiment) {
                return (
                    <CommandItem
                        className="flex items-center justify-between w-full cursor-pointer"
                        key={data.experiment.id}
                        onSelect={() => {
                            handleClose();
                            navigate(
                                `/projects/${data.experiment
                                    ?.project_id}/experiments?experiments=${data
                                    .experiment?.id}${
                                    searchParams.get("ne") !== "default"
                                        ? `&ne=${searchParams.get("ne")}`
                                        : ""
                                }`
                            );
                        }}
                    >
                        <div
                            className="flex items-center mr-3"
                            key={data.experiment.id}
                        >
                            <AiOutlineExperiment className="flex-shrink-0 mr-2" />{" "}
                            {data.experiment.name}
                        </div>
                        <div className="flex items-center gap-x-1">
                            <Badge
                                variant="mlops"
                                className="border-none h-[20px] px-1 bg-[#279EFF] gap-x-[1px]"
                                title="Number of Iterations"
                            >
                                <GoIterations
                                    className="flex-shrink-0"
                                    style={{ width: "12px", heigth: "12px" }}
                                />
                                <span>{data.experiment.iterations_count}</span>
                            </Badge>
                            <ul className="flex items-center">
                                <li className="inline-flex items-center text-[13px]">
                                    (
                                    <VscProject
                                        className="flex-shrink-0 mr-1"
                                        style={{ width: "16px" }}
                                    />{" "}
                                    {data.experiment.project_title})
                                </li>
                            </ul>
                        </div>
                        <span className="hidden">{data.experiment.id}</span>
                    </CommandItem>
                );
            } else {
                console.log("No experiment data");
                return null;
            }
        case "iteration":
            if (data.iteration) {
                return (
                    <CommandItem
                        className="flex items-center justify-between w-full cursor-pointer"
                        key={data.iteration.id}
                    >
                        <div
                            className="flex items-center mr-3"
                            key={data.iteration.id}
                        >
                            <GoIterations className="flex-shrink-0 mr-2" />{" "}
                            {data.iteration.iteration_name}
                        </div>
                        <ul className="flex items-center">
                            <li className="inline-flex items-center text-[13px]">
                                (
                                <VscProject
                                    className="flex-shrink-0 mr-1"
                                    style={{ width: "16px" }}
                                />{" "}
                                {data.iteration.project_title}
                                <svg
                                    className="flex-shrink-0 h-auto text-gray-400 fill-current"
                                    style={{ width: "16px" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                                </svg>
                            </li>
                            <li className="inline-flex items-center text-[13px]">
                                <AiOutlineExperiment
                                    className="flex-shrink-0 mr-1"
                                    style={{ width: "16px" }}
                                />{" "}
                                {data.iteration.experiment_name}
                            </li>
                            )
                        </ul>
                        <span className="hidden">{data.iteration.id}</span>
                    </CommandItem>
                );
            } else {
                console.log("No iteration data");
                return null;
            }
        case "model": {
            if (data.model) {
                return (
                    <CommandItem
                        className="flex items-center justify-between w-full cursor-pointer"
                        key={data.model._id}
                    >
                        <div
                            className="flex items-center mr-3"
                            key={data.model._id}
                        >
                            <AiOutlineExperiment className="flex-shrink-0 mr-2" />{" "}
                            {data.model.model_name}
                        </div>
                        <div className="flex items-center gap-x-1">
                            {data.model.iteration && (
                                <>
                                    <Badge
                                        variant="mlops"
                                        className="border-none h-[20px] px-1 bg-[#279EFF] gap-x-[1px]"
                                        title="Number of Historical Predictions"
                                    >
                                        <Cycle
                                            className="flex-shrink-0"
                                            style={{ width: "12px" }}
                                        />
                                        <span>998</span>
                                    </Badge>
                                    <ul className="flex items-center">
                                        <li className="inline-flex items-center text-[13px]">
                                            (
                                            <GoIterations
                                                className="flex-shrink-0 mr-1"
                                                style={{ width: "16px" }}
                                            />{" "}
                                            {
                                                data.model.iteration
                                                    ?.iteration_name
                                            }
                                            )
                                        </li>
                                    </ul>
                                </>
                            )}
                            <Badge
                                variant={data.model.model_status}
                                className="border-none"
                                title="Model Status"
                            >
                                {modelStatusesMap[data.model.model_status]}
                            </Badge>
                        </div>
                        <span className="hidden">{data.model._id}</span>
                    </CommandItem>
                );
            } else {
                console.log("No model data");
                return null;
            }
        }
        case "dataset":
            if (data.dataset) {
                return (
                    <CommandItem
                        className="flex items-center justify-between w-full cursor-pointer"
                        key={data.dataset._id}
                        onSelect={() => {
                            handleClose();
                            navigate(
                                `/datasets?archived=${data.dataset?.archived}${
                                    searchParams.get("ne") !== "default"
                                        ? `&ne=${searchParams.get("ne")}`
                                        : ""
                                }#${data.dataset?._id}`
                            );
                        }}
                    >
                        <div
                            className="flex items-center mr-3"
                            key={data.dataset._id}
                        >
                            <Database className="flex-shrink-0 mr-2" />{" "}
                            {data.dataset.dataset_name}
                        </div>
                        <div className="flex items-center gap-x-1">
                            <Badge
                                variant="mlops"
                                className="border-none h-[20px] px-1 bg-[#279EFF] gap-x-[1px]"
                                title="Number of Connected Iterations"
                            >
                                <GoIterations
                                    className="flex-shrink-0"
                                    style={{ width: "12px", heigth: "12px" }}
                                />
                                <span>
                                    {
                                        Object.getOwnPropertyNames(
                                            data.dataset.linked_iterations
                                        ).length
                                    }
                                </span>
                            </Badge>
                            {data.dataset.version && data.dataset.version !== '' && (
                                <Badge
                                    variant="not_started"
                                    className="border-none"
                                    title="Dataset Version"
                                >
                                    {data.dataset.version}
                                </Badge>
                            )}
                            {data.dataset.archived && (
                                <Badge
                                    variant="archived"
                                    className="border-none"
                                    title="Dataset is archived"
                                >
                                    Archived
                                </Badge>
                            )}
                        </div>
                        <span className="hidden">{data.dataset._id}</span>
                    </CommandItem>
                );
            } else {
                console.log("No dataset data");
                return null;
            }
        default:
            return null;
    }
};

export default SearchItem;
