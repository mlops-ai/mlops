import { MoreVertical } from "lucide-react";
import { Archive, Delete, Unarchive, Edit } from "@/components/icons";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ModalProjectMenuItem from "./project-card/project-menu/modal-project-menu-item";
import PinUnpinProjectMenuItem from "./project-card/project-menu/pin-unpin-project-menu-item";
import CopyProjectIdMenuItem from "./project-card/project-menu/copy-project-id-menu-item";
import ProjectStatusMenuItem from "./project-card/project-menu/project-status-menu-item";
import ProjectMenuHeader from "./project-card/project-menu/project-menu-header";

import { Project } from "@/types/project";

interface ProjectCardProps {
    project: Project;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectDropdownActions = ({
    project,
    setLoading,
}: ProjectCardProps) => {
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
                            Project actions
                        </div>
                    </TooltipContent>
                    <DropdownMenuContent side="bottom" className="w-56">
                        <ProjectMenuHeader />
                        <DropdownMenuSeparator />
                        {!project.archived && (
                            <ModalProjectMenuItem
                                project={project}
                                ItemType={DropdownMenuItem}
                                modalType="editProject"
                                Icon={Edit}
                                menuDescription="Edit project information"
                            />
                        )}
                        <ModalProjectMenuItem
                            project={project}
                            ItemType={DropdownMenuItem}
                            modalType="deleteProject"
                            Icon={Delete}
                            menuDescription="Delete project"
                        />
                        <DropdownMenuSeparator />
                        {project.archived ? (
                            <ModalProjectMenuItem
                                project={project}
                                ItemType={DropdownMenuItem}
                                modalType="restoreProject"
                                Icon={Unarchive}
                                menuDescription="Restore project"
                            />
                        ) : (
                            <ModalProjectMenuItem
                                project={project}
                                ItemType={DropdownMenuItem}
                                modalType="archiveProject"
                                Icon={Archive}
                                menuDescription="Archive project"
                            />
                        )}
                        <ProjectStatusMenuItem
                            project={project}
                            setLoading={setLoading}
                            ItemType={{
                                MenuSub: DropdownMenuSub,
                                Trigger: DropdownMenuSubTrigger,
                                MenuSubContent: DropdownMenuSubContent,
                                MenuItem: DropdownMenuItem,
                            }}
                        />
                        <DropdownMenuSeparator />
                        <PinUnpinProjectMenuItem
                            project={project}
                            setLoading={setLoading}
                            ItemType={DropdownMenuItem}
                        />
                        <DropdownMenuSeparator />
                        <CopyProjectIdMenuItem
                            project={project}
                            ItemType={DropdownMenuItem}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ProjectDropdownActions;
