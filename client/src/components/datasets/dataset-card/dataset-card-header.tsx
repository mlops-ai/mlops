import { PinFilled } from "@/components/icons";

import { Dataset } from "@/types/dataset";
import DatasetDropdownActions from "../dataset-dropdown-actions";

interface DatasetCardProps {
    dataset: Dataset;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatasetCardHeader = ({ dataset, setLoading }: DatasetCardProps) => {
    return (
        <div className="flex items-center justify-between mb-2 font-semibold">
            <span className="flex items-center mr-2 cursor-pointer text-mlops-primary-tx dark:text-mlops-primary-tx-dark hover:underline">
                {dataset.pinned && (
                    <div title="Dataset is pinned">
                        <PinFilled className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-primary" />
                    </div>
                )}{" "}
                {dataset.dataset_name}
            </span>
            <DatasetDropdownActions dataset={dataset} setLoading={setLoading} />
        </div>
    );
};

export default DatasetCardHeader;
