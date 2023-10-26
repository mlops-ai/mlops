import { useSearchParams } from "react-router-dom";

import { PinFilled } from "@/components/icons";

import { Model } from "@/types/model";
import ModelDropdownActions from "../model-dropdown-actions";

interface ModelCardProps {
    model: Model;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModelCardHeader = ({ model, setLoading }: ModelCardProps) => {
    const [searchParams, setSearchParams] = useSearchParams({
        ne: "default",
    });

    return (
        <div className="flex items-center justify-between mb-2 font-semibold">
            <span className="flex items-center mr-2 cursor-pointer text-mlops-primary-tx dark:text-mlops-primary-tx-dark hover:underline">
                {model.pinned && (
                    <div title="Model is pinned">
                        <PinFilled className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-primary" />
                    </div>
                )}{" "}
                <a
                    href={`/models/${model._id}/monitoring${
                        searchParams.get("ne") !== "default"
                            ? `?ne=${searchParams.get("ne")}`
                            : ""
                    }`}
                >
                    {model.model_name}
                </a>
            </span>
            <ModelDropdownActions model={model} setLoading={setLoading} />
        </div>
    );
};

export default ModelCardHeader;
