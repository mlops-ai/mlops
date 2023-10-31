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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Project } from "@/types/project";

const formSchema = z.object({
    title: z
        .string()
        .min(1, {
            message: "Project title is required.",
        })
        .max(100, {
            message: "Project title cannot be longer than 100 characters.",
        }),
    description: z
        .string()
        .max(1000, {
            message: "Description cannot be longer than 1000 characters.",
        })
        .optional(),
    status: z.enum(["not_started", "in_progress", "completed"]),
});

const EditProjectModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "editProject";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => {
            return {
                title: !data.project ? "" : data.project.title,
                description: !data.project ? "" : data.project.description,
                status: !data.project ? "not_started" : data.project.status,
            };
        }, [data.project]),
    });

    useEffect(() => {
        form.reset(data.project);
    }, [data.project]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!data.project) return;

        let data_to_update =
            data.project.title === values.title
                ? { description: values.description, status: values.status }
                : values;

        await axios
            .put(`${url}:${port}/projects/${data.project?._id}`, data_to_update)
            .then((res) => {
                onClose();
                form.reset();
                dataStore.updateProject(res.data._id, {
                    ...data.project,
                    title: res.data.title,
                    description: res.data.description,
                    status: res.data.status,
                } as Project);

                createToast({
                    id: "edit-project",
                    message: "Project updated successfully!",
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "edit-project",
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
        if (isLoading || toast.isActive("edit-project")) {
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
                        Edit project
                    </DialogTitle>
                </DialogHeader>
                <SectionSeparator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="py-2"
                    >
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Project title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={100}
                                            placeholder="Project title..."
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
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Project description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                            disabled={isLoading}
                                            maxLength={1000}
                                            placeholder="Project description..."
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
                        <FormField
                            name="status"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="px-4 mb-2">
                                    <FormLabel className="font-semibold text-md">
                                        Project status
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        {...field}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx">
                                                <SelectValue placeholder="Select project status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                key="not_started"
                                                value="not_started"
                                            >
                                                Not started
                                            </SelectItem>
                                            <SelectItem
                                                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                key="in_progress"
                                                value="in_progress"
                                            >
                                                In progress
                                            </SelectItem>
                                            <SelectItem
                                                className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                key="completed"
                                                value="completed"
                                            >
                                                Finished
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                Update project
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

export default EditProjectModal;
