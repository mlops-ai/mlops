import axios from "axios";

import { useData } from "@/hooks/use-data-hook";

import { createToast } from "@/lib/toast";

import { backendConfig } from "@/config/backend";

import { Pin, PinFilled } from "@/components/icons";

import { DatasetQuickAction } from "@/types/types";
import { Dataset } from "@/types/dataset";

const PinUnpinDatasetMenuItem = ({
    dataset,
    setLoading,
    ItemType,
}: DatasetQuickAction) => {
    const { url, port } = backendConfig;

    const data = useData();

    const handlePinUnpinDataset = async (action: "pin" | "unpin") => {
        setLoading(true);
        await axios
            .put(`${url}:${port}/datasets/${dataset._id}`, {
                pinned: action === "pin" ? true : false,
            })
            .then(() => {
                data.updateDataset(dataset._id, {
                    ...dataset,
                    pinned: action === "pin" ? true : false,
                } as Dataset);
            })
            .catch((error: any) => {
                createToast({
                    id: "pin-unpin-dataset",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
        setLoading(false);
    };

    return (
        <>
            {dataset.pinned ? (
                <ItemType onClick={() => handlePinUnpinDataset("unpin")}>
                    <div className="flex items-center">
                        <PinFilled className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                        Unpin dataset
                    </div>
                </ItemType>
            ) : (
                <ItemType onClick={() => handlePinUnpinDataset("pin")}>
                    <div className="flex items-center">
                        <Pin className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                        Pin dataset
                    </div>
                </ItemType>
            )}
        </>
    );
};

export default PinUnpinDatasetMenuItem;
