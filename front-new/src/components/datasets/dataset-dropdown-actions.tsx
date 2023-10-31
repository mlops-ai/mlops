import { MoreVertical } from "lucide-react";
import { Archive, Delete, Unarchive, Edit } from "@/components/icons";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import DatasetMenuHeader from "./dataset-card/dataset-menu/dataset-menu-header";
import { Dataset } from "@/types/dataset";
import CopyDatasetIdMenuItem from "./dataset-card/dataset-menu/copy-dataset-id-menu-item";
import ModalDatasetMenuItem from "./dataset-card/dataset-menu/modal-dataset-menu-item";
import PinUnpinDatasetMenuItem from "./dataset-card/dataset-menu/pin-unpin-dataset-menu-item";

interface DatasetCardProps {
    dataset: Dataset;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatasetDropdownActions = ({ dataset, setLoading }: DatasetCardProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <DropdownMenu>
                    <TooltipTrigger>
                        <DropdownMenuTrigger asChild>
                            <div className="p-2 transition duration-300 rounded-full group hover:dark:bg-mlops-action-hover-bg-dark hover:bg-mlops-action-hover-bg">
                                <MoreVertical className="w-6 h-6 transition duration-300 text-mlops-secondary-tx group-hover:text-mlops-primary-tx group-hover:dark:text-mlops-primary-tx-dark dark:text-[#D5D5D5]" />
                            </div>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <div className="flex items-center font-normal">
                            Datasets actions
                        </div>
                    </TooltipContent>
                    <DropdownMenuContent side="bottom" className="w-56">
                        <DatasetMenuHeader />
                        <DropdownMenuSeparator />
                        {!dataset.archived && (
                            <ModalDatasetMenuItem
                                dataset={dataset}
                                ItemType={DropdownMenuItem}
                                modalType="editDataset"
                                Icon={Edit}
                                menuDescription="Edit dataset information"
                            />
                        )}
                        <ModalDatasetMenuItem
                            dataset={dataset}
                            ItemType={DropdownMenuItem}
                            modalType="deleteDataset"
                            Icon={Delete}
                            menuDescription="Delete dataset"
                        />
                        <DropdownMenuSeparator />
                        {dataset.archived ? (
                            <ModalDatasetMenuItem
                                dataset={dataset}
                                ItemType={DropdownMenuItem}
                                modalType="restoreDataset"
                                Icon={Unarchive}
                                menuDescription="Restore dataset"
                            />
                        ) : (
                            <ModalDatasetMenuItem
                                dataset={dataset}
                                ItemType={DropdownMenuItem}
                                modalType="archiveDataset"
                                Icon={Archive}
                                menuDescription="Archive dataset"
                            />
                        )}
                        <DropdownMenuSeparator />
                        <PinUnpinDatasetMenuItem
                            dataset={dataset}
                            setLoading={setLoading}
                            ItemType={DropdownMenuItem}
                        />
                        <DropdownMenuSeparator />
                        <CopyDatasetIdMenuItem
                            dataset={dataset}
                            ItemType={DropdownMenuItem}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </Tooltip>
        </TooltipProvider>
    );
};

export default DatasetDropdownActions;
