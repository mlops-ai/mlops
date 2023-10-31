import Analytics from "@/components/icons/analytics";
import Link from "@/components/icons/link";
import { Keyable } from "@/types/types";
import { CalendarDays } from "lucide-react";
import moment from "moment-timezone";
import { GoIterations } from "react-icons/go";
import { MdUpdate } from "react-icons/md";

interface DatasetCardInfoProps {
    created_at: Date;
    updated_at: Date;
    path_to_dataset: string;
    version?: string;
    linked_iterations?: Keyable;
}

const DatasetCardInfo = ({
    created_at,
    updated_at,
    path_to_dataset,
    version,
    linked_iterations,
}: DatasetCardInfoProps) => {
    const versionBlock = () => {
        if (version && version !== "") {
            return (
                <>
                    <Analytics className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                    <span className="text-sm font-semibold">{version}</span>
                </>
            );
        }
        return (
            <>
                <Analytics className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm text-zinc-400">
                    No version specified.
                </span>
            </>
        );
    };

    let iterationsCount = Object.getOwnPropertyNames(linked_iterations).length;

    const IterationsBlock = () => {
        if (iterationsCount === 0) {
            return (
                <span className="text-sm text-zinc-400">
                    Connected with 0 iterations
                </span>
            );
        } else if (iterationsCount === 1) {
            return (
                <span className="text-sm font-semibold">
                    Connected with 1 iteration
                </span>
            );
        }
        return (
            <span className="text-sm font-semibold">
                Connected with {iterationsCount} iterations
            </span>
        );
    };

    return (
        <>
            <div className="flex flex-col mb-2">
                <div className="flex items-center mb-2" title="Dataset Path">
                    <Link className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                    <span className="text-sm font-semibold break-words break-all">
                        {path_to_dataset}
                    </span>
                </div>
                <div className="flex items-center mb-2" title="Dataset version">
                    {versionBlock()}
                </div>
                <div className="flex items-center mb-2" title="Creation Date">
                    <CalendarDays className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                    <span className="text-sm font-semibold">
                        Created on{" "}
                        {moment(created_at).format("DD.MM.YYYY, HH:mm")}
                    </span>
                </div>
                <div
                    className="flex items-center mb-2"
                    title="Last Modification Date"
                >
                    <MdUpdate className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                    <span className="text-sm font-semibold">
                        Last updated on{" "}
                        {moment(updated_at).format("DD.MM.YYYY, HH:mm")}
                    </span>
                </div>
                <div className="flex items-center mb-2"  title="Dataset Iteration">
                    <GoIterations className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                    {IterationsBlock()}
                </div>
            </div>
        </>
    );
};

export default DatasetCardInfo;
