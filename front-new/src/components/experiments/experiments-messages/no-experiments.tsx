import { useModal } from "@/hooks/use-modal-hook";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AiOutlineExperiment } from "react-icons/ai";
import { Project } from "@/types/project";

interface NoExperimentsProps {
    projectData: Project;
}

const NoExperiments = ({ projectData }: NoExperimentsProps) => {
    const { onOpen } = useModal();

    return (
        <div className="flex flex-col items-center justify-center w-full m-16">
            <AiOutlineExperiment className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                Nothing to show.
            </p>
            <p className="text-sm text-center">
                There are no experiments in this project. <br />
                Create a new experiment for tracking runs.
            </p>
            <div className="flex items-center h-8 my-4 whitespace-nowrap">
                <Button
                    variant="mlopsPrimary"
                    title="Create new experiment"
                    className="pt-1 pb-1 pl-2 pr-4 mr-3 h-9"
                    onClick={() => onOpen("createExperiment", {project: projectData})}
                >
                    <Plus className="flex-shrink-0 w-6 h-6 mr-1" /> Create new
                    experiment
                </Button>
            </div>
        </div>
    );
};

export default NoExperiments;
