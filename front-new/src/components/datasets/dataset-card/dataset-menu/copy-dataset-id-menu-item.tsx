import { createToast } from "@/lib/toast";

import { Copy } from "@/components/icons";

import { DatasetQuickAction } from "@/types/types";

const CopyDatasetIdMenuItem = ({
    dataset,
    ItemType,
}: Omit<DatasetQuickAction, "setLoading">) => {
    return (
        <ItemType
            onClick={() => {
                navigator.clipboard.writeText(dataset._id);
                createToast({
                    id: "copy-dataset-id",
                    message: "Dataset ID copied to clipboard",
                    type: "success",
                });
            }}
        >
            <div className="flex items-center">
                <Copy className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                Copy dataset ID
            </div>
        </ItemType>
    );
};

export default CopyDatasetIdMenuItem;
