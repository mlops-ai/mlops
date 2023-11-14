import { cn } from "@/lib/utils";

interface MobileSidebarItemProps {
    path: string;
    title: string;
    Icon: any;
}

const MobileSidebarItem = ({ path, title, Icon }: MobileSidebarItemProps) => {
    return (
        <a
            className={cn(
                "group flex items-center justify-normal w-full h-[48px] py-[10px] px-3 rounded dark:hover:bg-mlops-action-hover-bg-dark hover:text-mlops-violet hover:bg-mlops-action-hover-bg transition duration-300",
                location.pathname.startsWith(path) &&
                    "dark:bg-mlops-nav-active-bg-dark bg-mlops-nav-active-bg"
            )}
            href={path}
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
                    "ml-2 font-semibold block text-mlops-primary-tx text-[16px] dark:group-hover:text-white dark:text-zinc-100 group-hover:text-mlops-violet transition duration-300",
                    location.pathname.startsWith(path) &&
                        "dark:text-white text-mlops-violet"
                )}
            >
                {title}
            </span>
        </a>
    );
};

export default MobileSidebarItem;
