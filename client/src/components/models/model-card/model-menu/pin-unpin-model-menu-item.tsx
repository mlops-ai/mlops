import axios from "axios";

import { useData } from "@/hooks/use-data-hook";

import { createToast } from "@/lib/toast";

import { backendConfig } from "@/config/backend";

import { Pin, PinFilled } from "@/components/icons";

import { ModelQuickAction } from "@/types/types";
import { Model } from "@/types/model";

const PinUnpinModelMenuItem = ({
    model,
    setLoading,
    ItemType,
}: ModelQuickAction) => {
    const { url, port } = backendConfig;

    const data = useData();

    const handlePinUnpinModel = async (action: "pin" | "unpin") => {
        setLoading(true);
        await axios
            .put(`${url}:${port}/monitored-models/${model._id}`, {
                pinned: action === "pin" ? true : false,
            })
            .then(() => {
                data.updateModel(model._id, {
                    ...model,
                    pinned: action === "pin" ? true : false,
                } as Model);
            })
            .catch((error: any) => {
                createToast({
                    id: "pin-unpin-model",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
        setLoading(false);
    };

    return (
        <>
            {model.pinned ? (
                <ItemType onClick={() => handlePinUnpinModel("unpin")}>
                    <div className="flex items-center">
                        <PinFilled className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                        Unpin model
                    </div>
                </ItemType>
            ) : (
                <ItemType onClick={() => handlePinUnpinModel("pin")}>
                    <div className="flex items-center">
                        <Pin className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                        Pin model
                    </div>
                </ItemType>
            )}
        </>
    );
};

export default PinUnpinModelMenuItem;
