import { useModal } from "@/hooks/use-modal-hook";

import { Plus } from "lucide-react";
import { VscFolderActive } from "react-icons/vsc";

import { Button } from "@/components/ui/button";

const DatasetNoActive = () => {
    const { onOpen } = useModal();
    return (
        <div className="flex flex-col items-center justify-center m-16">
            <VscFolderActive className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                No active datasets.
            </p>
            <p className="text-sm text-center">
                There are no active datasets in database. <br />
                Create a new dataset to use it in new iterations.
            </p>
            <div className="flex items-center h-8 my-4 whitespace-nowrap">
                <Button
                    variant="mlopsPrimary"
                    title="Create new dataset"
                    className="pt-1 pb-1 pl-2 pr-4 mr-3 h-9"
                    onClick={() => onOpen("createDataset", {})}
                >
                    <Plus className="flex-shrink-0 w-6 h-6 mr-1" /> Create 
                    new dataset
                </Button>
            </div>
        </div>
    );
};

export default DatasetNoActive;
