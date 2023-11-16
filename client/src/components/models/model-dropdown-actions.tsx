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

import { Model } from "@/types/model";
import ModelMenuHeader from "./model-card/model-menu/model-menu-header";
import CopyModelIdMenuItem from "./model-card/model-menu/copy-model-id-menu-item";
import ModalModelMenuItem from "./model-card/model-menu/modal-model-menu-item";
import { ModelStatus } from "@/types/types";
import PinUnpinModelMenuItem from "./model-card/model-menu/pin-unpin-model-menu-item";

interface ModelCardProps {
    model: Model;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModelDropdownActions = ({ model, setLoading }: ModelCardProps) => {
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
                            Models actions
                        </div>
                    </TooltipContent>
                    <DropdownMenuContent side="bottom" className="w-56">
                        <ModelMenuHeader />
                        <DropdownMenuSeparator />
                        {model.model_status !== ModelStatus.ARCHIVED && (
                            <ModalModelMenuItem
                                model={model}
                                ItemType={DropdownMenuItem}
                                modalType="editModel"
                                Icon={Edit}
                                menuDescription="Edit model information"
                            />
                        )}
                        <ModalModelMenuItem
                            model={model}
                            ItemType={DropdownMenuItem}
                            modalType="deleteModel"
                            Icon={Delete}
                            menuDescription="Delete model"
                        />
                        <DropdownMenuSeparator />
                        {model.model_status === ModelStatus.ARCHIVED ? (
                            <ModalModelMenuItem
                                model={model}
                                ItemType={DropdownMenuItem}
                                modalType="restoreModel"
                                Icon={Unarchive}
                                menuDescription="Restore model"
                            />
                        ) : (
                            <ModalModelMenuItem
                                model={model}
                                ItemType={DropdownMenuItem}
                                modalType="archiveModel"
                                Icon={Archive}
                                menuDescription="Archive model"
                            />
                        )}
                        <DropdownMenuSeparator />
                        <PinUnpinModelMenuItem
                            model={model}
                            setLoading={setLoading}
                            ItemType={DropdownMenuItem}
                        />
                        <DropdownMenuSeparator />
                        <CopyModelIdMenuItem
                            model={model}
                            ItemType={DropdownMenuItem}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ModelDropdownActions;
