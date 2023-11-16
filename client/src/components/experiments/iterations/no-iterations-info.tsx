import { GoIterations } from "react-icons/go";

const NoIterationsInfo = () => {
    return (
        <div className="flex items-center">
            <GoIterations className="flex-grow-0 flex-shrink-0 w-4 h-4 mr-1 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="font-semibold">
                No iterations in this experiment/s.
            </p>
        </div>
    );
};

export default NoIterationsInfo;
