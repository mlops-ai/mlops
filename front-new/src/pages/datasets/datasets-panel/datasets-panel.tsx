/**
 * Import utils functions
 */
import { cn } from "@/lib/utils";

/**
 * Import react and custom hooks
 */
import { useSearchParams } from "react-router-dom";
import { useModal } from "@/hooks/use-modal-hook";

/**
 * Import icons
 */
import { Plus, Search } from "lucide-react";
import { MdSort } from "react-icons/md";

/**
 * Import components
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/**
 * Datasets panel props interface
 */
interface DatasetsPanelProps {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
}

/**
 * Datasets panel component
 */
const DatasetsPanel = ({
    query,
    setQuery,
    setSortBy,
    disabled,
}: DatasetsPanelProps) => {
    /**
     * Custom modal hook for modal management
     */
    const { onOpen } = useModal();

    /**
     * Search params for managing search query
     */
    const [searchParams, setSearchParams] = useSearchParams({
        archived: "false",
    });

    /**
     * Constant used for switching between active and archived datasets
     */
    const isArchived = searchParams.get("archived") === "true";

    /**
     * Function for adding query to search params
     */
    const addQueryToSearchParams = () => {
        setSearchParams((prev) => {
            prev.set("search", query);
            return prev;
        });
    };

    /**
     * Function for handling onKeyDown event on input search
     * @runs when user press Enter key - add[update] query to[in] search params
     */
    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addQueryToSearchParams();
        }
    };

    /**
     * Dataset panel render
     */
    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-between h-auto gap-3 my-4",
                disabled && "hidden"
            )}
        >
            <div className="flex flex-wrap items-center gap-3">
                {!isArchived && (
                    <Button
                        variant="mlopsPrimary"
                        title="Create new dataset"
                        className="pt-1 pb-1 pl-2 pr-4 h-9"
                        onClick={() => onOpen("createDataset", {})}
                    >
                        <Plus className="flex-shrink-0 w-6 h-6 mr-1" /> New
                        dataset
                    </Button>
                )}

                <Input
                    className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx min-w-[250px] max-w-[300px] h-9"
                    placeholder="Search in datasets ..."
                    Icon={
                        <Search className="absolute flex-shrink-0 w-5 h-5 top-2 left-2 dark:text-mlops-primary-tx-dark text-mlops-primary-tx" />
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleOnKeyDown}
                    disabled={disabled}
                />
            </div>

            <Select
                defaultValue={"UDESC"}
                onValueChange={setSortBy}
                disabled={disabled}
            >
                <SelectTrigger
                    className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx h-9 w-[220px] pl-2"
                    Icon={
                        <MdSort className="flex-shrink-0 w-5 h-5 mr-2 top-2 left-2 dark:text-mlops-primary-tx-dark text-mlops-primary-tx" />
                    }
                >
                    <SelectValue placeholder="Sort projects" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key="UDESC" value="UDESC">
                        Update date (DESC)
                    </SelectItem>
                    <SelectItem key="UASC" value="UASC">
                        Update date (ASC)
                    </SelectItem>
                    <SelectItem key="CDESC" value="CDESC">
                        Create date (DESC)
                    </SelectItem>
                    <SelectItem key="CASC" value="CASC">
                        Create date (ASC)
                    </SelectItem>
                    <SelectItem key="A-Z" value="AZ">
                        Dataset name A-Z
                    </SelectItem>
                    <SelectItem key="Z-A" value="ZA">
                        Dataset name Z-A
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default DatasetsPanel;
