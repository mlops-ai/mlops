import { useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";

interface TabItemProps {
    title: string;
    Icon: any;
    param: string;
    value: string;
}

const TabItem = ({ title, Icon, param, value }: TabItemProps) => {
    const [searchParams, setSearchParams] = useSearchParams({
        archived: "false",
    });

    const isActive = searchParams.get(param) === value;

    return (
        <div
            className={cn(
                "cursor-pointer group inline-flex items-center gap-2 px-4 py-2 font-medium text-gray-500 transition border-b-2 border-transparent rounded-t-md hover:bg-mlops-tabs-hover hover:text-mlops-primary-tx shrink-0 hover:border-gray-300 hover:dark:bg-[#a1a1aa22] hover:dark:text-mlops-primary-tx-dark hover:dark:border-mlops-primary-tx-dark/10",
                isActive &&
                    "bg-white border-mlops-primary-tx text-mlops-primary-tx font-bold hover:bg-white hover:text-mlops-primary-tx hover:border-mlops-primary-tx dark:border-white dark:text-white dark:bg-mlops-nav-bg-dark hover:dark:border-white hover:dark:text-white hover:dark:bg-mlops-nav-bg-dark"
            )}
            onClick={() =>
                setSearchParams(
                    (prev) => {
                        prev.set(param, value);
                        return prev;
                    },
                    { replace: true }
                )
            }
        >
            <Icon className="flex-shrink-0 w-5 h-5" />
            {title}
        </div>
    );
};

export default TabItem;
