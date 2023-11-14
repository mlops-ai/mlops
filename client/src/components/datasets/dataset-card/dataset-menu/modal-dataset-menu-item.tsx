import { ModalType, useModal } from "@/hooks/use-modal-hook";
import { Dataset } from "@/types/dataset";

interface ModalDatasetMenuItemProps {
    dataset: Dataset;
    ItemType: any;
    modalType: ModalType;
    Icon: any;
    menuDescription: string;
}

const ModalDatasetMenuItem = ({
    dataset,
    ItemType,
    modalType,
    Icon,
    menuDescription,
}: ModalDatasetMenuItemProps) => {
    const { onOpen } = useModal();

    return (
        <>
            <ItemType
                onClick={() => {
                    onOpen(modalType, {
                        dataset: dataset,
                    });
                    document.body.style.pointerEvents = "";
                }}
            >
                <div className="flex items-center">
                    <Icon className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                    {menuDescription}
                </div>
            </ItemType>
        </>
    );
};

export default ModalDatasetMenuItem;
