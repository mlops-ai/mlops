import { Archive, Delete, Unarchive, Edit } from "@/components/icons";

import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import ModalProjectMenuItem from "./project-menu/modal-project-menu-item";
import PinUnpinProjectMenuItem from "./project-menu/pin-unpin-project-menu-item";
import CopyProjectIdMenuItem from "./project-menu/copy-project-id-menu-item";
import ProjectStatusMenuItem from "./project-menu/project-status-menu-item";
import ProjectMenuHeader from "./project-menu/project-menu-header";

import { Project } from "@/types/project";

interface ProjectCardProps {
    project: Project;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectContextMenuContent = ({
    project,
    setLoading,
}: ProjectCardProps) => {
    return (
        <ContextMenuContent className="w-56">
            <ProjectMenuHeader />
            <ContextMenuSeparator />
            {!project.archived && (
                <ModalProjectMenuItem
                    project={project}
                    ItemType={ContextMenuItem}
                    modalType="editProject"
                    Icon={Edit}
                    menuDescription="Edit project information"
                />
            )}
            <ModalProjectMenuItem
                project={project}
                ItemType={ContextMenuItem}
                modalType="deleteProject"
                Icon={Delete}
                menuDescription="Delete project"
            />
            <ContextMenuSeparator />
            {project.archived ? (
                <ModalProjectMenuItem
                    project={project}
                    ItemType={ContextMenuItem}
                    modalType="restoreProject"
                    Icon={Unarchive}
                    menuDescription="Restore project"
                />
            ) : (
                <ModalProjectMenuItem
                    project={project}
                    ItemType={ContextMenuItem}
                    modalType="archiveProject"
                    Icon={Archive}
                    menuDescription="Archive project"
                />
            )}
            <ProjectStatusMenuItem
                project={project}
                setLoading={setLoading}
                ItemType={{
                    MenuSub: ContextMenuSub,
                    Trigger: ContextMenuSubTrigger,
                    MenuSubContent: ContextMenuSubContent,
                    MenuItem: ContextMenuItem,
                }}
            />
            <ContextMenuSeparator />
            <PinUnpinProjectMenuItem
                project={project}
                setLoading={setLoading}
                ItemType={ContextMenuItem}
            />
            <ContextMenuSeparator />
            <CopyProjectIdMenuItem
                project={project}
                ItemType={ContextMenuItem}
            />
        </ContextMenuContent>
    );
};

export default ProjectContextMenuContent;
