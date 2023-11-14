import { Model } from "@/types/model";
import { CalendarDays } from "lucide-react";
import moment from "moment";
import { GoIterations } from "react-icons/go";
import { MdUpdate } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

interface ModelInfoProps {
    model: Model;
}

const ModelInfo = ({ model }: ModelInfoProps) => {

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
            <div className="flex items-center">
                <GoIterations className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    Based on model from{" "}
                    <a
                        className="italic cursor-pointer hover:underline"
                        href={`/projects/${model.iteration.project_id}/experiments/${model.iteration.experiment_id}/iterations/${model.iteration.id}${
                            searchParams.get("ne") !== "default"
                                ? `?ne=${searchParams.get("ne")}`
                                : ""
                        }`}
                    >
                        {model.iteration.iteration_name}
                    </a>{" "}
                    iteration.
                </span>
            </div>
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center font-bold">
                <CalendarDays className="w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                Created on {moment(model.created_at).format("DD.MM.YYYY, HH:mm")}
            </div>
            <div className="flex items-center font-bold">
                <MdUpdate className="w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                Last updated on {moment(model.updated_at).format("DD.MM.YYYY, HH:mm")}
            </div>
            {IterationBlock()}
        </div>
    );
};

export default ModelInfo;
