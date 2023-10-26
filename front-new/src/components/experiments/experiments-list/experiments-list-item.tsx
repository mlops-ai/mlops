import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Experiment } from "@/types/experiment";
import { Edit, Delete, Copy } from "@/components/icons";
import { useModal } from "@/hooks/use-modal-hook";
import { Project } from "@/types/project";
import { createToast } from "@/lib/toast";

interface ExperimentListItemProps {
    projectData: Project;
    experiment: Experiment;
    handleCheckboxChange: (experiment_id: string) => void;
    handleCheckboxLabelClick: (experiment_id: string) => void;
}

const ExperimentListItem = ({
    projectData,
    experiment,
    handleCheckboxChange,
    handleCheckboxLabelClick,
}: ExperimentListItemProps) => {
    const { onOpen } = useModal();
    return (
        <div
            className={cn(
                "group flex items-center justify-between px-1 py-1 rounded mb-[2px] hover:bg-zinc-300/40 hover:dark:bg-zinc-300/10",
                experiment.checked &&
                    "dark:bg-zinc-300/20 bg-zinc-300/60 hover:bg-zinc-300/60 dark:hover:bg-zinc-300/20"
            )}
        >
            <div className="flex items-center">
                <Checkbox
                    id={experiment.id}
                    className="data-[state=checked]:bg-mlops-primary data-[state=checked]:dark:bg-mlops-primary data-[state=checked]:text-white focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx mr-1 transition duration-300"
                    checked={experiment.checked}
                    onClick={() => handleCheckboxChange(experiment.id)}
                />
                <span
                    className="w-full cursor-pointer text-md"
                    onClick={() => handleCheckboxLabelClick(experiment.id)}
                >
                    {experiment.name}
                </span>
            </div>
            <div className="items-center hidden group-hover:flex">
                <div
                    className="transition duration-300 cursor-pointer hover:text-mlops-primary-tx hover:dark:text-mlops-primary-tx-dark text-mlops-primary-tx/80 dark:text-mlops-primary-tx-dark/80"    
                    title="Copy experiment ID"
                    onClick={() => {
                        navigator.clipboard.writeText(experiment.id);
                        createToast({
                            id: "copy-experiment-id",
                            message: "Experiment ID copied to clipboard",
                            type: "success",
                        });
                    }}
                >
                    <Copy className="flex-shrink-0 mr-[2px]" />
                </div>
                <div
                    className="transition duration-300 cursor-pointer hover:text-mlops-primary-tx hover:dark:text-mlops-primary-tx-dark text-mlops-primary-tx/80 dark:text-mlops-primary-tx-dark/80" 
                    title="Edit experiment"
                    onClick={() =>
                        onOpen("editExperiment", {
                            project: projectData,
                            experiment: experiment,
                        })
                    }
                >
                    <Edit className="flex-shrink-0 mr-[2px]" />
                </div>
                <div
                    className="transition duration-300 cursor-pointer hover:text-mlops-primary-tx hover:dark:text-mlops-primary-tx-dark text-mlops-primary-tx/80 dark:text-mlops-primary-tx-dark/80" 
                    title="Delete experiment"
                    onClick={() =>
                        onOpen("deleteExperiment", {
                            project: projectData,
                            experiment: experiment,
                        })
                    }
                >
                    <Delete className="flex-shrink-0" />
                </div>
            </div>
        </div>
    );
};

export default ExperimentListItem;
