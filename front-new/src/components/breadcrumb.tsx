import BreadcrumbSeparator from "@/components/icons/breadcrumb-separator";
import { useSearchParams } from "react-router-dom";

interface BreadcrumbItem {
    name: string;
    href?: string;
    Icon: any;
    hasParams?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    const [searchParams, setSearchParams] = useSearchParams({
        ne: "default",
    });

    const breadcrumbLastItemIndex = items.length - 1;
    const breadcrumb = items.map((item, index) => {
        if (index === breadcrumbLastItemIndex) {
            return (
                <p
                    key={index}
                    className="flex items-center text-sm font-semibold text-[#51678f] dark:text-zinc-300"
                >
                    <item.Icon className="flex-shrink-0 w-4 h-4 mr-1" />
                    {item.name}
                </p>
            );
        }

        if (item.href) {
            return (
                <div key={index} className="flex items-center">
                    <a
                        className="flex items-center text-sm font-semibold hover:text-[#51678f] hover:dark:dark:text-zinc-300 transition duration-300 mr-[2px]"
                        href={`${item.href}${
                            searchParams.get("ne") !== "default"
                                ? `${item.hasParams ? '&' : '?'}ne=${searchParams.get("ne")}`
                                : ""
                        }`}
                    >
                        <item.Icon className="flex-shrink-0 w-4 h-4 mr-1" />
                        {item.name}
                    </a>
                    <BreadcrumbSeparator className="w-[1.25rem] h-[1.25rem] flex-shrink-0 mr-[2px]" />
                </div>
            );
        }
        return (
            <div key={index} className="flex items-center">
                <p className="flex items-center mr-[2px] text-sm font-semibold">
                    <item.Icon className="flex-shrink-0 w-4 h-4 mr-1" />
                    {item.name}
                </p>
                <BreadcrumbSeparator className="w-[1.25rem] h-[1.25rem] flex-shrink-0 mr-[2px]" />
            </div>
        );
    });

    return (
        <div className="flex items-center text-mlops-gray dark:text-zinc-400">
            {breadcrumb}
            {/* <p className="flex items-center text-sm font-semibold">
                <LayoutDashboard className="flex-shrink-0 w-4 h-4 mr-1" />
                Projects
            </p>
            <BreadcrumbSeparator className="w-[1.25rem] h-[1.25rem] flex-shrink-0" />
            <p className="flex items-center text-sm font-semibold text-[#51678f] dark:text-zinc-300">
                <LayoutDashboard className="flex-shrink-0 w-4 h-4 mr-1" />
                Projects
            </p> */}
            {/* <svg
                className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"></path>
            </svg>
            <p className="flex items-center text-sm font-semibold">
                <VscProject className="flex-shrink-0 w-4 h-4 mr-1" />
                Project
            </p>
            <svg
                className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"></path>
            </svg>
            <p className="flex items-center text-sm font-semibold">
                <AiOutlineExperiment className="flex-shrink-0 w-4 h-4 mr-1" />
                Experiment
            </p>
            <svg
                className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"></path>
            </svg>
            <p className="flex items-center text-sm font-semibold">
                <GoIterations className="flex-shrink-0 w-4 h-4 mr-1" />
                Iteration
            </p> */}
        </div>
    );
};

export default Breadcrumb;
