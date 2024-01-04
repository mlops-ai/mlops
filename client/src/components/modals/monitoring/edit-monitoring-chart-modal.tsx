/**
 * Imports
 */
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Hooks
 */
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useData } from "@/hooks/use-data-hook";
import { useModal } from "@/hooks/use-modal-hook";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { createToast } from "@/lib/toast";

import { cn, prepareCreateMonitoringChartFormData } from "@/lib/utils";

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

import ChartTypeSelect from "./create-monitoring-chart-form/chart-type-select";
import ColumnSelect from "./create-monitoring-chart-form/column-select-single";
import BinMethodSelect from "./create-monitoring-chart-form/bin-method-select";
import BinNumberInput from "./create-monitoring-chart-form/bin-number-input";
import MultiSelect from "./create-monitoring-chart-form/multi-select";

/**
 * Mapings
 */
import {
    classificationMetricsMap,
    regressionMetricsMap,
} from "@/config/maping";

/**
 * Form validation schema
 */
import { createMonitoringChartFormSchema as formSchema } from "@/lib/validators";
import {
    BinMethod,
    MonitoringChart,
    MonitoringChartType,
} from "@/types/monitoring-chart";
import ColumnSelectMultiple from "./create-monitoring-chart-form/column-select-multiple";

const EditMonitoringChartModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const dataStore = useData();

    const { url, port } = backendConfig;

    const isModalOpen = isOpen && type === "editMonitoringChart";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        form.reset(data.monitoringChart);
    }, [data.monitoringChart]);

    const { watch } = form;

    const isLoading = form.formState.isSubmitting;

    const chartTypeValue = watch("chart_type");
    const binMethodValue = watch("bin_method");
    const xAxisColumnValue = watch("x_axis_column");
    const yAxisColumnsValue = watch("y_axis_columns");
    const metricsValue = watch("metrics");

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!data.model || !data.monitoringChart || !data.baseFeatures) return;

        if (data.monitoringChart?.chart_type !== values.chart_type) return;

        const chartData = prepareCreateMonitoringChartFormData(values);

        await axios
            .put(
                `${url}:${port}/monitored-models/${data.model._id}/charts/${data.monitoringChart.id}`,
                chartData
            )
            .then((res) => {
                handleClose();

                console.log(res.data);

                dataStore.updateMonitoringChart(
                    data.model!._id,
                    data.monitoringChart?.id as string,
                    res.data as MonitoringChart
                );

                createToast({
                    id: "edit-monitoring-chart",
                    message: "Monitoring chart updated successfully!",
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "edit-monitoring-chart",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
    };

    const [openChartTypeSelect, setOpenChartTypeSelect] = useState(false);
    const [openXAxisColumnSelect, setOpenXAxisColumnSelect] = useState(false);
    const [openYAxisColumnsSelect, setOpenYAxisColumnsSelect] = useState(false);
    const [openBinMethodSelect, setOpenBinMethodSelect] = useState(false);
    const [openMetricsSelect, setOpenMetricsSelect] = useState(false);

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
        if (isLoading || toast.isActive("edit-monitoring-chart")) {
            e.preventDefault();
        }
    };

    if (!isModalOpen) return null;

    const isFormDisabled = () => {
        const formValues = form.getValues();

        if (!formValues.chart_type) return true;

        if (
            [
                MonitoringChartType.HISTOGRAM,
                MonitoringChartType.COUNTPLOT,
                MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
                MonitoringChartType.SCATTER,
            ].includes(formValues.chart_type) &&
            !formValues.x_axis_column
        )
            return true;

        if (
            [
                MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
                MonitoringChartType.SCATTER,
                MonitoringChartType.TIMESERIES,
            ].includes(formValues.chart_type) &&
            (!formValues.y_axis_columns ||
                formValues.y_axis_columns.length === 0)
        )
            return true;

        if (
            [
                MonitoringChartType.HISTOGRAM,
                MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
            ].includes(formValues.chart_type) &&
            !formValues.bin_method
        )
            return true;

        if (
            [
                MonitoringChartType.HISTOGRAM,
                MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
            ].includes(formValues.chart_type) &&
            formValues.bin_method === BinMethod.FIXED_NUMBER &&
            (!formValues.bin_number || formValues.bin_number < 2)
        )
            return true;

        if (
            [
                MonitoringChartType.CLASSIFICATION_METRICS,
                MonitoringChartType.REGRESSION_METRICS,
            ].includes(formValues.chart_type) &&
            (!formValues.metrics || formValues.metrics.length === 0)
        )
            return true;

        return false;
    };

    const baseFeatures = [
        ...(data.baseFeatures as string[]),
        "prediction",
        "actual",
    ].filter((feature) => !(yAxisColumnsValue || []).includes(feature));
    const baseFeatures2 = [
        ...(data.baseFeatures as string[]),
        "prediction",
        "actual",
    ].filter((feature) => feature !== xAxisColumnValue);

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
                            Edit monitoring chart
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
                                disabled={true}
                            />

                            {/* HISTOGRAM - START */}

                            {chartTypeValue ===
                                MonitoringChartType.HISTOGRAM && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Histogram parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>

                                    <ColumnSelect
                                        form={form}
                                        column="x_axis_column"
                                        baseFeatures={baseFeatures}
                                        description="Histogram will be based on this column."
                                        openColumnSelect={openXAxisColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenXAxisColumnSelect
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

                                    {binMethodValue ===
                                        BinMethod.FIXED_NUMBER && (
                                        <BinNumberInput
                                            form={form}
                                            disabled={isLoading}
                                        />
                                    )}
                                </>
                            )}

                            {/* HISTOGRAM - END */}

                            {/* COUNT PLOT - START */}

                            {chartTypeValue ===
                                MonitoringChartType.COUNTPLOT && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Countplot parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>

                                    <ColumnSelect
                                        form={form}
                                        column="x_axis_column"
                                        baseFeatures={baseFeatures}
                                        description="Countplot will be based on this column."
                                        openColumnSelect={openXAxisColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenXAxisColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />
                                </>
                            )}

                            {/* COUNT PLOT - END */}

                            {/* SCATTER - START */}

                            {chartTypeValue === MonitoringChartType.SCATTER && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Scatter plot parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>

                                    <ColumnSelect
                                        form={form}
                                        column="x_axis_column"
                                        baseFeatures={baseFeatures}
                                        description="Scatter will be based on this column."
                                        openColumnSelect={openXAxisColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenXAxisColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    <ColumnSelectMultiple
                                        form={form}
                                        openSelect={openYAxisColumnsSelect}
                                        setOpenSelect={
                                            setOpenYAxisColumnsSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                        baseFeatures={baseFeatures2}
                                    />
                                </>
                            )}

                            {/* SCATTER - END */}

                            {/* SCATTER WITH HISTOGRAMS - START */}

                            {chartTypeValue ===
                                MonitoringChartType.SCATTER_WITH_HISTOGRAMS && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Scatter with histograms parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>

                                    <ColumnSelect
                                        form={form}
                                        column="x_axis_column"
                                        baseFeatures={baseFeatures}
                                        description="Scatter and histograms will be based on this column."
                                        openColumnSelect={openXAxisColumnSelect}
                                        setOpenColumnSelect={
                                            setOpenXAxisColumnSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                    />

                                    <ColumnSelect
                                        form={form}
                                        column="y_axis_columns"
                                        baseFeatures={baseFeatures2}
                                        description="Scatter and histograms will be based on this column."
                                        openColumnSelect={
                                            openYAxisColumnsSelect
                                        }
                                        setOpenColumnSelect={
                                            setOpenYAxisColumnsSelect
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

                                    {binMethodValue ===
                                        BinMethod.FIXED_NUMBER && (
                                        <BinNumberInput
                                            form={form}
                                            disabled={isLoading}
                                        />
                                    )}
                                </>
                            )}

                            {/* SCATTER WITH HISTOGRAMS - END */}

                            {/* TIMESERIES - START */}

                            {chartTypeValue ===
                                MonitoringChartType.TIMESERIES && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Timeseries parameters
                                        </div>
                                        <SectionSeparator />
                                    </h2>

                                    <ColumnSelectMultiple
                                        form={form}
                                        openSelect={openYAxisColumnsSelect}
                                        setOpenSelect={
                                            setOpenYAxisColumnsSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                        baseFeatures={baseFeatures2}
                                    />
                                </>
                            )}

                            {/* TIMESERIES - END */}

                            {/* REGRESSION METRICS - START */}

                            {chartTypeValue ===
                                MonitoringChartType.REGRESSION_METRICS && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Regression metrics options
                                        </div>
                                        <SectionSeparator />
                                    </h2>
                                    <MultiSelect
                                        form={form}
                                        openMetricsSelect={openMetricsSelect}
                                        setOpenMetricsSelect={
                                            setOpenMetricsSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                        options={Object.keys(
                                            regressionMetricsMap
                                        )}
                                        mapping={regressionMetricsMap}
                                    />
                                </>
                            )}

                            {/* REGRESSION METRICS - END */}

                            {/* CLASSIFICATION METRICS - START */}

                            {chartTypeValue ===
                                MonitoringChartType.CLASSIFICATION_METRICS && (
                                <>
                                    <h2 className="mx-4 my-2">
                                        <div className="flex items-center justify-center mb-1 text-xl">
                                            Classification metrics options
                                        </div>
                                        <SectionSeparator />
                                    </h2>
                                    <MultiSelect
                                        form={form}
                                        openMetricsSelect={openMetricsSelect}
                                        setOpenMetricsSelect={
                                            setOpenMetricsSelect
                                        }
                                        handleCloseSelect={handleCloseSelect}
                                        disabled={isLoading}
                                        options={Object.keys(
                                            classificationMetricsMap
                                        )}
                                        mapping={classificationMetricsMap}
                                    />
                                </>
                            )}

                            {/* CLASSIFICATION METRICS - END */}

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
                                    Edit chart
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

export default EditMonitoringChartModal;
