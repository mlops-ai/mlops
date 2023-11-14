import { useState } from "react";

import { cn } from "@/lib/utils";

import { Loading } from "@/components/icons";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

import { Model } from "@/types/model";
import ModelCardHeader from "./model-card/model-card-header";
import ModelCardStatus from "./model-card/model-card-status";
import ModelCardDescription from "./model-card/model-card-description";
import ModelCardInfo from "./model-card/model-card-info";
import ModelContextMenuContent from "./model-card/model-context-menu-content";

interface ModelCardProps {
    model: Model;
}

const ModelCard = ({ model }: ModelCardProps) => {
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
                        <ModelCardHeader
                            model={model}
                            setLoading={setIsLoading}
                        />
                        <ModelCardStatus
                            status={model.model_status}
                        />
                        <ModelCardDescription
                            description={model.model_description}
                        />
                        <ModelCardInfo
                            iteration={model.iteration}
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
                <ModelContextMenuContent
                    model={model}
                    setLoading={setIsLoading}
                />
            </ContextMenu>
        </div>
    );
};

export default ModelCard;
