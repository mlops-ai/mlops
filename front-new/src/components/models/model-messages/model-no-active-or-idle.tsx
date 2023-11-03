import { useModal } from "@/hooks/use-modal-hook";

import { Plus } from "lucide-react";
import { VscFolderActive } from "react-icons/vsc";

import { Button } from "@/components/ui/button";

const ModelNoActiveOrIdle = () => {
    const { onOpen } = useModal();
    return (
        <div className="flex flex-col items-center justify-center m-16">
            <VscFolderActive className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                No active or idle models.
            </p>
            <p className="text-sm text-center">
                There are no active or idle models in database. <br />
                Create an empty model to get started.
            </p>
            <div className="flex items-center h-8 my-4 whitespace-nowrap">
                <Button
                    variant="mlopsPrimary"
                    title="Create new model"
                    className="pt-1 pb-1 pl-2 pr-4 mr-3 h-9"
                    onClick={() => onOpen("createEmptyModel", {})}
                >
                    <Plus className="flex-shrink-0 w-6 h-6 mr-1" /> Create empty
                    model
                </Button>
            </div>
        </div>
    );
};

export default ModelNoActiveOrIdle;
