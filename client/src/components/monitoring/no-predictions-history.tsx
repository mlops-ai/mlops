import { Cycle } from "@/components/icons";

const NoPredictionsHistory = () => {
    return (
        <div className="flex items-center">
            <Cycle className="flex-grow-0 flex-shrink-0 w-4 h-4 mr-1 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="font-semibold">
                No predictions history in this model.
            </p>
        </div>
    );
};

export default NoPredictionsHistory;
