import { Delete, Edit, Loading } from "@/components/icons";
import ClearFilter from "@/components/icons/clear-filter";
import ClearSorting from "@/components/icons/clear-sorting";
import Compare from "@/components/icons/compare";
import Download from "@/components/icons/download";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTreeselect } from "@/hooks/use-tree-select-hook";
import { ChevronDown, Search } from "lucide-react";
import { TreeSelect } from "primereact/treeselect";
import { MutableRefObject, useEffect, useRef } from "react";
import { MdSort } from "react-icons/md";

const IterationsPanel = () => {

    const treeselect = useTreeselect();

    const deleteButton = useRef() as MutableRefObject<HTMLButtonElement>;
    const editButton = useRef() as MutableRefObject<HTMLButtonElement>;
    const compareButton = useRef() as MutableRefObject<HTMLButtonElement>;

    useEffect(() => {
        deleteButton.current.disabled = true;
        editButton.current.disabled = true;
        compareButton.current.disabled = true;
    }, [])

    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                <Select
                    defaultValue="ALLTIME"
                    // onValueChange={setSortBy}
                    // disabled={disabled}
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
                        <SelectItem key="ALLTIME" value="ALLTIME">
                            All time
                        </SelectItem>
                        <SelectItem key="LAST1H" value="LAST1H">
                            Last hour
                        </SelectItem>
                        <SelectItem key="LAST3H" value="LAST3H">
                            Last 3 hours
                        </SelectItem>
                        <SelectItem key="LAST6H" value="LAST6H">
                            Last 6 hours
                        </SelectItem>
                        <SelectItem key="LAST12H" value="LAST12H">
                            Last 12 hours
                        </SelectItem>
                        <SelectItem key="LAST24H" value="LAST24H">
                            Last 24 hours
                        </SelectItem>
                        <SelectItem key="LAST7D" value="LAST7D">
                            Last 7 days
                        </SelectItem>
                        <SelectItem key="LAST30D" value="LAST30D">
                            Last 30 days
                        </SelectItem>
                        <SelectItem key="LAST90D" value="LAST90D">
                            Last 90 days
                        </SelectItem>
                        <SelectItem key="LAST180D" value="LAST180D">
                            Last 180 days
                        </SelectItem>
                        <SelectItem key="LASTY" value="LASTY">
                            Last year
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx w-[320px] h-9"
                    placeholder="Filter rows by text data columns ..."
                    Icon={
                        <Search className="absolute flex-shrink-0 w-5 h-5 top-2 left-2 dark:text-mlops-primary-tx-dark text-mlops-primary-tx" />
                    }
                    // value={query}
                    // onChange={(e) =>
                    //     setQuery(e.target.value)
                    // }
                    // onKeyDown={handleOnKeyDown}
                    // disabled={disabled}
                />

                <TreeSelect
                    value={treeselect.selectedOptions}
                    options={treeselect.options}
                    placeholder="Select columns to display ..."
                    selectionMode="checkbox"
                    expandedKeys={treeselect.expandedKeys}
                    resetFilterOnHide={true}
                    // @ts-ignore
                    onChange={(e) => {console.log(e.value); treeselect.setSelectedOptions(e.value)}}
                    onToggle={(e) => {console.log(e.value); treeselect.setExpandedKeys(e.value)}}
                    scrollHeight="300px"
                    filter
                    dropdownIcon={
                        <ChevronDown className="w-4 h-4 mr-2 opacity-50" />
                    }
                ></TreeSelect>
            </div>

            <div className="my-4 text-base border-b-2 border-gray-200 dark:border-gray-700"></div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Button ref={deleteButton} variant="mlopsGridAction" size="grid">
                        <Delete className="flex-shrink-0 w-6 h-6 mr-1" /> Delete
                    </Button>

                    <Button ref={editButton} variant="mlopsGridAction" size="grid">
                        <Edit className="flex-shrink-0 w-6 h-6 mr-1" /> Rename
                    </Button>

                    <Button ref={compareButton} variant="mlopsGridAction" size="grid">
                        <Compare className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Compare
                    </Button>

                    <Button variant="mlopsGridAction" size="grid">
                        <ClearFilter className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Clear filters
                    </Button>

                    <Button variant="mlopsGridAction" size="grid">
                        <ClearSorting className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Clear sorting
                    </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="mlopsGridAction" size="grid">
                        <Download className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Export to CSV
                    </Button>

                    <Button variant="mlopsGridAction" size="grid">
                        <Loading className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Refresh
                    </Button>
                </div>
            </div>
        </>
    );
};

export default IterationsPanel;
