import { projectStatusesMap } from "@/config/maping";

import { Badge } from "@/components/ui/badge";

interface ProjectCardStatusProps {
    status: "not_started" | "in_progress" | "completed";
    archived: boolean;
}

const ProjectCardStatus = ({ status, archived }: ProjectCardStatusProps) => {
    return (
        <div className="flex items-center mb-3">
            <Badge variant={status} title="Project Status">
                {projectStatusesMap[status]}
            </Badge>
            {archived && (
                <Badge
                    variant="archived"
                    title="Project is archived"
                    className="ml-2"
                >
                    Archived
                </Badge>
            )}
        </div>
    );
};

export default ProjectCardStatus;
