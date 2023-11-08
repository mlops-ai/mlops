import { ModalType, useModal } from "@/hooks/use-modal-hook";

import { Project } from "@/types/project";

interface ModalProjectMenuItemProps {
    project: Project;
    ItemType: any;
    modalType: ModalType;
    Icon: any;
    menuDescription: string;
}

const ModalProjectMenuItem = ({
    project,
    ItemType,
    modalType,
    Icon,
    menuDescription,
}: ModalProjectMenuItemProps) => {
    const { onOpen } = useModal();

    return (
        <>
            <ItemType
                onClick={() => {
                    onOpen(modalType, {
                        project: project,
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

export default ModalProjectMenuItem;
