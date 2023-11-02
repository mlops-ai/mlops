import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useModal } from "@/hooks/use-modal-hook";
import { useData } from "@/hooks/use-data-hook";
import { useForm } from "react-hook-form";

import { createToast } from "@/lib/toast";
import { toast } from "react-toastify";

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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionSeparator from "@/components/navigation/section-separator";
import { useEffect, useMemo } from "react";
import { Dataset } from "@/types/dataset";

const formSchema = z.object({
    dataset_name: z
        .string()
        .min(1, {
            message: "Dataset name is required.",
        })
        .max(100, {
            message: "Dataset name cannot be longer than 100 characters.",
        }),
    path_to_dataset: z.string().min(1, {
        message: "Dataset path (URL or disk path) is required.",
    }),
    version: z
        .string()
        .max(40, {
            message: "Dataset version cannot be longer than 40 characters.",
        })
        .optional(),
    tags: z
        .string()
        .max(150, {
            message: "Dataset tags cannot be longer than 150 characters.",
        })
        .optional(),
    dataset_description: z
        .string()
        .max(1000, {
            message: "Description cannot be longer than 1000 characters.",
        })
        .optional(),
});

const EditDatasetModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "editDataset";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => {
            return {
                dataset_name: !data.dataset ? "" : data.dataset.dataset_name,
                path_to_dataset: !data.dataset
                    ? ""
                    : data.dataset.path_to_dataset,
                version: !data.dataset ? "" : data.dataset.version,
                tags: !data.dataset ? "" : data.dataset.tags,
                dataset_description: !data.dataset
                    ? ""
                    : data.dataset.dataset_description,
            };
        }, [data.dataset]),
    });

    useEffect(() => {
        form.reset(data.dataset);
    }, [data.dataset]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!data.dataset) return;

        let data_to_update =
            data.dataset.dataset_name === values.dataset_name
                ? {
                      path_to_dataset: values.path_to_dataset,
                      version: values.version,
                      tags: values.tags,
                      dataset_description: values.dataset_description,
                  }
                : values;

        await axios
            .put(`${url}:${port}/datasets/${data.dataset?._id}`, data_to_update)
            .then((res) => {
                onClose();
                form.reset();

                dataStore.updateDataset(res.data._id, {
                    ...data.dataset,
                    dataset_name: res.data.dataset_name,
                    path_to_dataset: res.data.path_to_dataset,
                    version: res.data.version,
                    tags: res.data.tags,
                    dataset_description: res.data.dataset_description,
                    updated_at: res.data.updated_at,
                } as Dataset);

                createToast({
                    id: "edit-dataset",
                    message: "Dataset updated successfully!",
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "edit-dataset",
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
        if (isLoading || toast.isActive("edit-dataset")) {
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
                        Edit dataset
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="py-2"
                    >
                        <FormField
                            name="dataset_name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Dataset name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={100}
                                            placeholder="Dataset name..."
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
                            name="path_to_dataset"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Model path
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            placeholder="Model path ..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Required (URL or disk path)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="version"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Dataset version
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={40}
                                            placeholder="Dataset version..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional (max. 40 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="tags"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Dataset tags
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={150}
                                            placeholder="Dataset tags..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional (max. 150 characters, comma
                                        separated)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="dataset_description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Dataset description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={1000}
                                            placeholder="Dataset description..."
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
                                Update dataset
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

export default EditDatasetModal;
