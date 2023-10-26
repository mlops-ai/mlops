import React from "react";

interface ImageChartProps {
    index: number;
    data_image_type: string;
    encoded_image: string;
    chart_name: string;
    setStatus: React.Dispatch<
        React.SetStateAction<{
            isOpen: boolean;
            key: number;
        }>
    >;
}

const ImageChart = ({
    index,
    data_image_type,
    encoded_image,
    chart_name,
    setStatus,
}: ImageChartProps) => {
    return (
        <div
            key={index}
            className="flex w-full bg-white border border-gray-300 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
            <img
                src={`${data_image_type},${encoded_image}`}
                className="w-full h-auto p-2 cursor-pointer"
                alt={chart_name}
                onClick={() =>
                    setStatus({
                        isOpen: true,
                        key: index,
                    })
                }
            />
        </div>
    );
};

export default ImageChart;
