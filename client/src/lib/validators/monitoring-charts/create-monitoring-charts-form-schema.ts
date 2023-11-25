import { BinMethod, MonitoringChartType } from "@/types/monitoring-chart";
import * as z from "zod";

export const createMonitoringChartFormSchema = z
    .object({
        chart_type: z.nativeEnum(MonitoringChartType, {
            required_error: "Chart type is required.",
        }),
        x_axis_column: z.string().nullable().optional(),
        y_axis_columns: z.array(z.string()).nullable().optional(),
        bin_method: z.nativeEnum(BinMethod).nullable().optional(),
        bin_number: z.coerce
            .number()
            .min(2, {
                message: "Bin number must be greater than 1.",
            })
            .nullable().optional(),
        metrics: z.array(z.string()).nullable().optional(),
    })
    .refine(
        (data) => {
            return !(
                [
                    MonitoringChartType.HISTOGRAM,
                    MonitoringChartType.COUNTPLOT,
                    MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
                    MonitoringChartType.SCATTER,
                ].includes(data.chart_type) && !data.x_axis_column
            );
        },
        {
            message: "This field is required.",
            path: ["x_axis_column"],
        }
    )
    .refine(
        (data) => {
            return !(
                [
                    MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
                    MonitoringChartType.SCATTER,
                    MonitoringChartType.TIMESERIES,
                ].includes(data.chart_type) &&
                (!data.y_axis_columns || data.y_axis_columns.length === 0)
            );
        },
        {
            message: "This field is required.",
            path: ["y_axis_columns"],
        }
    )
    .refine(
        (data) => {
            return !(
                [
                    MonitoringChartType.HISTOGRAM,
                    MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
                ].includes(data.chart_type) && !data.bin_method
            );
        },
        {
            message: "You must select a bin method.",
            path: ["bin_method"],
        }
    )
    .refine(
        (data) => {
            return !(
                [
                    MonitoringChartType.HISTOGRAM,
                    MonitoringChartType.SCATTER_WITH_HISTOGRAMS,
                ].includes(data.chart_type) &&
                data.bin_method === BinMethod.FIXED_NUMBER &&
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
                [
                    MonitoringChartType.REGRESSION_METRICS,
                    MonitoringChartType.CLASSIFICATION_METRICS,
                ].includes(data.chart_type) &&
                (!data.metrics || data.metrics.length === 0)
            );
        },
        {
            message: "You must select at least one metric.",
            path: ["metrics"],
        }
    );
