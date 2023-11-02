interface DataTableHeaderProps {
    cols: string[];
}

const DataTableHeader = ({ cols }: DataTableHeaderProps) => {
    const renderCols = () => {
        return cols.map((col) => {
            return (
                <th key={col} scope="col" className="px-6 py-3">
                    {col}
                </th>
            );
        });
    };
    return (
        <thead className="text-base text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-white">
            <tr className="border-b border-gray-300 dark:border-gray-600">
                {renderCols()}
            </tr>
        </thead>
    );
};

export default DataTableHeader;
