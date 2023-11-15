import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dispatch, SetStateAction, useState } from "react";
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
import { Form } from "@/components/ui/form";
import SectionSeparator from "@/components/navigation/section-separator";

import { Model } from "@/types/model";
import { Keyable } from "@/types/types";
import ChartTypeSelect from "./create-monitoring-chart-form/chart-type-select";
import ColumnSelect from "./create-monitoring-chart-form/column-select";
import BinMethodSelect from "./create-monitoring-chart-form/bin-method-select";
import BinNumberInput from "./create-monitoring-chart-form/bin-number-input";

const formSchema = z
    .object({
        chart_type: z.enum(
            [
                "histogram",
                "countplot",
                "scatter",
                "scatter_with_histograms",
                "timeseries",
                "classification_metrics",
                "regression_metrics",
            ],
            { required_error: "Chart type is required." }
        ),
        first_column: z.string().optional(),
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
                [
                    "histogram",
                    "countplot",
                    "scatter_with_histograms",
                    "timeseries",
                    "scatter",
                ].includes(data.chart_type) && !data.first_column
            );
        },
        {
            message: "This field is required.",
            path: ["first_column"],
        }
    )
    .refine(
        (data) => {
            return !(
                ["scatter_with_histograms", "scatter"].includes(
                    data.chart_type
                ) && !data.second_column
            );
        },
        {
            message: "This field is required.",
            path: ["second_column"],
        }
    )
    .refine(
        (data) => {
            return !(
                ["histogram", "scatter_with_histograms"].includes(
                    data.chart_type
                ) && !data.bin_method
            );
        },
        {
            message: "This field is required.",
            path: ["bin_method"],
        }
    )

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

    const isModalOpen = isOpen && type === "createMonitoringChart";

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

        let chartData: Keyable;

        switch (values.chart_type) {
            case "histogram":
                chartData = {
                    chart_type: values.chart_type,
                    first_column: values.first_column as string,
                    second_column: null,
                    bin_method: values.bin_method,
                    bin_number:
                        values.bin_method === "fixedNumber"
                            ? values.bin_number
                            : null,
                };
                break;
            case "countplot":
            case "timeseries":
                chartData = {
                    chart_type: values.chart_type,
                    first_column: values.first_column as string,
                    second_column: null,
                    bin_method: null,
                    bin_number: null,
                };
                break;
            case "scatter":
                chartData = {
                    chart_type: values.chart_type,
                    first_column: values.first_column as string,
                    second_column: values.second_column as string,
                    bin_method: null,
                    bin_number: null,
                };
                break;
            case "scatter_with_histograms":
                chartData = {
                    chart_type: values.chart_type,
                    first_column: values.first_column as string,
                    second_column: values.second_column as string,
                    bin_method: values.bin_method,
                    bin_number:
                        values.bin_method === "fixedNumber"
                            ? values.bin_number
                            : null,
                };
                break;
            case "classification_metrics":
            case "regression_metrics":
                chartData = {
                    chart_type: values.chart_type,
                    first_column: null,
                    second_column: null,
                    bin_method: null,
                    bin_number: null,
                };
                break;
        }

        await axios
            .post(
                `${url}:${port}/monitored-models/${data.model._id}/charts`,
                chartData
            )
            .then((res) => {
                handleClose();
                form.reset();
                dataStore.updateModel(
                    data.model?._id as string,
                    {
                        ...data.model,
                        interactive_charts: [
                            ...data.model!.interactive_charts,
                            res.data,
                        ],
                    } as Model
                );

                createToast({
                    id: "create-monitoring-chart",
                    message: "Monitoring chart created successfully!",
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "create-monitoring-chart",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
    };

    const [openChartTypeSelect, setOpenChartTypeSelect] = useState(false);
    const [openFirstColumnSelect, setOpenFirstColumnSelect] = useState(false);
    const [openSecondColumnSelect, setOpenSecondColumnSelect] = useState(false);
    const [openBinMethodSelect, setOpenBinMethodSelect] = useState(false);

    const handleCloseSelect = (
        open: boolean,
        setOpen: Dispatch<SetStateAction<boolean>>
    ) => {
        if (open) {
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
        if (isLoading || toast.isActive("create-monitoring-chart")) {
            e.preventDefault();
        }
    };

    if (!isModalOpen) return null;

    const isFormDisabled = () => {
        const formValues = form.getValues();

        if (!formValues.chart_type) return true;

        if (
            [
                "histogram",
                "countplot",
                "scatter_with_histograms",
                "timeseries",
                "scatter",
            ].includes(formValues.chart_type) &&
            !formValues.first_column
        )
            return true;

        if (
            ["scatter_with_histograms", "scatter"].includes(
                formValues.chart_type
            ) &&
            !formValues.second_column
        )
            return true;

        if (
            ["histogram", "scatter_with_histograms"].includes(
                formValues.chart_type
            ) &&
            !formValues.bin_method
        )
            return true;

        if (
            ["histogram", "scatter_with_histograms"].includes(
                formValues.chart_type
            ) &&
            formValues.bin_method === "fixedNumber" &&
            (!formValues.bin_number || formValues.bin_number < 2)
        )
            return true;

        return false;
    };

    const baseFeatures = [
        ...(data.baseFeatures as string[]),
        "prediction",
        "actual",
    ].filter((feature) => feature !== secondColumnValue);
    const baseFeatures2 = [
        ...(data.baseFeatures as string[]),
        "prediction",
        "actual",
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
                            <ChartTypeSelect
                                form={form}
                                openChartTypeSelect={openChartTypeSelect}
                                setOpenChartTypeSelect={setOpenChartTypeSelect}
                                handleCloseSelect={handleCloseSelect}
                                disabled={isLoading}
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

                                    <ColumnSelect
                                        form={form}
                                        column="first_column"
                                        baseFeatures={baseFeatures}
                                        description="Histogram will be based on this column."
                                        openColumnSelect={openFirstColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenFirstColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    <BinMethodSelect
                                        form={form}
                                        openBinMethodSelect={
                                            openBinMethodSelect
                                        }
                                        setOpenBinMethodSelect={
                                            setOpenBinMethodSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    {binMethodValue === "fixedNumber" && (
                                        <BinNumberInput form={form} disabled={isLoading} />
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

                                    <ColumnSelect
                                        form={form}
                                        column="first_column"
                                        baseFeatures={baseFeatures}
                                        description="Countplot will be based on this column."
                                        openColumnSelect={openFirstColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenFirstColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
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

                                    <ColumnSelect
                                        form={form}
                                        column="first_column"
                                        baseFeatures={baseFeatures}
                                        description="Scatter will be based on this column."
                                        openColumnSelect={openFirstColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenFirstColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    <ColumnSelect
                                        form={form}
                                        column="second_column"
                                        baseFeatures={baseFeatures2}
                                        description="Scatter will be based on this column."
                                        openColumnSelect={
                                            openSecondColumnSelect
                                        }
                                        setOpenColumnSelect={
                                            setOpenSecondColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
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

                                    <ColumnSelect
                                        form={form}
                                        column="first_column"
                                        baseFeatures={baseFeatures}
                                        description="Scatter and histograms will be based on this column."
                                        openColumnSelect={openFirstColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenFirstColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    <ColumnSelect
                                        form={form}
                                        column="second_column"
                                        baseFeatures={baseFeatures2}
                                        description="Scatter and histograms will be based on this column."
                                        openColumnSelect={
                                            openSecondColumnSelect
                                        }
                                        setOpenColumnSelect={
                                            setOpenSecondColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    <BinMethodSelect
                                        form={form}
                                        openBinMethodSelect={
                                            openBinMethodSelect
                                        }
                                        setOpenBinMethodSelect={
                                            setOpenBinMethodSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    {binMethodValue === "fixedNumber" && (
                                        <BinNumberInput form={form} disabled={isLoading} />
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
                                    <ColumnSelect
                                        form={form}
                                        column="first_column"
                                        baseFeatures={baseFeatures}
                                        description="Timeseries will be based on this column."
                                        openColumnSelect={openFirstColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenFirstColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />
                                </>
                            )}

                            {/* TIMESERIES - END */}

                            <SectionSeparator />
                            <DialogFooter className="px-4 pt-4 pb-2">
                                <Button
                                    variant="mlopsDanger"
                                    onClick={() => form.reset()}
                                    type="reset"
                                    disabled={isLoading}
                                >
                                    Reset form
                                </Button>
                                <Button
                                    variant="mlopsPrimary"
                                    type="submit"
                                    disabled={isFormDisabled() || isLoading}
                                >
                                    <Loading
                                        className={cn(
                                            "animate-spin mr-1 hidden",
                                            isLoading && "inline"
                                        )}
                                    />
                                    Create chart
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
