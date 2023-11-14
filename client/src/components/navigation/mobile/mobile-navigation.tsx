import { cn } from "@/lib/utils";

import { helpNavigationItems, mainNavigationItems } from "@/config/navigation";

import SectionSeparator from "@/components/navigation/section-separator";
import MobileSidebarItem from "@/components/navigation/mobile/mobile-sidebar-item";

const MobileNavigation = () => {
    return (
        <div className="flex flex-col bg-mlops-nav-bg dark:bg-mlops-nav-bg-dark">
            <div className="w-[280px]">
                <a
                    className="flex items-center justify-normal w-full px-3 my-[10px] h-9"
                    href="/"
                >
                    <img src="/mlops.svg" alt="logo" className="w-8 h-8" />
                    <span className="ml-2 font-bold block text-[26px] text-mlops-primary-tx dark:text-mlops-primary-tx-dark font-logo">
                        MLOps
                    </span>
                </a>
            </div>
            <div
                className={cn(
                    "flex flex-none flex-col items-center w-[280px] h-[calc(100vh-56px)] overflow-hidden dark:bg-mlops-nav-bg-dark bg-white shadow-md"
                )}
            >
                <div className="w-full px-2">
                    <SectionSeparator />
                    <div className="flex flex-col items-center w-full gap-[6px] my-2">
                        {mainNavigationItems.map((item) => (
                            <MobileSidebarItem
                                key={item.path}
                                path={item.path}
                                title={item.title}
                                Icon={item.icon}
                            />
                        ))}
                    </div>
                    <SectionSeparator />
                    <div className="flex flex-col items-center w-full gap-[6px] my-2">
                        {helpNavigationItems.map((item) => (
                            <MobileSidebarItem
                                key={item.path}
                                path={item.path}
                                title={item.title}
                                Icon={item.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNavigation;
