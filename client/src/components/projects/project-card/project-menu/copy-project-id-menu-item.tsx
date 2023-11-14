import { createToast } from "@/lib/toast";

import { Copy } from "@/components/icons";

import { ProjectQuickAction } from "@/types/types";

const CopyProjectIdMenuItem = ({
    project,
    ItemType,
}: Omit<ProjectQuickAction, "setLoading">) => {
    return (
        <ItemType
            onClick={() => {
                navigator.clipboard.writeText(project._id);
                createToast({
                    id: "copy-project-id",
                    message: "Project ID copied to clipboard",
                    type: "success",
                });
            }}
        >
            <div className="flex items-center">
                <Copy className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                Copy project ID
            </div>
        </ItemType>
    );
};

export default CopyProjectIdMenuItem;
