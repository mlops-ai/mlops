import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BinNumberInputProps {
    form: any;
    disabled: boolean;
}

const BinNumberInput = ({ form, disabled }: BinNumberInputProps) => {
    return (
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
                            min={2}
                            placeholder="Bin number ..."
                            type="number"
                            disabled={disabled}
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>Required (min. 2)</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default BinNumberInput;
