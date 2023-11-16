import Cycle from "@/components/icons/cycle";
import Timeline from "@/components/icons/timeline";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Model } from "@/types/model";
import moment from "moment-timezone";
import { GoIterations } from "react-icons/go";
import { useSearchParams } from "react-router-dom";

interface ModelCardInfoProps {
    model: Model;
}

const ModelCardInfo = ({ model }: ModelCardInfoProps) => {
    const [searchParams] = useSearchParams();
    const IterationBlock = () => {
        if (!model.iteration) {
            return (
                <div className="flex items-center">
                    <GoIterations className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                    <span className="text-sm text-zinc-400">
                        Model is empty.
                    </span>
                </div>
            );
        }
        return (
            <div className="flex items-center mb-2">
                <GoIterations className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    Based on model from{" "}
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <a
                                className="italic cursor-pointer hover:underline"
                                href={`/projects/${
                                    model.iteration.project_id
                                }/experiments/${
                                    model.iteration.experiment_id
                                }/iterations/${model.iteration.id}${
                                    searchParams.get("ne") !== "default"
                                        ? `?ne=${searchParams.get("ne")}`
                                        : ""
                                }`}
                            >
                                {model.iteration.iteration_name}
                            </a>{" "}
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem>
                                <a
                                    href={`/projects/${
                                        model.iteration.project_id
                                    }/experiments/${
                                        model.iteration.experiment_id
                                    }/iterations/${model.iteration.id}${
                                        searchParams.get("ne") !== "default"
                                            ? `?ne=${searchParams.get("ne")}`
                                            : ""
                                    }`}
                                    target="_blank"
                                    className="flex items-center w-100"
                                >
                                    <GoIterations className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                                    Open iteration view in new tab
                                </a>
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>{" "}
                    iteration.
                </span>
            </div>
        );
    };

    const PredictionHistoryBlock = () => {
        if (model.iteration) {
            if (model.predictions_data && model.predictions_data.length > 0) {
                return (
                    <>
                        <div className="flex items-center mb-2">
                            <Cycle className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                            <span className="text-sm font-semibold">
                                {model.predictions_data.length} historical
                                prediction
                                {model.predictions_data.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Timeline className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                            <span className="text-sm font-semibold">
                                Last prediction on{" "}
                                {moment(
                                    model.predictions_data[
                                        model.predictions_data.length - 1
                                    ].prediction_date
                                ).format("DD.MM.YYYY, HH:mm")}
                            </span>
                        </div>
                    </>
                );
            } else {
                return (
                    <div className="flex items-center">
                        <Cycle className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                        <span className="text-sm text-zinc-400">
                            0 historical predictions
                        </span>
                    </div>
                );
            }
        }
    };

    return (
        <>
            <div className="flex flex-col mb-2">
                {IterationBlock()}
                {PredictionHistoryBlock()}
            </div>
        </>
    );
};

export default ModelCardInfo;
