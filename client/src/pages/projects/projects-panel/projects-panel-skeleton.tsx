/**
 * Import react hooks
 */
import { useSearchParams } from "react-router-dom";

/**
 * Import icons
 */
import { Plus } from "lucide-react";
import { MdSort } from "react-icons/md";

/**
 * Import components
 */
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Project panel skeleton component
 */
const ProjectPanelSkeleton = () => {
    /**
     * Search params for managing search query
     */
    const [searchParams] = useSearchParams({
        archived: "false",
    });

    /**
     * Constant used for switching between active and archived projects
     */
    const isArchived = searchParams.get("archived") === "true";

    /**
     * Project panel skeleton render
     */
    return (
        <div className="flex flex-wrap items-center justify-between h-auto gap-3 my-4">
            <div className="flex flex-wrap items-center gap-3">
                {!isArchived && (
                    <Skeleton className="flex items-center pt-1 pb-1 pl-2 pr-4 font-semibold text-transparent h-9">
                        <Plus className="flex-shrink-0 w-6 h-6 mr-1" /> New
                        project
                    </Skeleton>
                )}

                <Skeleton>
                    <div className="text-md w-[250px] h-9" />
                </Skeleton>
            </div>

            <Skeleton className="flex items-center w-[220px] h-9 text-transparent">
                <MdSort className="flex-shrink-0 w-5 h-5 mr-2" />
                Sort projects
            </Skeleton>
        </div>
    );
};

export default ProjectPanelSkeleton;
