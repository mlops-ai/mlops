import { useSearchParams } from "react-router-dom";

import { SearchOff } from "@/components/icons";

const ModelNoResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const isArchived = searchParams.get("archived") === "true";

    return (
        <div className="flex flex-col items-center justify-center m-16">
            <SearchOff className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                No {isArchived ? "archived" : "active or idle"} models found based on
                query.
            </p>
            <p className="text-sm text-center">
                All models are filtered out. <br />
                Check the validity of the query and try again.
            </p>
        </div>
    );
};

export default ModelNoResults;
