import moment from "moment-timezone";

import { useSearchParams } from "react-router-dom";

import { lorem, numberBetween } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

import { ProjectStatus } from "@/types/types";

const ProjectCardSkeleton = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const isArchived = searchParams.get("archived") === "true";

    const statuses = [
        ProjectStatus.NOT_STARTED,
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.FINISHED,
    ];

    return (
        <div className="flex flex-col w-full p-4 text-transparent bg-white rounded shadow-lg select-none dark:bg-mlops-nav-bg-dark">
            <div className="flex items-center justify-between mb-2 font-semibold">
                <Skeleton className="flex items-center w-full mr-2">
                    Example project
                </Skeleton>
                <Skeleton className="p-2 rounded-full">
                    <Skeleton className="w-6 h-6" />
                </Skeleton>
            </div>
            <div className="flex items-center mb-3">
                <Skeleton className="text-xs py-[2px] px-[10px] rounded">
                    {statuses[numberBetween(0, 2)]}
                </Skeleton>
                {isArchived && (
                    <Skeleton className="text-xs py-[2px] px-[10px] rounded ml-2">
                        Archived
                    </Skeleton>
                )}
            </div>
            <Skeleton className="mb-3 max-h-[calc(4*1.5*16px)] overflow-hidden">
                {lorem.generateSentences(numberBetween(1, 5))}
            </Skeleton>
            <div className="flex items-center mb-2">
                <Skeleton className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    <Skeleton>
                        Last updated on{" "}
                        {moment(Date.now()).format("DD.MM.YYYY, HH:mm")}
                    </Skeleton>
                </span>
            </div>
            <div className="flex items-center mb-2">
                <Skeleton className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    <Skeleton>
                        Last updated on{" "}
                        {moment(Date.now()).format("DD.MM.YYYY, HH:mm")}
                    </Skeleton>
                </span>
            </div>
            <div className="flex items-center mb-2">
                <Skeleton className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    <Skeleton>{numberBetween(0, 1000)} experiments</Skeleton>
                </span>
            </div>
            <div className="flex items-center mb-2">
                <Skeleton className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    <Skeleton>{numberBetween(0, 1000)} iterations</Skeleton>
                </span>
            </div>
        </div>
    );
};

export default ProjectCardSkeleton;
