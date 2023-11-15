import { Cycle } from "@/components/icons";

const ModelNoPredictions = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full my-16">
            <Cycle className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                Nothing to show.
            </p>
            <p className="text-sm text-center">
                This model has no predictions history. <br />
                Start predicting to see predictions history and monitoring charts.
            </p>
        </div>
    );
};

export default ModelNoPredictions;
