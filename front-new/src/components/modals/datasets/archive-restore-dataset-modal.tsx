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

import { Dataset } from "@/types/dataset";

const ArchiveRestoreDatasetModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen =
        isOpen && (type === "archiveDataset" || type === "restoreDataset");

    const handleArchiveRestoreDataset = async () => {
        if (!data.dataset) return;

        setIsLoading(true);
        await axios
            .put(`${url}:${port}/datasets/${data.dataset?._id}`, {
                archived: type === "archiveDataset" ? true : false,
            })
            .then(() => {
                onClose();
                dataStore.updateDataset(
                    data.dataset?._id as string,
                    {
                        ...data.dataset,
                        archived: type === "archiveDataset" ? true : false,
                    } as Dataset
                );
                createToast({
                    id: "archive-restore-dataset",
                    message: `Dataset ${data.dataset?.dataset_name} ${
                        type === "archiveDataset" ? "archived" : "restored"
                    } successfully!`,
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "archive-restore-dataset",
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
        if (isLoading || toast.isActive("archive-restore-dataset")) {
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
                        {type === "archiveDataset"
                            ? "Archive model "
                            : "Restore model "}
                        <span className="italic font-semibold text-zinc-400">
                            {data.dataset?.dataset_name}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <div className="flex flex-col px-4 py-2">
                    <div className="flex items-center">
                        <div>
                            {type === "archiveDataset" ? (
                                <Archive className="flex-shrink-0 w-12 h-12 mr-3 text-zinc-400" />
                            ) : (
                                <Unarchive className="flex-shrink-0 w-12 h-12 mr-3 text-zinc-400" />
                            )}
                        </div>
                        <div>
                            {type === "archiveDataset" ? (
                                <p>
                                    Archiving a dataset will move it to the
                                    archive tab. <br /> You will not be able to
                                    edit or use it in new iterations, but{" "}
                                    <span className="font-semibold">
                                        you can restore it at any time.
                                    </span>
                                </p>
                            ) : (
                                <p>
                                    Restoring a dataset will move it to the
                                    projects tab. <br /> You will be able to
                                    edit and use it in new iterations.
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
                        onClick={handleArchiveRestoreDataset}
                    >
                        <Loading
                            className={cn(
                                "animate-spin mr-1 hidden",
                                isLoading && "inline"
                            )}
                        />
                        {type === "archiveDataset"
                            ? "Archive dataset"
                            : "Restore dataset"}
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

export default ArchiveRestoreDatasetModal;
