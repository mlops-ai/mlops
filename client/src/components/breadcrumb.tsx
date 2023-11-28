import BreadcrumbSeparator from "@/components/icons/breadcrumb-separator";
import { Link, useSearchParams } from "react-router-dom";

interface BreadcrumbItem {
    name: string;
    href?: string;
    Icon: any;
    hasParams?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

/**
 * Breadcrumb component.
 */
const Breadcrumb = ({ items }: BreadcrumbProps) => {
    const [searchParams] = useSearchParams({
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
                    <Link
                        className="flex items-center text-sm font-semibold hover:text-[#51678f] hover:dark:dark:text-zinc-300 transition duration-300 mr-[2px]"
                        to={`${item.href}${
                            searchParams.get("ne") !== "default"
                                ? `${
                                      item.hasParams ? "&" : "?"
                                  }ne=${searchParams.get("ne")}`
                                : ""
                        }`}
                    >
                        <item.Icon className="flex-shrink-0 w-4 h-4 mr-1" />
                        {item.name}
                    </Link>
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
        </div>
    );
};

export default Breadcrumb;
