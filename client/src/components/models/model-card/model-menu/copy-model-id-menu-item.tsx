import { createToast } from "@/lib/toast";

import { Copy } from "@/components/icons";

import { ModelQuickAction } from "@/types/types";

const CopyModelIdMenuItem = ({
    model,
    ItemType,
}: Omit<ModelQuickAction, "setLoading">) => {
    return (
        <ItemType
            onClick={() => {
                navigator.clipboard.writeText(model._id);
                createToast({
                    id: "copy-model-id",
                    message: "Model ID copied to clipboard",
                    type: "success",
                });
            }}
        >
            <div className="flex items-center">
                <Copy className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                Copy model ID
            </div>
        </ItemType>
    );
};

export default CopyModelIdMenuItem;
