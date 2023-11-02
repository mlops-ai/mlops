import axios from "axios";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal-hook";
import { useData } from "@/hooks/use-data-hook";

import { cn } from "@/lib/utils";

import { backendConfig } from "@/config/backend";

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

import { X } from "lucide-react";
import { Loading, Archive, Unarchive } from "@/components/icons";

import { createToast } from "@/lib/toast";
import { toast } from "react-toastify";

import { ModelStatus } from "@/types/types";
import { Model } from "@/types/model";

const ArchiveRestoreModelModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen =
        isOpen && (type === "archiveModel" || type === "restoreModel");

    const handleArchiveRestoreModel = async () => {
        if (!data.model) return;

        let status;
        if (type === "archiveModel") {
            status = ModelStatus.ARCHIVED;
        } else {
            status = data.model.iteration
                ? ModelStatus.ACTIVE
                : ModelStatus.IDLE;
        }

        setIsLoading(true);
        await axios
            .put(`${url}:${port}/monitored-models/${data.model?._id}`, {
                model_status: status,
            })
            .then((res) => {
                onClose();
                dataStore.updateModel(
                    data.model?._id as string,
                    {
                        ...data.model,
                        model_status: res.data.model_status,
                    } as Model
                );
                createToast({
                    id: "archive-restore-model",
                    message: `Model ${data.model?.model_name} ${
                        type === "archiveModel" ? "archived" : "restored"
                    } successfully!`,
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "archive-restore-model",
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
        if (isLoading || toast.isActive("archive-restore-model")) {
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
                        {type === "archiveModel"
                            ? "Archive model "
                            : "Restore model "}
                        <span className="italic font-semibold text-zinc-400">
                            {data.model?.model_name}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <div className="flex flex-col px-4 py-2">
                    <div className="flex items-center">
                        <div>
                            {type === "archiveModel" ? (
                                <Archive className="flex-shrink-0 w-12 h-12 mr-3 text-zinc-400" />
                            ) : (
                                <Unarchive className="flex-shrink-0 w-12 h-12 mr-3 text-zinc-400" />
                            )}
                        </div>
                        <div>
                            {type === "archiveModel" ? (
                                <p>
                                    Archiving a model will move it to the
                                    archive tab. <br /> You will not be able to
                                    edit or refer to it to make predictions, but{" "}
                                    <span className="font-semibold">
                                        you can restore it at any time.
                                    </span>
                                </p>
                            ) : (
                                <p>
                                    Restoring a model will move it to the
                                    projects tab. <br /> You will be able to
                                    edit and refer to it to make predictions.
                                </p>
                            )}
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
                        variant="mlopsPrimary"
                        className="bg-zinc-400 hover:bg-zinc-400/90"
                        type="submit"
                        disabled={isLoading}
                        onClick={handleArchiveRestoreModel}
                    >
                        <Loading
                            className={cn(
                                "animate-spin mr-1 hidden",
                                isLoading && "inline"
                            )}
                        />
                        {type === "archiveModel"
                            ? "Archive model"
                            : "Restore model"}
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

export default ArchiveRestoreModelModal;
