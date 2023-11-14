import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";

import { breakpoints } from "@/config/breakpoints";

import { PanelLeftClose, PanelRightClose } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNavigation from "@/components/navigation/mobile/mobile-navigation";
import SearchDialog from "@/components/search/search-dialog";
import Kbd from "@/components/kbd";

const NavigationTopbar = () => {
    const [searchParams] = useSearchParams({
        ne: "default",
    });

    const isCollapsedLg = searchParams.get("ne") === "collapsed-lg";
    const isExpandedMd = searchParams.get("ne") === "expanded-md";
    const isDefault = searchParams.get("ne") === "default";

    const setNavigationParams = (
        action: string,
        isCollapsedLg: boolean,
        isExpandedMd: boolean
    ) => {
        let param: string;
        if (action === "hide") {
            if (isExpandedMd && window.innerWidth < breakpoints["lg"]) {
                param = "default";
            } else {
                param = "collapsed-lg";
            }
        } else if (action === "expand") {
            if (isCollapsedLg && window.innerWidth >= breakpoints["lg"]) {
                param = "default";
            } else {
                param = "expanded-md";
            }
        } else {
            param = "default";
        }

        let newUrlParams = new URLSearchParams(location.search);
        newUrlParams.set("ne", param);

        navigate(
            {
                pathname: location.pathname,
                search: newUrlParams.toString(),
            },
            { replace: true }
        );
    };

    const navigate = useNavigate();

    useEffect(() => {
        const onKeyDownSB = (event: KeyboardEvent) => {
            if (event.key === "[") {
                event.preventDefault();
                if (event.repeat) {
                    return;
                }

                let param: string;
                if (window.innerWidth <= breakpoints["sm"]) {
                    return;
                }

                if (isDefault) {
                    if (window.innerWidth >= breakpoints["lg"]) {
                        param = "collapsed-lg";
                    } else {
                        param = "expanded-md";
                    }
                } else if (isCollapsedLg) {
                    if (window.innerWidth >= breakpoints["lg"]) {
                        param = "default";
                    } else {
                        param = "expanded-md";
                    }
                } else if (isExpandedMd) {
                    if (window.innerWidth < breakpoints["lg"]) {
                        param = "default";
                    } else {
                        param = "collapsed-lg";
                    }
                } else {
                    param = "default";
                }

                let newUrlParams = new URLSearchParams(location.search);
                newUrlParams.set("ne", param);

                navigate(
                    {
                        pathname: location.pathname,
                        search: newUrlParams.toString(),
                    },
                    { replace: true }
                );
            }
        };

        document.addEventListener("keydown", onKeyDownSB);

        return () => {
            document.removeEventListener("keydown", onKeyDownSB);
        };
    }, [isDefault, isCollapsedLg, isExpandedMd]);

    return (
        <>
            <header className="flex items-center h-[56px] fixed z-50 bg-mlops-nav-bg dark:bg-mlops-nav-bg-dark w-full shadow-md">
                <div
                    className={cn(
                        "lg:w-[280px] w-[64px] bg-mlops-nav-bg dark:bg-mlops-nav-bg-dark lg:border-r lg:border-gray-300 lg:dark:border-gray-700 lg:h-[40px]",
                        isCollapsedLg && "lg:w-[64px] lg:border-none",
                        isExpandedMd &&
                            "sm:w-[280px] sm:border-r sm:border-gray-300 sm:dark:border-gray-700 sm:h-[40px]"
                    )}
                >
                    <a
                        className={cn(
                            "flex flex-shrink-0 flex-grow-0 items-center justify-center lg:justify-normal w-full lg:px-3 px-1 my-[10px] h-9 lg:my-[2px]",
                            isCollapsedLg && "lg:justify-center",
                            isExpandedMd &&
                                "sm:justify-normal sm:px-3 sm:my-[2px]"
                        )}
                        href={`/projects${
                            searchParams.get("ne") !== "default"
                                ? `?ne=${searchParams.get("ne")}`
                                : ""
                        }`}
                    >
                        <img src="/mlops.svg" alt="logo" className="w-8 h-8" />
                        <span
                            className={cn(
                                "ml-2 font-bold lg:block hidden text-[26px] text-mlops-primary-tx dark:text-mlops-primary-tx-dark font-logo",
                                isCollapsedLg && "lg:hidden",
                                isExpandedMd && "sm:block"
                            )}
                        >
                            MLOps
                        </span>
                    </a>
                </div>
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger className="ml-[-4px]">
                            <div
                                className={cn(
                                    "flex items-center w-10 h-10 ml-1 rounded cursor-pointer dark:hover:bg-mlops-action-hover-bg-dark hover:bg-mlops-action-hover-bg lg:absolute sm:static static sm:top-[8px] sm:left-[230px] transition duration-300",
                                    isCollapsedLg && "lg:static",
                                    isExpandedMd && "sm:absolute"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-[6px] lg:block hidden transition duration-300",
                                        isCollapsedLg && "lg:hidden",
                                        isExpandedMd && "sm:block"
                                    )}
                                    onClick={() =>
                                        setNavigationParams(
                                            "hide",
                                            isCollapsedLg,
                                            isExpandedMd
                                        )
                                    }
                                >
                                    <PanelLeftClose
                                        className={cn(
                                            "hidden w-7 h-7 text-mlops-primary-tx dark:text-mlops-primary-tx-dark lg:block transition duration-300",
                                            isCollapsedLg && "lg:hidden",
                                            isExpandedMd && "sm:block"
                                        )}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        "p-[6px] lg:hidden sm:block hidden transition duration-300",
                                        isCollapsedLg && "lg:block",
                                        isExpandedMd && "sm:hidden"
                                    )}
                                    onClick={() =>
                                        setNavigationParams(
                                            "expand",
                                            isCollapsedLg,
                                            isExpandedMd
                                        )
                                    }
                                >
                                    <PanelRightClose
                                        className={cn(
                                            "sm:block hidden w-7 h-7 text-mlops-primary-tx dark:text-mlops-primary-tx-dark lg:hidden transition duration-300",
                                            isCollapsedLg && "lg:block",
                                            isExpandedMd && "sm:hidden"
                                        )}
                                    />
                                </div>

                                <Sheet>
                                    <SheetTrigger asChild>
                                        <div
                                            className={cn(
                                                "p-[6px] sm:hidden block"
                                            )}
                                            onClick={() =>
                                                setNavigationParams(
                                                    "default",
                                                    isCollapsedLg,
                                                    isExpandedMd
                                                )
                                            }
                                        >
                                            <PanelRightClose
                                                className={cn(
                                                    "sm:hidden block w-7 h-7 text-mlops-primary-tx dark:text-mlops-primary-tx-dark lg:hidden"
                                                )}
                                            />
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="flex gap-0 p-0 w-[280px] sm:hidden"
                                    >
                                        <MobileNavigation />
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <div className="flex items-center">
                                <span
                                    className={cn(
                                        "hidden mr-2 lg:block",
                                        isCollapsedLg && "lg:hidden",
                                        isExpandedMd && "sm:block"
                                    )}
                                >
                                    Collapse navigation
                                </span>
                                <span
                                    className={cn(
                                        "block mr-2 lg:hidden",
                                        isCollapsedLg && "lg:block",
                                        isExpandedMd && "sm:hidden"
                                    )}
                                >
                                    Expand navigation
                                </span>
                                <Kbd>{"["}</Kbd>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex items-center justify-between flex-grow mr-2">
                    <SearchDialog />
                    <ModeToggle />
                </div>
            </header>
        </>
    );
};

export default NavigationTopbar;
