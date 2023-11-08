import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MonitoringChart } from "@/types/monitoring_chart";

const formSchema = z
    .object({
        chart_type: z.enum(
            [
                "histogram",
                "countplot",
                "scatter",
                "scatter_with_histograms",
                "timeseries",
            ],
            { required_error: "Chart type is required." }
        ),
        first_column: z.string({ required_error: "Column field is required." }),
        second_column: z.string().optional(),
        bin_method: z
            .enum([
                "squareRoot",
                "freedmanDiaconis",
                "scott",
                "sturges",
                "fixedNumber",
            ])
            .optional(),
        bin_number: z.coerce
            .number()
            .min(2, {
                message: "Bin number must be greater than 1.",
            })
            .optional(),
    })
    .refine(
        (data) => {
            return !(
                data.chart_type === "histogram" &&
                data.first_column !== "" &&
                !data.bin_method
            );
        },
        {
            message: "Bin method is required.",
            path: ["bin_method"],
        }
    )
    .refine(
        (data) => {
            return !(
                data.chart_type === "histogram" &&
                data.first_column !== "" &&
                data.bin_method === "fixedNumber" &&
                !data.bin_number
            );
        },
        {
            message: "Bin number is required for fixed number method.",
            path: ["bin_number"],
        }
    )
    .refine(
        (data) => {
            return !(
                data.chart_type === "scatter_with_histograms" &&
                data.first_column !== "" &&
                !data.second_column
            );
        },
        {
            message:
                "Second column is required for scatter plot with histograms.",
            path: ["second_column"],
        }
    )
    .refine(
        (data) => {
            return !(
                data.chart_type === "scatter_with_histograms" &&
                data.first_column !== "" &&
                data.second_column !== "" &&
                !data.bin_method
            );
        },
        {
            message: "Bin method is required.",
            path: ["bin_method"],
        }
    )
    .refine(
        (data) => {
            return !(
                data.chart_type === "scatter_with_histograms" &&
                data.first_column !== "" &&
                data.second_column !== "" &&
                data.bin_method === "fixedNumber" &&
                !data.bin_number
            );
        },
        {
            message: "Bin number is required for fixed number method.",
            path: ["bin_number"],
        }
    )
    .refine(
        (data) => {
            return !(
                data.chart_type === "scatter" &&
                data.first_column !== "" &&
                !data.second_column
            );
        },
        {
            message: "Second column is required for scatter plot.",
            path: ["second_column"],
        }
    );

const CreateMonitoringChartModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "createMonitoringChartModal";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const isLoading = form.formState.isSubmitting;

    const { watch } = form;

    const chartTypeValue = watch("chart_type");
    const binMethodValue = watch("bin_method");
    const firstColumnValue = watch("first_column");
    const secondColumnValue = watch("second_column");

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!data.model || !data.baseFeatures) return;

        handleClose();
        form.reset();
        dataStore.updateModel(data.model._id, {
            ...data.model,
            monitoring_charts: [
                ...(data.model.monitoring_charts || []),
                values as MonitoringChart,
            ],
        });
    };

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    const handleCloseCommand = () => {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };

    const handleCloseCommand2 = () => {
        if (open2) {
            setOpen2(false);
        } else {
            setOpen2(true);
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

    if (!isModalOpen) return null;

    // const isFormDisabled = () => {
    //     if (form.getValues().existing_model !== "") {
    //         return false;
    //     }
    //     if (isLoading || !form.formState.isDirty) {
    //         return true;
    //     }
    //     return false;
    // };

    const baseFeatures = [
        ...(data.baseFeatures as string[]),
        "prediction",
    ].filter((feature) => feature !== secondColumnValue);
    const baseFeatures2 = [
        ...(data.baseFeatures as string[]),
        "prediction",
    ].filter((feature) => feature !== firstColumnValue);

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
                            Create monitoring chart
                        </DialogTitle>
                    </DialogHeader>
                    <SectionSeparator />
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="py-2"
                        >
                            <FormField
                                name="chart_type"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="px-4 mb-2">
                                        <FormLabel className="font-semibold text-md">
                                            Chart type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            {...field}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx">
                                                    <SelectValue placeholder="Select chart type ..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormDescription>
                                                Required (one of the options)
                                            </FormDescription>
                                            <FormMessage />
                                            <SelectContent>
                                                <SelectItem
                                                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    key="histogram"
                                                    value="histogram"
                                                >
                                                    Histogram
                                                </SelectItem>
                                                <SelectItem
                                                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    key="countplot"
                                                    value="countplot"
                                                >
                                                    Countplot
                                                </SelectItem>
                                                <SelectItem
                                                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    key="scatter"
                                                    value="scatter"
                                                >
                                                    Scatter
                                                </SelectItem>
                                                <SelectItem
                                                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    key="scatter_with_histograms"
                                                    value="scatter_with_histograms"
                                                >
                                                    Scatter with histograms
                                                </SelectItem>
                                                <SelectItem
                                                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    key="timeseries"
                                                    value="timeseries"
                                                >
                                                    Timeseries
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {/* HISTOGRAM - START */}

                            {chartTypeValue === "histogram" && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Histogram parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="first_column"
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="block font-semibold text-md">
                                                    Column
                                                </FormLabel>
                                                <Popover
                                                    open={open}
                                                    onOpenChange={
                                                        handleCloseCommand
                                                    }
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={
                                                            baseFeatures?.length ===
                                                            0
                                                        }
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                            >
                                                                {baseFeatures?.length ===
                                                                0
                                                                    ? "No columns available ..."
                                                                    : field.value
                                                                    ? baseFeatures?.find(
                                                                          (
                                                                              baseFeature: string
                                                                          ) =>
                                                                              baseFeature ===
                                                                              field.value
                                                                      )
                                                                    : "Select column ..."}
                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command
                                                            filter={(
                                                                value,
                                                                search
                                                            ) => {
                                                                if (
                                                                    value.includes(
                                                                        search
                                                                    )
                                                                )
                                                                    return 1;
                                                                return 0;
                                                            }}
                                                        >
                                                            <CommandInput placeholder="Search for column ..." />
                                                            <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                                <CommandEmpty>
                                                                    No columns
                                                                    found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {baseFeatures?.map(
                                                                        (
                                                                            baseFeature: string
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    baseFeature
                                                                                }
                                                                                key={
                                                                                    baseFeature
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "first_column",
                                                                                        baseFeature
                                                                                    );
                                                                                    handleCloseCommand();
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        baseFeature ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    baseFeature
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
                                                    Histogram will be based on
                                                    this column.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="bin_method"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="font-semibold text-md">
                                                    Bin method
                                                </FormLabel>
                                                <Select
                                                    disabled={isLoading}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    {...field}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx">
                                                            <SelectValue placeholder="Select bin method ..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Required (one of the
                                                        options)
                                                    </FormDescription>
                                                    <FormMessage />
                                                    <SelectContent>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="squareRoot"
                                                            value="squareRoot"
                                                        >
                                                            Square root
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="freedmanDiaconis"
                                                            value="freedmanDiaconis"
                                                        >
                                                            Freedman-Diaconis
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="scott"
                                                            value="scott"
                                                        >
                                                            Scott
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="sturges"
                                                            value="sturges"
                                                        >
                                                            Sturges
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="fixedNumber"
                                                            value="fixedNumber"
                                                        >
                                                            Fixed number
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    {binMethodValue === "fixedNumber" && (
                                        <FormField
                                            name="bin_number"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="px-4 mb-2">
                                                    <FormLabel className="font-semibold text-md">
                                                        Bin number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                                            disabled={isLoading}
                                                            min={2}
                                                            placeholder="Bin number ..."
                                                            type="number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Required (min. 2)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </>
                            )}

                            {/* HISTOGRAM - END */}

                            {/* COUNT PLOT - START */}

                            {chartTypeValue === "countplot" && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Countplot parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="first_column"
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="block font-semibold text-md">
                                                    Column
                                                </FormLabel>
                                                <Popover
                                                    open={open}
                                                    onOpenChange={
                                                        handleCloseCommand
                                                    }
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={
                                                            baseFeatures?.length ===
                                                            0
                                                        }
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                            >
                                                                {baseFeatures?.length ===
                                                                0
                                                                    ? "No columns available ..."
                                                                    : field.value
                                                                    ? baseFeatures?.find(
                                                                          (
                                                                              baseFeature: string
                                                                          ) =>
                                                                              baseFeature ===
                                                                              field.value
                                                                      )
                                                                    : "Select column ..."}
                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command
                                                            filter={(
                                                                value,
                                                                search
                                                            ) => {
                                                                if (
                                                                    value.includes(
                                                                        search
                                                                    )
                                                                )
                                                                    return 1;
                                                                return 0;
                                                            }}
                                                        >
                                                            <CommandInput placeholder="Search for column ..." />
                                                            <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                                <CommandEmpty>
                                                                    No columns
                                                                    found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {baseFeatures?.map(
                                                                        (
                                                                            baseFeature: string
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    baseFeature
                                                                                }
                                                                                key={
                                                                                    baseFeature
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "first_column",
                                                                                        baseFeature
                                                                                    );
                                                                                    handleCloseCommand();
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        baseFeature ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    baseFeature
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
                                                    Countplot will be based on
                                                    this column.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {/* COUNT PLOT - END */}

                            {/* SCATTER - START */}

                            {chartTypeValue === "scatter" && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Scatter plot parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="first_column"
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="block font-semibold text-md">
                                                    First column
                                                </FormLabel>
                                                <Popover
                                                    open={open}
                                                    onOpenChange={
                                                        handleCloseCommand
                                                    }
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={
                                                            baseFeatures?.length ===
                                                            0
                                                        }
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                            >
                                                                {baseFeatures?.length ===
                                                                0
                                                                    ? "No columns available ..."
                                                                    : field.value
                                                                    ? baseFeatures?.find(
                                                                          (
                                                                              baseFeature: string
                                                                          ) =>
                                                                              baseFeature ===
                                                                              field.value
                                                                      )
                                                                    : "Select first column ..."}
                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command
                                                            filter={(
                                                                value,
                                                                search
                                                            ) => {
                                                                if (
                                                                    value.includes(
                                                                        search
                                                                    )
                                                                )
                                                                    return 1;
                                                                return 0;
                                                            }}
                                                        >
                                                            <CommandInput placeholder="Search for column ..." />
                                                            <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                                <CommandEmpty>
                                                                    No columns
                                                                    found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {baseFeatures?.map(
                                                                        (
                                                                            baseFeature: string
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    baseFeature
                                                                                }
                                                                                key={
                                                                                    baseFeature
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "first_column",
                                                                                        baseFeature
                                                                                    );
                                                                                    handleCloseCommand();
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        baseFeature ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    baseFeature
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
                                                    Scatter will be based on
                                                    this column.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="second_column"
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="block font-semibold text-md">
                                                    Second column
                                                </FormLabel>
                                                <Popover
                                                    open={open2}
                                                    onOpenChange={
                                                        handleCloseCommand2
                                                    }
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={
                                                            baseFeatures2?.length ===
                                                            0
                                                        }
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                            >
                                                                {baseFeatures2?.length ===
                                                                0
                                                                    ? "No columns available ..."
                                                                    : field.value
                                                                    ? baseFeatures2?.find(
                                                                          (
                                                                              baseFeature: string
                                                                          ) =>
                                                                              baseFeature ===
                                                                              field.value
                                                                      )
                                                                    : "Select second column ..."}
                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command
                                                            filter={(
                                                                value,
                                                                search
                                                            ) => {
                                                                if (
                                                                    value.includes(
                                                                        search
                                                                    )
                                                                )
                                                                    return 1;
                                                                return 0;
                                                            }}
                                                        >
                                                            <CommandInput placeholder="Search for column ..." />
                                                            <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                                <CommandEmpty>
                                                                    No columns
                                                                    found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {baseFeatures2?.map(
                                                                        (
                                                                            baseFeature: string
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    baseFeature
                                                                                }
                                                                                key={
                                                                                    baseFeature
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "second_column",
                                                                                        baseFeature
                                                                                    );
                                                                                    handleCloseCommand2();
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        baseFeature ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    baseFeature
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
                                                    Scatter will be based on
                                                    this column.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {/* SCATTER - END */}

                            {/* SCATTER WITH HISTOGRAMS - START */}

                            {chartTypeValue === "scatter_with_histograms" && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Scatter with histograms parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="first_column"
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="block font-semibold text-md">
                                                    Column
                                                </FormLabel>
                                                <Popover
                                                    open={open}
                                                    onOpenChange={
                                                        handleCloseCommand
                                                    }
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={
                                                            baseFeatures?.length ===
                                                            0
                                                        }
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                            >
                                                                {baseFeatures?.length ===
                                                                0
                                                                    ? "No columns available ..."
                                                                    : field.value
                                                                    ? baseFeatures?.find(
                                                                          (
                                                                              baseFeature: string
                                                                          ) =>
                                                                              baseFeature ===
                                                                              field.value
                                                                      )
                                                                    : "Select column ..."}
                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command
                                                            filter={(
                                                                value,
                                                                search
                                                            ) => {
                                                                if (
                                                                    value.includes(
                                                                        search
                                                                    )
                                                                )
                                                                    return 1;
                                                                return 0;
                                                            }}
                                                        >
                                                            <CommandInput placeholder="Search for column ..." />
                                                            <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                                <CommandEmpty>
                                                                    No columns
                                                                    found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {baseFeatures?.map(
                                                                        (
                                                                            baseFeature: string
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    baseFeature
                                                                                }
                                                                                key={
                                                                                    baseFeature
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "first_column",
                                                                                        baseFeature
                                                                                    );
                                                                                    handleCloseCommand();
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        baseFeature ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    baseFeature
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
                                                    Scatter and histogram will
                                                    be based on this column.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="second_column"
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="block font-semibold text-md">
                                                    Second column
                                                </FormLabel>
                                                <Popover
                                                    open={open2}
                                                    onOpenChange={
                                                        handleCloseCommand2
                                                    }
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={
                                                            baseFeatures2?.length ===
                                                            0
                                                        }
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                            >
                                                                {baseFeatures2?.length ===
                                                                0
                                                                    ? "No columns available ..."
                                                                    : field.value
                                                                    ? baseFeatures2?.find(
                                                                          (
                                                                              baseFeature: string
                                                                          ) =>
                                                                              baseFeature ===
                                                                              field.value
                                                                      )
                                                                    : "Select second column ..."}
                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command
                                                            filter={(
                                                                value,
                                                                search
                                                            ) => {
                                                                if (
                                                                    value.includes(
                                                                        search
                                                                    )
                                                                )
                                                                    return 1;
                                                                return 0;
                                                            }}
                                                        >
                                                            <CommandInput placeholder="Search for column ..." />
                                                            <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                                <CommandEmpty>
                                                                    No columns
                                                                    found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {baseFeatures2?.map(
                                                                        (
                                                                            baseFeature: string
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    baseFeature
                                                                                }
                                                                                key={
                                                                                    baseFeature
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "second_column",
                                                                                        baseFeature
                                                                                    );
                                                                                    handleCloseCommand2();
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        baseFeature ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    baseFeature
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
                                                    Scatter and histogram will
                                                    be based on this column.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="bin_method"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="font-semibold text-md">
                                                    Bin method
                                                </FormLabel>
                                                <Select
                                                    disabled={isLoading}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    {...field}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx">
                                                            <SelectValue placeholder="Select bin method ..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Required (one of the
                                                        options)
                                                    </FormDescription>
                                                    <FormMessage />
                                                    <SelectContent>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="squareRoot"
                                                            value="squareRoot"
                                                        >
                                                            Square root
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="freedmanDiaconis"
                                                            value="freedmanDiaconis"
                                                        >
                                                            Freedman-Diaconis
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="scott"
                                                            value="scott"
                                                        >
                                                            Scott
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="sturges"
                                                            value="sturges"
                                                        >
                                                            Sturges
                                                        </SelectItem>
                                                        <SelectItem
                                                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            key="fixedNumber"
                                                            value="fixedNumber"
                                                        >
                                                            Fixed number
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    {binMethodValue === "fixedNumber" && (
                                        <FormField
                                            name="bin_number"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="px-4 mb-2">
                                                    <FormLabel className="font-semibold text-md">
                                                        Bin number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx"
                                                            disabled={isLoading}
                                                            min={2}
                                                            placeholder="Bin number ..."
                                                            type="number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Required (min. 2)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </>
                            )}

                            {/* SCATTER WITH HISTOGRAMS - END */}

                            {/* TIMESERIES - START */}

                            {chartTypeValue === "timeseries" && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Timeseries parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="first_column"
                                        render={({ field }) => (
                                            <FormItem className="px-4 mb-2">
                                                <FormLabel className="block font-semibold text-md">
                                                    Column
                                                </FormLabel>
                                                <Popover
                                                    open={open}
                                                    onOpenChange={
                                                        handleCloseCommand
                                                    }
                                                >
                                                    <PopoverTrigger
                                                        asChild
                                                        disabled={
                                                            baseFeatures?.length ===
                                                            0
                                                        }
                                                    >
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                                            >
                                                                {baseFeatures?.length ===
                                                                0
                                                                    ? "No columns available ..."
                                                                    : field.value
                                                                    ? baseFeatures?.find(
                                                                          (
                                                                              baseFeature: string
                                                                          ) =>
                                                                              baseFeature ===
                                                                              field.value
                                                                      )
                                                                    : "Select column ..."}
                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command
                                                            filter={(
                                                                value,
                                                                search
                                                            ) => {
                                                                if (
                                                                    value.includes(
                                                                        search
                                                                    )
                                                                )
                                                                    return 1;
                                                                return 0;
                                                            }}
                                                        >
                                                            <CommandInput placeholder="Search for column ..." />
                                                            <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                                                <CommandEmpty>
                                                                    No columns
                                                                    found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {baseFeatures?.map(
                                                                        (
                                                                            baseFeature: string
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    baseFeature
                                                                                }
                                                                                key={
                                                                                    baseFeature
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "first_column",
                                                                                        baseFeature
                                                                                    );
                                                                                    handleCloseCommand();
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        baseFeature ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    baseFeature
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
                                                    Timeseries will be based on
                                                    this column.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {/* TIMESERIES - END */}

                            <SectionSeparator />
                            <DialogFooter className="px-4 pt-4 pb-2">
                                <Button
                                    variant="mlopsPrimary"
                                    type="submit"
                                    // disabled={isFormDisabled()}
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

export default CreateMonitoringChartModal;
