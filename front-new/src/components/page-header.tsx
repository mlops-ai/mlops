import { Badge } from "@/components/ui/badge";
import { projectStatusesMap, modelStatusesMap } from "@/config/maping";
import { PinFilled } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    statusBadge?: "not_started" | "in_progress" | "completed";
    modelBadge?: "idle" | "active" | "archived";
    archivedBadge?: boolean;
    pin?: boolean;
    actionButton?: React.ReactNode;
    className?: string;
}

const PageHeader = ({
    title,
    statusBadge,
    modelBadge,
    archivedBadge,
    pin,
    actionButton,
    className,
}: PageHeaderProps) => {
    return (
        <h1 className={cn("flex items-center justify-between mb-1 text-2xl font-semibold text-mlops-primary-tx dark:text-mlops-primary-tx-dark",
        className && className)}>
            <div className="flex items-center">
                {pin && (
                    <div title="Project is pinned">
                        <PinFilled className="flex-shrink-0 mr-1 w-7 h-7 text-mlops-primary" />
                    </div>
                )}
                {pin && " "}
                {title}
                {statusBadge && (
                    <Badge
                        variant={statusBadge}
                        title="Project status"
                        className="ml-2"
                    >
                        {projectStatusesMap[statusBadge]}
                    </Badge>
                )}
                {modelBadge && (
                    <Badge
                    variant={modelBadge}
                    title="Project status"
                    className="ml-2"
                >
                    {modelStatusesMap[modelBadge]}
                </Badge>
                )}
                {archivedBadge && (
                    <Badge
                        variant="archived"
                        title="Project is archived"
                        className="ml-2"
                    >
                        Archived
                    </Badge>
                )}
            </div>
            {actionButton}
        </h1>
    );
};

export default PageHeader;
