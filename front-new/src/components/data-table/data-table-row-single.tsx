import React from "react";

const DataTableRowSingle = ({ children }: { children: React.ReactNode }) => {
    return (
        <tr className="transition duration-300 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
            {children}
        </tr>
    );
};

export default DataTableRowSingle;
