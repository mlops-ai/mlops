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
import { binMethodsMap } from "@/config/maping";
import { cn } from "@/lib/utils";
import { BinMethods } from "@/types/monitoring_chart";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const binMethods = [
    BinMethods.SQUARE_ROOT,
    BinMethods.FREEDMAN_DIACONIS,
    BinMethods.SCOTT,
    BinMethods.STURGES,
    BinMethods.FIXED_NUMBER,
];

interface BinMethodSelectProps {
    form: any;
    openBinMethodSelect: boolean;
    setOpenBinMethodSelect: Dispatch<SetStateAction<boolean>>;
    handleCloseSelect: (
        open: boolean,
        setOpen: Dispatch<SetStateAction<boolean>>
    ) => void;
    disabled: boolean;
}

const BinMethodSelect = ({
    form,
    openBinMethodSelect,
    setOpenBinMethodSelect,
    handleCloseSelect,
    disabled,
}: BinMethodSelectProps) => {
    return (
        <FormField
            name="bin_method"
            control={form.control}
            render={({ field }) => (
                <FormItem className="px-4 mb-2">
                    <FormLabel className="font-semibold text-md">
                        Bin method
                    </FormLabel>
                    <Popover
                        open={openBinMethodSelect}
                        onOpenChange={() =>
                            handleCloseSelect(
                                openBinMethodSelect,
                                setOpenBinMethodSelect
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
                                        ? binMethodsMap[
                                              binMethods?.find(
                                                  (binMethod: string) =>
                                                      binMethod === field.value
                                              ) as BinMethods
                                          ]
                                        : "Select bin method ..."}
                                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command className="w-100">
                                <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                                    <CommandGroup>
                                        {binMethods?.map(
                                            (binMethod: string) => (
                                                <CommandItem
                                                    value={binMethod}
                                                    key={binMethod}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "bin_method",
                                                            binMethod
                                                        );
                                                        handleCloseSelect(
                                                            openBinMethodSelect,
                                                            setOpenBinMethodSelect
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            binMethod ===
                                                                field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {
                                                        binMethodsMap[
                                                            binMethod as BinMethods
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

export default BinMethodSelect;
