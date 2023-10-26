import Kbd from "@/components/kbd";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { ChevronDownSquare, ChevronRightSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ExperimentHeaderProps {
    title: string;
    description: string;
}

const ExperimentHeader = ({ title, description }: ExperimentHeaderProps) => {
    const [searchParams] = useSearchParams({
        el: "true",
    });

    const isVisible = searchParams.get("el") === "true";

    const navigate = useNavigate();

    return (
        <div className="mb-3">
            <div
                className={cn(
                    "flex items-center",
                    !isVisible &&
                        "justify-between lg:justify-normal flex-row-reverse lg:flex-row"
                )}
            >
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                            <div
                                className={cn(
                                    "p-[2px] transition duration-300 dark:hover:bg-mlops-action-hover-bg-dark hover:bg-mlops-action-hover-bg rounded cursor-pointer lg:mr-1 mr-0 text-mlops-primary-tx dark:text-mlops-primary-tx-dark",
                                    isVisible && "hidden"
                                )}
                                onClick={() => {
                                    let newUrlParams = new URLSearchParams(
                                        location.search
                                    );

                                    newUrlParams.set(
                                        "el",
                                        newUrlParams.get("el") &&
                                            newUrlParams.get("el") === "false"
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
                                <ChevronRightSquare className="hidden w-7 h-7 lg:block" />
                                <ChevronDownSquare className="block w-7 h-7 lg:hidden" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={0}>
                            <div className="flex items-center gap-x-2">
                                {!isVisible
                                    ? "Expand experiment list"
                                    : "Collapse experiment list"}
                                <Kbd>{"]"}</Kbd>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
            {description !== "" ? (
                <p>{description}</p>
            ) : (
                <p className="text-sm text-zinc-400">
                    No experiment description.
                </p>
            )}
        </div>
    );
};

export default ExperimentHeader;
