import { modelStatusesMap } from "@/config/maping";

import { Badge } from "@/components/ui/badge";

interface ModelCardStatusProps {
    status: "active" | "idle" | "archived";
}

const ModelCardStatus = ({ status }: ModelCardStatusProps) => {
    return (
        <div className="flex items-center mb-3">
            <Badge variant={status} title="Model Status">
                {modelStatusesMap[status]}
            </Badge>
        </div>
    );
};

export default ModelCardStatus;
