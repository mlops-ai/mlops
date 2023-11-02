import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMemo, useState } from "react";
import { useData } from "@/hooks/use-data-hook";
import { useModal } from "@/hooks/use-modal-hook";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { createToast } from "@/lib/toast";

import { cn } from "@/lib/utils";

import { backendConfig } from "@/config/backend";

import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react";
import { Loading, Monitoring } from "@/components/icons";

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";
import { ModelStatus } from "@/types/types";
import { Model } from "@/types/model";
import { useDebounce } from "@/hooks/use-debounce-hook";
import Fuse from "fuse.js";

const formSchema = z
    .object({
        model_name: z
            .string()
            // .min(1, {
            //     message: "Model name is required.",
            // })
            .max(100, {
                message: "Model name cannot be longer than 100 characters.",
            }),
        model_description: z
            .string()
            .max(1000, {
                message: "Description cannot be longer than 1000 characters.",
            })
            .optional(),
        existing_model: z.string(),
    })
    .refine(
        (data) => {
            return !(data.existing_model === "" && data.model_name === "");
        },
        {
            message:
                "You must either create a new model or connect to an existing one. Fill model name or select empty model.",
            path: ["existing_model"],
        }
    )
    .refine(
        (data) => {
            return !(data.existing_model === "" && data.model_name === "");
        },
        {
            message:
                "You must either create a new model or connect to an existing one. Fill model name or select existing model.",
            path: ["model_name"],
        }
    );

const CreateModelFromIterationModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "createModelFromIteration";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => {
            return {
                model_name: "",
                model_description: "",
                existing_model: "",
            };
        }, []),
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!data.iteration || !dataStore.models) return;

        if (values.existing_model) {
            let data_to_update = {
                iteration: data.iteration,
                model_status: ModelStatus.ACTIVE,
            };

            await axios
                .put(
                    `${url}:${port}/monitored-models/${values.existing_model}`,
                    data_to_update
                )
                .then((res) => {
                    onClose();
                    form.reset();
                    dataStore.updateModel(res.data._id, {
                        ...res.data,
                        model_status: res.data.model_status,
                        iteration: res.data.iteration,
                    } as Model);

                    createToast({
                        id: "create-model-from-iteration",
                        message: "Model connected with iteration successfully!",
                        type: "success",
                    });
                })
                .catch((error: any) => {
                    createToast({
                        id: "create-model-from-iteration",
                        message: error.response?.data.detail,
                        type: "error",
                    });
                });
        } else {
            let data_to_create = {
                model_name: values.model_name,
                model_description: values.model_description,
                model_status: ModelStatus.ACTIVE,
                iteration: data.iteration,
            };

            await axios
                .post(`${url}:${port}/monitored-models/`, data_to_create)
                .then((res) => {
                    handleClose();
                    dataStore.addModel(res.data as Model);

                    createToast({
                        id: "create-model-from-iteration",
                        message: "Model with iteration created successfully!",
                        type: "success",
                    });
                })
                .catch((error: any) => {
                    createToast({
                        id: "create-model-from-iteration",
                        message: error.response?.data.detail,
                        type: "error",
                    });
                });
        }
    };

    const [open, setOpen] = useState(false);

    const [query, setQuery] = useState("");

    const debounceSearch = useDebounce(query, 100);

    const handleCloseCommand = () => {
        if (open) {
            setQuery("");
            setOpen(false);
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
        document.body.style.overflow = "auto";
    };

    const handleOnEscapeKeyDown = (e: any) => {
        if (isLoading) {
            e.preventDefault();
        }
    };

    const onInteractOutside = (e: any) => {
        if (isLoading || toast.isActive("create-model-from-iteration")) {
            e.preventDefault();
        }
    };

    const models = useMemo(() => {
        if (!dataStore.models) return;

        const availableModels = dataStore.models.filter(
            (model) => model.model_status === ModelStatus.IDLE
        );

        const fuseSearch = new Fuse(availableModels, {
            includeScore: true,
            minMatchCharLength: 1,
            threshold: 0.25,
            keys: [
                "model_name",
                "model_description",
                "model_status",
                "iteration.iteration_name",
            ],
        });

        return debounceSearch === ""
            ? availableModels.map((model) => {
                  return {
                      _id: model._id,
                      model_name: model.model_name,
                  };
              })
            : fuseSearch.search(debounceSearch).map((model) => {
                  return {
                      _id: model.item._id,
                      model_name: model.item.model_name,
                  };
              });
    }, [dataStore.models, debounceSearch]);

    if (!isModalOpen) return null;

    const isFormDisabled = () => {
        if (form.getValues().existing_model !== "") {
            return false;
        }
        if (isLoading || !form.formState.isDirty) {
            return true;
        }
        return false;
    };

    return (
        <>
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full text-center rounded-md bg-background/80 backdrop-blur-sm">
                <div className="flex items-center px-2 py-1 font-semibold text-transparent text-white rounded bg-mlops-primary">
                    <Loading className="animate-spin" />
                    Updating ...
                </div>
            </div>
            <Dialog open={isModalOpen} onOpenChange={handleClose} modal={false}>
                <DialogContent
                    className="gap-0 p-0 outline-none bg-mlops-nav-bg dark:bg-mlops-nav-bg-dark"
                    onEscapeKeyDown={handleOnEscapeKeyDown}
                    onInteractOutside={onInteractOutside}
                >
                    <DialogHeader className="p-4">
                        <DialogTitle className="text-2xl font-medium">
                            Create model from iteration
                        </DialogTitle>
                    </DialogHeader>
                    <SectionSeparator />
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="py-2"
                        >
                            <h2 className="mx-4 my-2">
                                <div className="flex items-center justify-center mb-1 text-xl">
                                    <PlusCircle className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                                    Create new model with iteration
                                </div>
                                <SectionSeparator />
                            </h2>
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
                            <h2 className="mx-4 my-2">
                                <div className="flex items-center justify-center mb-1 text-xl">
                                    <Monitoring className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                                    or connect iteration to existing model
                                </div>
                                <SectionSeparator />
                            </h2>
                            <FormField
                                control={form.control}
                                name="existing_model"
                                render={({ field }) => (
                                    <FormItem className="px-4 mb-2">
                                        <FormLabel className="block font-semibold text-md">
                                            Existing model
                                        </FormLabel>
                                        <Popover
                                            open={open}
                                            onOpenChange={handleCloseCommand}
                                        >
                                            <PopoverTrigger
                                                asChild
                                                disabled={models?.length === 0}
                                            >
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                    >
                                                        {models?.length === 0
                                                            ? "No models available"
                                                            : field.value
                                                            ? models?.find(
                                                                  (model) =>
                                                                      model._id ===
                                                                      field.value
                                                              )?.model_name
                                                            : "Select existing model"}
                                                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                {/* max-h-[calc(60vh)] */}
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search for existing model..."
                                                        onValueChange={(
                                                            value
                                                        ) => setQuery(value)}
                                                    />
                                                    <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                        <CommandEmpty>
                                                            No models found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {models?.map(
                                                                (model) => (
                                                                    <CommandItem
                                                                        value={
                                                                            model._id
                                                                        }
                                                                        key={
                                                                            model.model_name
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "existing_model",
                                                                                model._id
                                                                            );
                                                                            handleCloseCommand();
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                model._id ===
                                                                                    field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {
                                                                            model.model_name
                                                                        }
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            This is the model that will be
                                            connected with this iteration.
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
                                    disabled={isFormDisabled()}
                                >
                                    <Loading
                                        className={cn(
                                            "animate-spin mr-1 hidden",
                                            isLoading && "inline"
                                        )}
                                    />
                                    Create model
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
        </>
    );
};

export default CreateModelFromIterationModal;
