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
import { cn } from "@/lib/utils";
import { Keyable } from "@/types/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface MultiSelectProps {
    form: any;
    openMetricsSelect: boolean;
    setOpenMetricsSelect: Dispatch<SetStateAction<boolean>>;
    handleCloseSelect: (
        open: boolean,
        setOpen: Dispatch<SetStateAction<boolean>>
    ) => void;
    disabled: boolean;
    options: string[];
    mapping: Keyable;
}

const MultiSelect = ({
    form,
    openMetricsSelect,
    setOpenMetricsSelect,
    handleCloseSelect,
    disabled,
    options,
    mapping,
}: MultiSelectProps) => {
    return (
        <FormField
            control={form.control}
            name="metrics"
            render={({ field }) => (
                <FormItem className="px-4 mb-2">
                    <FormLabel className="block font-semibold text-md">
                        Select metrics
                    </FormLabel>
                    <Popover
                        open={openMetricsSelect}
                        onOpenChange={() =>
                            handleCloseSelect(
                                openMetricsSelect,
                                setOpenMetricsSelect
                            )
                        }
                    >
                        <PopoverTrigger asChild disabled={disabled}>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full h-auto justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                >
                                    {field.value && field.value.length !== 0
                                        ? field.value
                                              .map(
                                                  (metric: string) =>
                                                      mapping[metric]
                                              )
                                              .join(", ")
                                        : "Select metrics ..."}
                                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command className="w-100">
                                <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                                    <CommandGroup>
                                        {options?.map((metric: string) => (
                                            <CommandItem
                                                value={metric}
                                                key={metric}
                                                onSelect={() => {
                                                    if (
                                                        (
                                                            field.value || []
                                                        ).includes(metric)
                                                    ) {
                                                        form.setValue(
                                                            "metrics",
                                                            [
                                                                ...(
                                                                    field.value ||
                                                                    []
                                                                ).filter(
                                                                    (
                                                                        m: string
                                                                    ) =>
                                                                        m !==
                                                                        metric
                                                                ),
                                                            ]
                                                        );
                                                    } else {
                                                        form.setValue(
                                                            "metrics",
                                                            [
                                                                ...(field.value ||
                                                                    []),
                                                                metric,
                                                            ]
                                                        );
                                                    }
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        (
                                                            field.value || []
                                                        ).includes(metric)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {mapping[metric]}
                                            </CommandItem>
                                        ))}
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

export default MultiSelect;
