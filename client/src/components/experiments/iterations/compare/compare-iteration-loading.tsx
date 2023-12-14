import Breadcrumb from "@/components/breadcrumb";
import { Loading } from "@/components/icons";
import PageHeader from "@/components/page-header";
import { LayoutDashboard } from "lucide-react";
import { AiOutlineExperiment } from "react-icons/ai";
import { GoIterations } from "react-icons/go";
import { VscProject } from "react-icons/vsc";

const CompareIterationLoading = () => {
    return (
        <>
            <div className="mb-4">
                <PageHeader title="..." />
                <Breadcrumb
                    items={[
                        {
                            name: "Projects",
                            Icon: LayoutDashboard,
                            href: "/projects",
                        },
                        {
                            name: "...",
                            Icon: VscProject,
                        },
                        {
                            name: "...",
                            Icon: AiOutlineExperiment,
                        },
                        {
                            name: "...",
                            Icon: GoIterations,
                        },
                    ]}
                />
            </div>
            <div className="flex flex-col items-center justify-center m-32">
                <GoIterations className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                    Loading iterations data ...
                </p>
                <p className="text-sm text-center">Please, be patient.</p>
                <Loading className="w-10 h-10 mt-8 animate-spin text-mlops-primary dark:text-mlops-primary-tx-dark" />
            </div>
        </>
    );
};

export default CompareIterationLoading;
