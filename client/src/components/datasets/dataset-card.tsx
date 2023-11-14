import { useState } from "react";

import { cn } from "@/lib/utils";

import { Loading } from "@/components/icons";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dataset } from "@/types/dataset";
import DatasetCardHeader from "./dataset-card/dataset-card-header";
import DatasetCardTags from "./dataset-card/dataset-card-tags";
import DatasetCardDescription from "./dataset-card/dataset-card-description";
import DatasetCardInfo from "./dataset-card/dataset-card-info";
import DatasetContextMenuContent from "./dataset-card/dataset-context-menu-content";

interface DatasetCardProps {
    dataset: Dataset;
    scrollTo?: boolean;
}

const DatasetCard = ({ dataset, scrollTo }: DatasetCardProps) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <ContextMenu>
                <ContextMenuTrigger id={dataset._id}>
                    <div
                        className={cn(
                            "relative flex flex-col w-full p-4 bg-white rounded-md shadow-lg dark:bg-mlops-nav-bg-dark transition duration-300",
                            scrollTo &&
                                "border-2 border-mlops-primary-tx dark:border-mlops-primary-tx-dark"
                        )}
                    >
                        <DatasetCardHeader
                            dataset={dataset}
                            setLoading={setIsLoading}
                        />
                        <DatasetCardTags
                            tags={dataset.tags}
                            version={dataset.version}
                            archived={dataset.archived}
                        />
                        <DatasetCardDescription
                            description={dataset.dataset_description}
                        />
                        <DatasetCardInfo
                            created_at={dataset.created_at}
                            updated_at={dataset.updated_at}
                            path_to_dataset={dataset.path_to_dataset}
                            version={dataset.version}
                            linked_iterations={dataset.linked_iterations}
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
                <DatasetContextMenuContent
                    dataset={dataset}
                    setLoading={setIsLoading}
                />
            </ContextMenu>
        </div>
    );
};

export default DatasetCard;
