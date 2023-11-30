import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { monitoringChartTypesMap } from "@/config/maping";
import { cn } from "@/lib/utils";
import { MonitoringChartType } from "@/types/monitoring-chart";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const chartTypes = Object.keys(monitoringChartTypesMap);

interface ChartTypeSelectProps {
    form: any;
    openChartTypeSelect: boolean;
    setOpenChartTypeSelect: Dispatch<SetStateAction<boolean>>;
    handleCloseSelect: (
        open: boolean,
        setOpen: Dispatch<SetStateAction<boolean>>
    ) => void;
    disabled: boolean;
}

const ChartTypeSelect = ({
    form,
    openChartTypeSelect,
    setOpenChartTypeSelect,
    handleCloseSelect,
    disabled,
}: ChartTypeSelectProps) => {
    return (
        <FormField
            control={form.control}
            name="chart_type"
            render={({ field }) => (
                <FormItem className="px-4 mb-2">
                    <FormLabel className="block font-semibold text-md">
                        Chart type
                    </FormLabel>
                    <Popover
                        open={openChartTypeSelect}
                        onOpenChange={() =>
                            handleCloseSelect(
                                openChartTypeSelect,
                                setOpenChartTypeSelect
                            )
                        }
                    >
                        <PopoverTrigger asChild disabled={disabled}>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                >
                                    {field.value
                                        ? monitoringChartTypesMap[
                                              chartTypes?.find(
                                                  (chartType: string) =>
                                                      chartType === field.value
                                              ) as MonitoringChartType
                                          ]
                                        : "Select chart type ..."}
                                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command className="w-100">
                                <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                                    <CommandGroup>
                                        {chartTypes?.map(
                                            (chartType: string) => (
                                                <CommandItem
                                                    value={chartType}
                                                    key={chartType}
                                                    onSelect={() => {
                                                        form.reset();
                                                        form.setValue(
                                                            "chart_type",
                                                            chartType
                                                        );
                                                        handleCloseSelect(
                                                            openChartTypeSelect,
                                                            setOpenChartTypeSelect
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            chartType ===
                                                                field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {
                                                        monitoringChartTypesMap[
                                                            chartType as MonitoringChartType
                                                        ]
                                                    }
                                                </CommandItem>
                                            )
                                        )}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default ChartTypeSelect;
