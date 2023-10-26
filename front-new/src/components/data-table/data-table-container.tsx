import React from "react";

const DataTableContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg shadow-md dark:border-gray-700">
            <table className="w-full text-[15px] text-left text-[#181d1f] dark:text-white">
                {children}
            </table>
        </div>
    );
};

export default DataTableContainer;
