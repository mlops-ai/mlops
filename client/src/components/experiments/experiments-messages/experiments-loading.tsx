import Breadcrumb from "@/components/breadcrumb";
import { Loading } from "@/components/icons";
import PageHeader from "@/components/page-header";
import { LayoutDashboard } from "lucide-react";
import { AiOutlineExperiment } from "react-icons/ai";
import { VscProject } from "react-icons/vsc";

const ExperimentsLoading = () => {
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
                    ]}
                />
            </div>
            <div className="flex flex-col items-center justify-center m-32">
                <AiOutlineExperiment className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                    Loading experiments and iterations data ...
                </p>
                <p className="text-sm text-center">Please, be patient.</p>
                <Loading className="w-10 h-10 mt-8 animate-spin text-mlops-primary dark:text-mlops-primary-tx-dark" />
            </div>
        </>
    );
};

export default ExperimentsLoading;
