import Cycle from "@/components/icons/cycle";
import Timeline from "@/components/icons/timeline";
import { numberBetween } from "@/lib/utils";
import { Iteration } from "@/types/iteration";
import moment from "moment-timezone";
import { GoIterations } from "react-icons/go";

interface ModelCardInfoProps {
    iteration?: Iteration;
}

const ModelCardInfo = ({ iteration }: ModelCardInfoProps) => {
    const IterationBlock = () => {
        if (!iteration) {
            return (
                <div className="flex items-center">
                    <GoIterations className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                    <span className="text-sm text-zinc-400">
                        Model is empty.
                    </span>
                </div>
            );
        }
        return (
            <div className="flex items-center mb-2">
                <GoIterations className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                <span className="text-sm font-semibold">
                    Based on model from{" "}
                    <a
                        className="italic cursor-pointer hover:underline"
                        href="#"
                    >
                        {iteration.iteration_name}
                    </a>{" "}
                    iteration.
                </span>
            </div>
        );
    };

    const hasPredictionHistory = Math.random() < 0.5;
    const predictionHistory = numberBetween(0, 3);

    const PredictionHistoryBlock = () => {
        if (iteration) {
            if (hasPredictionHistory && predictionHistory > 0) {
                return (
                    <>
                        <div className="flex items-center mb-2">
                            <Cycle className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                            <span className="text-sm font-semibold">
                                {predictionHistory} historical prediction
                                {predictionHistory > 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Timeline className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                            <span className="text-sm font-semibold">
                                Last prediction on{" "}
                                {moment(Date.now()).format("DD.MM.YYYY, HH:mm")}
                            </span>
                        </div>
                    </>
                );
            } else {
                return (
                    <div className="flex items-center">
                        <Cycle className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                        <span className="text-sm text-zinc-400">
                            0 historical predictions
                        </span>
                    </div>
                );
            }
        }
        //     return <span className="text-sm text-zinc-400">0 experiments</span>
        // } else if (experimentsCount === 1) {
        //     return <span className="text-sm font-semibold">1 experiment</span>
        // }
        // return <span className="text-sm font-semibold">{experimentsCount} experiments</span>
    };

    return (
        <>
            <div className="flex flex-col mb-2">
                {IterationBlock()}
                {PredictionHistoryBlock()}
            </div>
        </>
    );
};

export default ModelCardInfo;
