import { MoreVertical } from "lucide-react";
import { Delete, Edit } from "@/components/icons";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Iteration } from "@/types/iteration";
import ModalIterationMenuItem from "./iteration-menu/modal-iteration-menu-item";
import CopyIterationIdMenuItem from "./iteration-menu/copy-iteration-id-menu-item";

interface IterationActionsProps {
    iteration: Iteration;
}

const ProjectDropdownActions = ({
    iteration,
}: IterationActionsProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <DropdownMenu>
                    <TooltipTrigger>
                        <DropdownMenuTrigger asChild>
                            <div className="p-2 transition duration-300 rounded-full group hover:dark:bg-mlops-action-hover-bg-dark hover:bg-mlops-action-hover-bg">
                                <MoreVertical className="w-6 h-6 transition duration-300 text-mlops-secondary-tx group-hover:text-mlops-primary-tx group-hover:dark:text-mlops-primary-tx-dark dark:text-[#D5D5D5]" />
                            </div>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <div className="flex items-center font-normal">
                            Iteration actions
                        </div>
                    </TooltipContent>
                    <DropdownMenuContent side="bottom" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex items-center font-semibold">
                                Iteration actions
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ModalIterationMenuItem
                            iteration={iteration}
                            ItemType={DropdownMenuItem}
                            modalType="editIteration"
                            Icon={Edit}
                            menuDescription="Edit iteration name"
                        />
                        <ModalIterationMenuItem
                            iteration={iteration}
                            ItemType={DropdownMenuItem}
                            modalType="deleteIterations"
                            Icon={Delete}
                            menuDescription="Delete iteration"
                        />
                        <DropdownMenuSeparator />
                        <CopyIterationIdMenuItem
                            iteration={iteration}
                            ItemType={DropdownMenuItem}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ProjectDropdownActions;
