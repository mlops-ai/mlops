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
import { Textarea } from "@/components/ui/textarea";
import SectionSeparator from "@/components/navigation/section-separator";
import { Model } from "@/types/model";

const formSchema = z.object({
    model_name: z
        .string()
        .min(1, {
            message: "Model name is required.",
        })
        .max(100, {
            message: "Model name cannot be longer than 100 characters.",
        }),
    model_description: z
        .string()
        .max(1000, {
            message: "Description cannot be longer than 1000 characters.",
        })
        .optional(),
});

const EditModelModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "editModel";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => {
            return {
                model_name: !data.model ? "" : data.model.model_name,
                model_description: !data.model ? "" : data.model.model_description,
            };
        }, [data.model]),
    });

    useEffect(() => {
        form.reset(data.model);
    }, [data.model]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!data.model) return;

        let data_to_update =
            data.model.model_name === values.model_name
                ? { model_description: values.model_description }
                : values;

        await axios
            .put(`${url}:${port}/monitored-models/${data.model?._id}`, data_to_update)
            .then((res) => {
                onClose();
                form.reset();
                
                dataStore.updateModel(res.data._id, {
                    ...data.model,
                    model_name: res.data.model_name,
                    model_description: res.data.model_description,
                    model_status: res.data.model_status,
                } as Model);

                createToast({
                    id: "edit-model",
                    message: "Model updated successfully!",
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "edit-model",
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
        if (isLoading || toast.isActive("edit-model")) {
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
                        Edit model
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="py-2"
                    >
                        <FormField
                            name="model_name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Model name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={100}
                                            placeholder="Model name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Required (max. 100 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="model_description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Model description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={1000}
                                            placeholder="Model description..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional (max. 1000 characters)
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
                                Update model
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

export default EditModelModal;
