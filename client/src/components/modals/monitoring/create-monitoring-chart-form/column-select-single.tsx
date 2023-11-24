import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    FormControl,
    FormDescription,
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ColumnSelectProps {
    form: any;
    column: "x_axis_column" | "y_axis_columns";
    baseFeatures: string[];
    description: string;
    openColumnSelect: boolean;
    setOpenColumnSelect: Dispatch<SetStateAction<boolean>>;
    handleCloseSelect: (
        open: boolean,
        setOpen: Dispatch<SetStateAction<boolean>>
    ) => void;
    disabled: boolean;
}

const ColumnSelect = ({form, column, baseFeatures, description, openColumnSelect, setOpenColumnSelect, handleCloseSelect, disabled}: ColumnSelectProps) => {
    return (
        <FormField
            control={form.control}
            name={column}
            render={({ field }) => (
                <FormItem className="px-4 mb-2">
                    <FormLabel className="block font-semibold text-md">
                        X-Axis column
                    </FormLabel>
                    <Popover
                        open={openColumnSelect}
                        onOpenChange={() =>
                            handleCloseSelect(
                                openColumnSelect,
                                setOpenColumnSelect
                            )
                        }
                    >
                        <PopoverTrigger
                            asChild
                            disabled={baseFeatures?.length === 0 || disabled}
                        >
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx p-3"
                                >
                                    {baseFeatures?.length === 0
                                        ? "No columns available ..."
                                        : field.value
                                        ? column === "y_axis_columns" ? field.value[0] : field.value
                                        : "Select column ..."}
                                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command
                                filter={(value, search) => {
                                    if (value.includes(search)) return 1;
                                    return 0;
                                }}
                            >
                                <CommandInput placeholder="Search for column ..." />
                                <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                    <CommandEmpty>
                                        No columns found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {baseFeatures?.map(
                                            (baseFeature: string) => (
                                                <CommandItem
                                                    value={baseFeature}
                                                    key={baseFeature}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            column,
                                                            column === "y_axis_columns" ? [baseFeature] : baseFeature
                                                        );
                                                        handleCloseSelect(
                                                            openColumnSelect,
                                                            setOpenColumnSelect
                                                        );
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
                                                    {baseFeature}
                                                </CommandItem>
                                            )
                                        )}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormDescription>
                        {description}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default ColumnSelect;
