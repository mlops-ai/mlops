import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const DatasetMenuHeader = () => {
    return (
        <DropdownMenuLabel>
            <div className="flex items-center font-semibold">
                Dataset actions
            </div>
        </DropdownMenuLabel>
    );
};

export default DatasetMenuHeader;
