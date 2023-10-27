import { cn } from "@/lib/utils";

interface DataTableRowsCompareProps {
    header: string;
    cells: any[];
}

const DataTableRowCompare = ({ header, cells }: DataTableRowsCompareProps) => {
    const renderCells = () => {
        const cellsLength = cells.length;
        return cells.map((value, index) => {
            return (
                <td
                    key={index}
                    className={cn(
                        "px-6 py-4 border-b border-gray-300 dark:border-gray-600 group-hover:bg-gray-50 dark:group-hover:bg-gray-600 whitespace-nowrap min-w-[250px] w-[250px] max-w-[250px] overflow-hidden overflow-ellipsis",
                        cellsLength - 1 !== index && "border-b"
                    )}
                >
                    {value}
                </td>
            );
        });
    };

    return (
        <tr className="transition duration-300 bg-white border-gray-300 group dark:bg-gray-800 dark:border-gray-600">
            <th
                scope="row"
                className="px-6 py-4 text-base text-gray-700 bg-gray-100 border-b border-r border-gray-300 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-gray-100 group-hover:dark:bg-gray-700 dark:border-gray-600 whitespace-nowrap min-w-[250px] w-[250px] max-w-[250px] overflow-hidden overflow-ellipsis"
            >
                {`${header}:`}
            </th>
            {renderCells()}
        </tr>
    );
};

export default DataTableRowCompare;
