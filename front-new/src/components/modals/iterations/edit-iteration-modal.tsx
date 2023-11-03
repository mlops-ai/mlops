import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useMemo } from "react";
import { useData } from "@/hooks/use-data-hook";
import { useModal } from "@/hooks/use-modal-hook";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { createToast } from "@/lib/toast";

import { cn } from "@/lib/utils";

import { backendConfig } from "@/config/backend";

import { X } from "lucide-react";
import { Loading } from "@/components/icons";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SectionSeparator from "@/components/navigation/section-separator";

const formSchema = z.object({
    iteration_name: z
        .string()
        .min(1, {
            message: "Iteration name is required.",
        })
        .max(40, {
            message: "Iteration name cannot be longer than 40 characters.",
        }),
});

const EditIterationModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "editIteration";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => {
            return {
                iteration_name: !data.iteration ? "" : data.iteration.iteration_name,
            };
        }, [data.iteration]),
    });

    useEffect(() => {
        form.reset(data.iteration);
    }, [data.iteration]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!data.iteration) return;

        await axios
            .put(
                `${url}:${port}/projects/${data.iteration?.project_id}/experiments/${data.iteration?.experiment_id}/iterations/${data.iteration?.id}`,
                values
            )
            .then((res) => {
                console.log(res.data);
                dataStore.updateIteration(
                    data.iteration?.project_id as string,
                    data.iteration?.experiment_id as string,
                    data.iteration?.id as string,
                    res.data
                );

                onClose();
                form.reset();

                createToast({
                    id: "edit-iteration",
                    message: "Iteration updated successfully!",
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "edit-iteration",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const handleOnEscapeKeyDown = (e: any) => {
        if (isLoading) {
            e.preventDefault();
        }
    };

    const onInteractOutside = (e: any) => {
        if (isLoading || toast.isActive("edit-iteration")) {
            e.preventDefault();
        }
    };

    if (!isModalOpen) return null;

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="gap-0 p-0 outline-none bg-mlops-nav-bg dark:bg-mlops-nav-bg-dark"
                onEscapeKeyDown={handleOnEscapeKeyDown}
                onInteractOutside={onInteractOutside}
            >
                <DialogHeader className="p-4">
                    <DialogTitle className="text-2xl font-medium">
                        Edit iteration
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="py-2"
                    >
                        <FormField
                            name="iteration_name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Iteration name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={40}
                                            placeholder="Iteration name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Required (max. 40 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SectionSeparator />
                        <DialogFooter className="px-4 pt-4 pb-2">
                            <Button
                                variant="mlopsPrimary"
                                type="submit"
                                disabled={isLoading || !form.formState.isDirty}
                            >
                                <Loading
                                    className={cn(
                                        "animate-spin mr-1 hidden",
                                        isLoading && "inline"
                                    )}
                                />
                                Update iteration
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
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

export default EditIterationModal;
