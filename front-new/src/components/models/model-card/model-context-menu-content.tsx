import { Archive, Delete, Unarchive, Edit } from "@/components/icons";

import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";
import ProjectMenuHeader from "./model-menu/model-menu-header";

import CopyModelIdMenuItem from "./model-menu/copy-model-id-menu-item";
import { Model } from "@/types/model";
import ModalModelMenuItem from "./model-menu/modal-model-menu-item";
import { ModelStatus } from "@/types/types";
import PinUnpinModelMenuItem from "./model-menu/pin-unpin-model-menu-item";

interface ModelCardProps {
    model: Model;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModelContextMenuContent = ({ model, setLoading }: ModelCardProps) => {
    return (
        <ContextMenuContent className="w-56">
            <ProjectMenuHeader />
            <ContextMenuSeparator />
            {model.model_status !== ModelStatus.ARCHIVED && (
                <ModalModelMenuItem
                    model={model}
                    ItemType={ContextMenuItem}
                    modalType="editModel"
                    Icon={Edit}
                    menuDescription="Edit model information"
                />
            )}
            <ModalModelMenuItem
                model={model}
                ItemType={ContextMenuItem}
                modalType="deleteModel"
                Icon={Delete}
                menuDescription="Delete model"
            />
            <ContextMenuSeparator />
            {model.model_status === ModelStatus.ARCHIVED ? (
                <ModalModelMenuItem
                    model={model}
                    ItemType={ContextMenuItem}
                    modalType="restoreModel"
                    Icon={Unarchive}
                    menuDescription="Restore model"
                />
            ) : (
                <ModalModelMenuItem
                    model={model}
                    ItemType={ContextMenuItem}
                    modalType="archiveModel"
                    Icon={Archive}
                    menuDescription="Archive model"
                />
            )}
            <ContextMenuSeparator />
            <PinUnpinModelMenuItem
                model={model}
                setLoading={setLoading}
                ItemType={ContextMenuItem}
            />
            <ContextMenuSeparator />
            <CopyModelIdMenuItem model={model} ItemType={ContextMenuItem} />
        </ContextMenuContent>
    );
};

export default ModelContextMenuContent;
