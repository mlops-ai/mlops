import { CalendarDays } from "lucide-react";
import moment from "moment";
import { MdUpdate } from "react-icons/md";

interface ExperimentInfoProps {
    createdAt: Date;
    updatedAt: Date;
}

const ExperimentInfo = ({ createdAt, updatedAt }: ExperimentInfoProps) => {
    return (
        <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center font-bold">
                <CalendarDays className="w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                Created on {moment(createdAt).format("DD.MM.YYYY, HH:mm")}
            </div>
            <div className="flex items-center font-bold">
                <MdUpdate className="w-5 h-5 mr-1 text-mlops-secondary-tx dark:text-[#D5D5D5]" />
                Last updated on {moment(updatedAt).format("DD.MM.YYYY, HH:mm")}
            </div>
        </div>
    );
};

export default ExperimentInfo;
