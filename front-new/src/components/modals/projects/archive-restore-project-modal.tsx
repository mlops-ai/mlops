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

import { Project } from "@/types/project";

const ArchiveRestoreProjectModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen =
        isOpen && (type === "archiveProject" || type === "restoreProject");

    const handleArchiveRestoreProject = async () => {
        if (!data.project) return;

        setIsLoading(true);
        await axios
            .put(`${url}:${port}/projects/${data.project?._id}`, {
                archived: type === "archiveProject" ? true : false,
            })
            .then(() => {
                onClose();
                dataStore.updateProject(
                    data.project?._id as string,
                    {
                        ...data.project,
                        archived: type === "archiveProject" ? true : false,
                    } as Project
                );
                createToast({
                    id: "archive-restore-project",
                    message: `Project ${data.project?.title} ${
                        type === "archiveProject" ? "archived" : "restored"
                    } successfully!`,
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "archive-restore-project",
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
        if (isLoading || toast.isActive("archive-restore-project")) {
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
                        {type === "archiveProject"
                            ? "Archive project "
                            : "Restore project "}
                        <span className="italic font-semibold text-zinc-400">
                            {data.project?.title}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <div className="flex flex-col px-4 py-2">
                    <div className="flex items-center">
                        <div>
                            {type === "archiveProject" ? (
                                <Archive className="flex-shrink-0 w-12 h-12 mr-3 text-zinc-400" />
                            ) : (
                                <Unarchive className="flex-shrink-0 w-12 h-12 mr-3 text-zinc-400" />
                            )}
                        </div>
                        <div>
                            {type === "archiveProject" ? (
                                <p>
                                    Archiving a project will move it to the
                                    archive tab. <br /> You will not be able to
                                    edit or refer to it, but{" "}
                                    <span className="font-semibold">
                                        you can restore it at any time.
                                    </span>
                                </p>
                            ) : (
                                <p>
                                    Restoring a project will move it to the
                                    projects tab. <br /> You will be able to
                                    edit and refer to it.
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
                        onClick={handleArchiveRestoreProject}
                    >
                        <Loading
                            className={cn(
                                "animate-spin mr-1 hidden",
                                isLoading && "inline"
                            )}
                        />
                        {type === "archiveProject"
                            ? "Archive project"
                            : "Restore project"}
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

export default ArchiveRestoreProjectModal;
