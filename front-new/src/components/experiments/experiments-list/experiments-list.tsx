import { Project } from "@/types/project";
import ExperimentsListHeader from "./experiments-list-header";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce-hook";
import ExperimentsListItem from "./experiments-list-item";
import Fuse from "fuse.js";
import { SearchOff } from "@/components/icons";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ExperimentListProps {
    projectData: Project;
    handleCheckboxChange: (experiment_id: string) => void;
    handleCheckboxLabelClick: (experiment_id: string) => void;
}

const ExperimentList = ({
    projectData,
    handleCheckboxChange,
    handleCheckboxLabelClick,
}: ExperimentListProps) => {
    const [searchParams, setSearchParams] = useSearchParams({
        el: "true",
    });

    const isVisible = searchParams.get("el") === "true";

    /**
     * State for storing search query
     */
    const [query, setQuery] = useState("");

    /**
     * Custom debounceSearch hook for search query
     */
    const debounceSearch = useDebounce(query, 250);

    const fuseSearchExperiments = new Fuse(projectData.experiments, {
        includeScore: true,
        minMatchCharLength: 1,
        threshold: 0.25,
        keys: ["name"],
    });

    const experimentsList = () => {
        if (debounceSearch === "") {
            return projectData.experiments.map((experiment) => (
                <ExperimentsListItem
                    key={experiment.id}
                    projectData={projectData}
                    experiment={experiment}
                    handleCheckboxChange={handleCheckboxChange}
                    handleCheckboxLabelClick={handleCheckboxLabelClick}
                />
            ));
        }
        let filteredExperiments = fuseSearchExperiments.search(debounceSearch);

        if (filteredExperiments.length === 0) {
            return (
                <div className="text-center">
                    <SearchOff className="flex-grow-0 flex-shrink-0 w-12 h-12 m-auto text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                    <h3 className="text-lg font-semibold">
                        No experiments based on query
                    </h3>
                    All experiments are filtered out. Check the validity of the
                    query and try again.
                </div>
            );
        }

        return filteredExperiments.map((result) => (
            <ExperimentsListItem
                key={result.item.id}
                projectData={projectData}
                experiment={result.item}
                handleCheckboxChange={handleCheckboxChange}
                handleCheckboxLabelClick={handleCheckboxLabelClick}
            />
        ));
    };

    return (
        <div
            className={cn(
                "lg:w-[300px] w-full flex-shrink-0",
                !isVisible && "hidden"
            )}
        >
            <ExperimentsListHeader projectData={projectData} />
            {projectData.experiments.length > 0 && (
                <Input
                    className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx w-full h-9 mb-1 flex-shrink-0"
                    placeholder="Search in experiments"
                    Icon={
                        <Search className="absolute flex-shrink-0 w-5 h-5 top-2 left-2 dark:text-mlops-primary-tx-dark text-mlops-primary-tx" />
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            )}
            <div className="flex flex-col">{experimentsList()}</div>
        </div>
    );
};

export default ExperimentList;
