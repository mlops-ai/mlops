import { Archive, Delete, Unarchive, Edit } from "@/components/icons";

import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Dataset } from "@/types/dataset";
import CopyDatasetIdMenuItem from "./dataset-menu/copy-dataset-id-menu-item";
import DatasetMenuHeader from "./dataset-menu/dataset-menu-header";
import ModalDatasetMenuItem from "./dataset-menu/modal-dataset-menu-item";
import PinUnpinDatasetMenuItem from "./dataset-menu/pin-unpin-dataset-menu-item";

interface DatasetCardProps {
    dataset: Dataset;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatasetContextMenuContent = ({
    dataset,
    setLoading,
}: DatasetCardProps) => {
    return (
        <ContextMenuContent className="w-56">
            <DatasetMenuHeader />
            <ContextMenuSeparator />
            {!dataset.archived && (
                <ModalDatasetMenuItem
                    dataset={dataset}
                    ItemType={ContextMenuItem}
                    modalType="editDataset"
                    Icon={Edit}
                    menuDescription="Edit dataset information"
                />
            )}
            <ModalDatasetMenuItem
                dataset={dataset}
                ItemType={ContextMenuItem}
                modalType="deleteDataset"
                Icon={Delete}
                menuDescription="Delete dataset"
            />
            <ContextMenuSeparator />
            {dataset.archived ? (
                <ModalDatasetMenuItem
                    dataset={dataset}
                    ItemType={ContextMenuItem}
                    modalType="restoreDataset"
                    Icon={Unarchive}
                    menuDescription="Restore dataset"
                />
            ) : (
                <ModalDatasetMenuItem
                    dataset={dataset}
                    ItemType={ContextMenuItem}
                    modalType="archiveDataset"
                    Icon={Archive}
                    menuDescription="Archive dataset"
                />
            )}
            <ContextMenuSeparator />
            <PinUnpinDatasetMenuItem
                dataset={dataset}
                setLoading={setLoading}
                ItemType={ContextMenuItem}
            />
            <ContextMenuSeparator />
            <CopyDatasetIdMenuItem
                dataset={dataset}
                ItemType={ContextMenuItem}
            />
        </ContextMenuContent>
    );
};

export default DatasetContextMenuContent;
