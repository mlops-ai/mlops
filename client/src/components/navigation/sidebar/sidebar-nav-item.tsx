import { cn } from "@/lib/utils";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams } from "react-router-dom";

interface SidebarNavItemProps {
    path: string;
    title: string;
    Icon: any;
    collapsedLg: boolean;
    expandedMd: boolean;
    type: "internal" | "external";
}

const SidebarNavItem = ({
    path,
    title,
    Icon,
    collapsedLg,
    expandedMd,
    type,
}: SidebarNavItemProps) => {
    const [searchParams] = useSearchParams({
        ne: "default",
    });

    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger className="w-full" key={path}>
                    <a
                        className={cn(
                            "group flex items-center lg:justify-normal justify-center lg:w-full w-[48px] h-[48px] py-[10px] px-3 rounded dark:hover:bg-mlops-action-hover-bg-dark hover:text-mlops-violet hover:bg-mlops-action-hover-bg transition duration-300",
                            location.pathname.startsWith(path) &&
                                "dark:bg-mlops-nav-active-bg-dark bg-mlops-nav-active-bg",
                            collapsedLg && "lg:justify-center lg:w-[48px]",
                            expandedMd && "sm:justify-normal sm:w-full"
                        )}
                        href={`${path}${
                            type === "internal" &&
                            searchParams.get("ne") !== "default"
                                ? `?ne=${searchParams.get("ne")}`
                                : ""
                        }`}
                    >
                        <Icon
                            className={cn(
                                "w-6 h-6 text-mlops-gray dark:text-[#D5D5D5] group-hover:text-mlops-violet dark:group-hover:text-white transition duration-400",
                                location.pathname.startsWith(path) &&
                                    "dark:text-white text-mlops-violet"
                            )}
                        />
                        <span
                            className={cn(
                                "ml-2 font-semibold lg:block hidden text-mlops-primary-tx text-[16px] dark:group-hover:text-white dark:text-zinc-100 group-hover:text-mlops-violet transition duration-300",
                                location.pathname.startsWith(path) &&
                                    "dark:text-white text-mlops-violet",
                                collapsedLg && "lg:hidden",
                                expandedMd && "sm:block"
                            )}
                        >
                            {title}
                        </span>
                    </a>
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    className={cn(
                        "block lg:hidden",
                        collapsedLg && "lg:block",
                        expandedMd && "sm:hidden"
                    )}
                >
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default SidebarNavItem;
