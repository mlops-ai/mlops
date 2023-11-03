import axios from "axios";

import { useData } from "@/hooks/use-data-hook";

import { createToast } from "@/lib/toast";

import { backendConfig } from "@/config/backend";

import { Check } from "lucide-react";
import { Trending } from "@/components/icons";

import { Project } from "@/types/project";
import { ProjectQuickAction, ProjectStatus } from "@/types/types";

const ProjectStatusMenuItem = ({
    project,
    setLoading,
    ItemType,
}: ProjectQuickAction) => {
    const { url, port } = backendConfig;

    const data = useData();

    const handleProjectStatusUpdate = async (status: ProjectStatus) => {
        if (project.status === status) return;

        setLoading(true);
        await axios
            .put(`${url}:${port}/projects/${project._id}`, {
                status: status,
            })
            .then(() => {
                data.updateProject(project._id, {
                    ...project,
                    status: status,
                } as Project);
            })
            .catch((error: any) => {
                createToast({
                    id: "project-status-update",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
        setLoading(false);
    };

    return (
        <ItemType.MenuSub>
            <ItemType.Trigger>
                <div className="flex items-center">
                    <Trending className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                    Project status
                </div>
            </ItemType.Trigger>
            <ItemType.MenuSubContent>
                <ItemType.MenuItem
                    onClick={() =>
                        handleProjectStatusUpdate(ProjectStatus.NOT_STARTED)
                    }
                >
                    <div className="flex items-center justify-between w-full">
                        Not started{" "}
                        {project.status === ProjectStatus.NOT_STARTED && (
                            <Check className="flex-shrink-0 w-4 h-4" />
                        )}
                    </div>
                </ItemType.MenuItem>
                <ItemType.MenuItem
                    onClick={() =>
                        handleProjectStatusUpdate(ProjectStatus.IN_PROGRESS)
                    }
                >
                    <div className="flex items-center justify-between w-full">
                        In progress{" "}
                        {project.status === ProjectStatus.IN_PROGRESS && (
                            <Check className="flex-shrink-0 w-4 h-4" />
                        )}
                    </div>
                </ItemType.MenuItem>
                <ItemType.MenuItem
                    onClick={() =>
                        handleProjectStatusUpdate(ProjectStatus.FINISHED)
                    }
                >
                    <div className="flex items-center justify-between w-full">
                        Finished{" "}
                        {project.status === ProjectStatus.FINISHED && (
                            <Check className="flex-shrink-0 w-4 h-4" />
                        )}
                    </div>
                </ItemType.MenuItem>
            </ItemType.MenuSubContent>
        </ItemType.MenuSub>
    );
};

export default ProjectStatusMenuItem;
