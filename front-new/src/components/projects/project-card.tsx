import { useState } from "react";

import { cn } from "@/lib/utils";

import { Loading } from "@/components/icons";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import ProjectCardHeader from "./project-card/project-card-header";
import ProjectCardStatus from "./project-card/project-card-status";
import ProjectCardDescription from "./project-card/project-card-description";
import ProjectCardInfo from "./project-card/project-card-info";
import ProjectContextMenuContent from "./project-card/project-context-menu-content";

import { Project } from "@/types/project";

interface ProjectCardProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        className={cn(
                            "relative flex flex-col w-full p-4 bg-white rounded-md shadow-lg dark:bg-mlops-nav-bg-dark"
                        )}
                    >
                        <ProjectCardHeader
                            project={project}
                            setLoading={setIsLoading}
                        />
                        <ProjectCardStatus
                            status={project.status}
                            archived={project.archived}
                        />
                        <ProjectCardDescription
                            description={project.description}
                        />
                        <ProjectCardInfo
                            created_at={project.created_at}
                            updated_at={project.updated_at}
                            experiments={project.experiments}
                        />
                        {isLoading && (
                            <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full text-center backdrop-blur-[2px] rounded-md">
                                <div className="flex items-center px-2 py-1 font-semibold text-white rounded bg-mlops-primary">
                                    <Loading className="animate-spin" />
                                    Updating ...
                                </div>
                            </div>
                        )}
                    </div>
                </ContextMenuTrigger>
                <ProjectContextMenuContent
                    project={project}
                    setLoading={setIsLoading}
                />
            </ContextMenu>
        </div>
    );
};

export default ProjectCard;
