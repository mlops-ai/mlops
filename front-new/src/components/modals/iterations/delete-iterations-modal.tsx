import axios from "axios";

import { useState } from "react";
import { useData } from "@/hooks/use-data-hook";
import { useModal } from "@/hooks/use-modal-hook";

import { createToast } from "@/lib/toast";
import { toast } from "react-toastify";

import { cn } from "@/lib/utils";

import { backendConfig } from "@/config/backend";

import { X } from "lucide-react";
import { Loading, Warning } from "@/components/icons";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import SectionSeparator from "@/components/navigation/section-separator";
import { Keyable } from "@/types/types";

const DeleteIterationsModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "deleteIterations";

    const handleDeleteIterations = async () => {
        if (!data.deleteIterations) return;

        setIsLoading(true);
        await axios
            .post(
                `${url}:${port}/projects/${data.deleteIterations.project_id}/experiments/delete_iterations`,
                data.deleteIterations.iterationsToDelete
            )
            .then(() => {
                dataStore.deleteIterations(
                    data.deleteIterations?.project_id as string,
                    data.deleteIterations?.iterationsToDelete as Keyable
                );
                onClose();
                createToast({
                    id: "delete-iterations",
                    message: `Iteration/s deleted successfully!`,
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "delete-iterations",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
        setIsLoading(false);
    };

    const handleOnEscapeKeyDown = (e: any) => {
        if (isLoading) {
            e.preventDefault();
        }
    };

    const onInteractOutside = (e: any) => {
        if (isLoading || toast.isActive("delete-iterations")) {
            e.preventDefault();
        }
    };

    if (!isModalOpen) return null;

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="gap-0 p-0 outline-none bg-mlops-nav-bg dark:bg-mlops-nav-bg-dark"
                onEscapeKeyDown={handleOnEscapeKeyDown}
                onInteractOutside={onInteractOutside}
            >
                <DialogHeader className="p-4">
                    <DialogTitle className="text-2xl font-medium">
                        Delete iteration/s{" "}
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <div className="flex flex-col px-4 py-2">
                    <div className="flex items-center">
                        <div>
                            <Warning className="flex-shrink-0 w-12 h-12 mr-3 text-mlops-danger" />
                        </div>
                        <div>
                            The following number of iterations will be deleted
                            permamently:{" "}
                            <span className="font-semibold">
                                {data.deleteIterations?.numberOfIterations}
                            </span>
                            .{" "}
                            <span className="font-semibold">
                                This action cannot be undone.
                            </span>
                        </div>
                    </div>
                    <br />
                    <p className="text-right">
                        Are you sure you want to continue?
                    </p>
                </div>
                <SectionSeparator />
                <DialogFooter className="p-4">
                    <Button
                        variant="mlopsDanger"
                        type="submit"
                        disabled={isLoading}
                        onClick={handleDeleteIterations}
                    >
                        <Loading
                            className={cn(
                                "animate-spin mr-1 hidden",
                                isLoading && "inline"
                            )}
                        />
                        Delete iteration/s
                    </Button>
                </DialogFooter>
                <DialogClose
                    className="p-2 absolute right-4 top-4 rounded-sm ring-offset-background transition duration-300 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:text-mlops-primary-tx hover:dark:text-mlops-primary-tx-dark hover:bg-mlops-action-hover-bg hover:dark:bg-mlops-action-hover-bg-dark"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteIterationsModal;
