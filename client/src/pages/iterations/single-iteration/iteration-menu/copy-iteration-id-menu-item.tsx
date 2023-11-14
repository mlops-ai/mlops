import { createToast } from "@/lib/toast";

import { Copy } from "@/components/icons";

import { IterationQuickAction } from "@/types/types";

const CopyIterationIdMenuItem = ({
    iteration,
    ItemType,
}: Omit<IterationQuickAction, "setLoading">) => {
    return (
        <ItemType
            onClick={() => {
                navigator.clipboard.writeText(iteration.id);
                createToast({
                    id: "copy-iteration-id",
                    message: "Iteration ID copied to clipboard",
                    type: "success",
                });
            }}
        >
            <div className="flex items-center">
                <Copy className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                Copy iteration ID
            </div>
        </ItemType>
    );
};

export default CopyIterationIdMenuItem;
