import { ModalType, useModal } from "@/hooks/use-modal-hook";
import { Iteration } from "@/types/iteration";

interface ModalIterationMenuItemProps {
    iteration: Iteration;
    ItemType: any;
    modalType: ModalType;
    Icon: any;
    menuDescription: string;
}

const ModalIterationMenuItem = ({
    iteration,
    ItemType,
    modalType,
    Icon,
    menuDescription,
}: ModalIterationMenuItemProps) => {
    const { onOpen } = useModal();

    if (modalType === "deleteIterations") {
    }

    return (
        <>
            <ItemType
                onClick={() => {
                    const deleteIterations = {
                        project_id: iteration.project_id,
                        numberOfIterations: 1,
                        iterationsToDelete: {
                            [iteration.experiment_id]: [iteration.id],
                        },
                    };
                    onOpen(modalType, {
                        iteration: iteration,
                        deleteIterations: deleteIterations,
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

export default ModalIterationMenuItem;
