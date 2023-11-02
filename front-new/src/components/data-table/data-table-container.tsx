import React from "react";

interface DataTableContainerProps {
    children: React.ReactNode;
    refContainer?: React.RefObject<HTMLDivElement>;
    refs?: React.RefObject<HTMLDivElement>[];
}

const DataTableContainer = ({
    children,
    refContainer,
    refs,
}: DataTableContainerProps) => {
    return (
        <div
            className="w-full overflow-x-auto border border-gray-300 rounded-t-lg shadow-md dark:border-gray-600"
            ref={refContainer}
            onScroll={(e) => {
                if (refs && refContainer) {
                    refs.forEach((refContainer) => {
                        if (refContainer.current) {
                            refContainer.current.scrollLeft =
                                e.currentTarget.scrollLeft;
                        }
                    });
                }
            }}
        >
            <table className="w-full text-[15px] text-left text-[#181d1f] dark:text-white">
                {children}
            </table>
        </div>
    );
};

export default DataTableContainer;
