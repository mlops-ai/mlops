import { ModelQuickAction } from "@/types/types";
import {GoIterations} from "react-icons/go";
import {useNavigate, useSearchParams} from "react-router-dom";

const NavigateToModelIterationMenuItem = ({
    model,
    ItemType,
}: Omit<ModelQuickAction, "setLoading">) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    return (
        <ItemType
        >
            <div className="flex items-center" onClick={() => {
                return navigate(`/projects/${model.iteration?.project_id}/experiments/${model.iteration?.experiment_id}/iterations/${model.iteration?.id}${
                    searchParams.get("ne") !== "default"
                        ? `?ne=${searchParams.get("ne")}`
                        : ""
                }`)
            }}>
                <GoIterations className="flex-shrink-0 w-5 h-5 mr-2 dark:text-[#D5D5D5]" />
                Navigate to iteration
            </div>
        </ItemType>
    );
};

export default NavigateToModelIterationMenuItem;
