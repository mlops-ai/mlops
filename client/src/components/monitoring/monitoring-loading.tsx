import Breadcrumb from "../breadcrumb";
import { Loading, Model, Monitoring } from "../icons";
import PageHeader from "../page-header";

const MonitoringLoading = () => {
    return (
        <>
            <div className="mb-4">
                <PageHeader title="..." />
                <Breadcrumb
                    items={[
                        {
                            name: "Models",
                            Icon: Monitoring,
                            href: "/models",
                        },
                        {
                            name: "...",
                            Icon: Model,
                        },
                    ]}
                />
            </div>
            <div className="flex flex-col items-center justify-center m-32">
                <Model className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                    Loading model data ...
                </p>
                <p className="text-sm text-center">Please, be patient.</p>
                <Loading className="w-10 h-10 mt-8 animate-spin text-mlops-primary dark:text-mlops-primary-tx-dark" />
            </div>
        </>
    );
};

export default MonitoringLoading;
