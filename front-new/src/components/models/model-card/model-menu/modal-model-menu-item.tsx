import { ModalType, useModal } from "@/hooks/use-modal-hook";
import { Model } from "@/types/model";

interface ModalModelMenuItemProps {
    model: Model;
    ItemType: any;
    modalType: ModalType;
    Icon: any;
    menuDescription: string;
}

const ModalModelMenuItem = ({
    model,
    ItemType,
    modalType,
    Icon,
    menuDescription,
}: ModalModelMenuItemProps) => {
    const { onOpen } = useModal();

    return (
        <>
            <ItemType
                onClick={() => {
                    onOpen(modalType, {
                        model: model,
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

export default ModalModelMenuItem;
