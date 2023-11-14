import Kbd from "@/components/kbd";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "@/hooks/use-modal-hook";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { ChevronLeftSquare, ChevronUpSquare, PlusCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ExperimentsListHeaderProps {
    projectData: Project;
}

const ExperimentsListHeader = ({ projectData }: ExperimentsListHeaderProps) => {
    const { onOpen } = useModal();

    const [searchParams] = useSearchParams({
        el: "true",
    });

    const isVisible = searchParams.get("el") === "true";

    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "flex items-center justify-between mb-1 text-xl font-semibold",
                !isVisible && "hidden"
            )}
        >
            Experiments
            <div className="flex items-center dark:text-mlops-primary-tx-dark text-mlops-primary-tx gap-x-[2px]">
                <div
                    className="p-[2px] transition duration-300 dark:hover:bg-mlops-action-hover-bg-dark hover:bg-mlops-action-hover-bg rounded cursor-pointer"
                    title="Add experiment"
                    onClick={() =>
                        onOpen("createExperiment", {
                            project: projectData,
                        })
                    }
                >
                    <PlusCircle className="w-7 h-7" />
                </div>
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                            <div
                                className="p-[2px] transition duration-300 dark:hover:bg-mlops-action-hover-bg-dark hover:bg-mlops-action-hover-bg rounded cursor-pointer"
                                onClick={() => {
                                    let newUrlParams = new URLSearchParams(
                                        location.search
                                    );
                                    
                                    newUrlParams.set(
                                        "el",
                                        newUrlParams.get("el") && newUrlParams.get("el") === "false"
                                            ? "true"
                                            : "false"
                                    );

                                    navigate(
                                        {
                                            pathname: location.pathname,
                                            search: newUrlParams.toString(),
                                        },
                                        { replace: true }
                                    );
                                }}
                            >
                                <ChevronLeftSquare className="hidden w-7 h-7 lg:block" />
                                <ChevronUpSquare className="block w-7 h-7 lg:hidden" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent
                            sideOffset={4}
                            side="right"
                            className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 font-normal flex items-center gap-x-2"
                        >
                            {!isVisible
                                ? "Expand experiment list"
                                : "Collapse experiment list"}
                            <Kbd>{"]"}</Kbd>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ExperimentsListHeader;
