import { useSearchParams } from "react-router-dom";

import { lorem, numberBetween } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

import { ModelStatus } from "@/types/types";
import moment from "moment";

const ModelCardSkeleton = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const isArchived = searchParams.get("archived") === "true";

    const statuses = [ModelStatus.ACTIVE, ModelStatus.IDLE];

    return (
        <div className="flex flex-col w-full p-4 text-transparent bg-white rounded shadow-lg select-none dark:bg-mlops-nav-bg-dark">
            <div className="flex items-center justify-between mb-2 font-semibold">
                <Skeleton className="flex items-center w-full mr-2">
                    Example model
                </Skeleton>
                <Skeleton className="p-2 rounded-full">
                    <Skeleton className="w-6 h-6" />
                </Skeleton>
            </div>
            <div className="flex items-center mb-3">
                {!isArchived && (
                    <Skeleton className="text-xs py-[2px] px-[10px] rounded">
                        {statuses[numberBetween(0, 1)]}
                    </Skeleton>
                )}
                {isArchived && (
                    <Skeleton className="text-xs py-[2px] px-[10px] rounded">
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
                    <Skeleton>Based on model from example iteration.</Skeleton>
                </span>
            </div>
            <div className="flex items-center mb-2">
                <Skeleton className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    <Skeleton>10 historical iterations.</Skeleton>
                </span>
            </div>
            <div className="flex items-center mb-2">
                <Skeleton className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    <Skeleton>
                        Last prediction on{" "}
                        {moment(Date.now()).format("DD.MM.YYYY, HH:mm")}
                    </Skeleton>
                </span>
            </div>
        </div>
    );
};

export default ModelCardSkeleton;
