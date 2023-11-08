import moment from "moment-timezone";

import { CalendarDays } from "lucide-react";
import { AiOutlineExperiment } from "react-icons/ai";
import { GoIterations } from "react-icons/go";
import { MdUpdate } from "react-icons/md";

import { Experiment } from "@/types/experiment";

interface ProjectCardInfoProps {
    created_at: Date;
    updated_at: Date;
    experiments: Experiment[];
}

const ProjectCardInfo = ({
    created_at,
    updated_at,
    experiments,
}: ProjectCardInfoProps) => {

    const experimentsCount = experiments.length;
    const iterationsCount = experiments.reduce((acc, curr) => acc + curr.iterations.length, 0);

    const ExperimentsBlock = () => {
        if (experimentsCount === 0) {
            return <span className="text-sm text-zinc-400">0 experiments</span>
        } else if (experimentsCount === 1) {
            return <span className="text-sm font-semibold">1 experiment</span>
        }
        return <span className="text-sm font-semibold">{experimentsCount} experiments</span>
    }

    const IterationsBlock = () => {
        if (iterationsCount === 0) {
            return <span className="text-sm text-zinc-400">0 iterations</span>
        } else if (iterationsCount === 1) {
            return <span className="text-sm font-semibold">1 iteration</span>
        }
        return <span className="text-sm font-semibold">{iterationsCount} iterations</span>
    }

    return (
        <>
            <div className="flex items-center mb-2">
                <CalendarDays className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    Created on {moment(created_at).format("DD.MM.YYYY, HH:mm")}
                </span>
            </div>
            <div className="flex items-center mb-2">
                <MdUpdate className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    Last updated on{" "}
                    {moment(updated_at).format("DD.MM.YYYY, HH:mm")}
                </span>
            </div>
            <div className="flex items-center mb-2">
                <AiOutlineExperiment className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                {ExperimentsBlock()}
            </div>
            <div className="flex items-center mb-2">
                <GoIterations className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                {IterationsBlock()}
            </div>
        </>
    );
};

export default ProjectCardInfo;
