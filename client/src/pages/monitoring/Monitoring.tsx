import Breadcrumb from "@/components/breadcrumb";
import { Loading } from "@/components/icons";
import {
    Model as ModelIcon,
    Monitoring as MonitoringIcon,
} from "@/components/icons";
import ModelDropdownActions from "@/components/models/model-dropdown-actions";
import ModelIsEmpty from "@/components/monitoring/model/model-messages/model-is-empty";
import PageHeader from "@/components/page-header";
import { useData } from "@/hooks/use-data-hook";
import { Model } from "@/types/model";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MonitoringWrapper from "@/components/monitoring/monitoring-wrapper";
import ModelNoPredictions from "@/components/monitoring/model/model-messages/model-no-predictions";

const Monitoring = () => {
    const navigate = useNavigate();

    const { model_id } = useParams();

    const [isLoading, setIsLoading] = useState(false);

    const [searchParams] = useSearchParams();

    const data = useData();

    const [modelData, setModelData] = useState<null | Model>(null);

    useEffect(() => {
        if (data.models) {
            const foundModel = data.models.find(
                (model) => model._id === model_id
            );

            if (!foundModel) {
                return navigate(
                    `/models${
                        searchParams.get("ne") !== "default"
                            ? `?ne=${searchParams.get("ne")}`
                            : ""
                    }`
                );
            } else {
                setModelData(foundModel);
            }
        }
    }, [data.models, model_id]);

    if (modelData === null) {
        return (
            <>
                <div className="mb-4">
                    <PageHeader title="..." />
                    <Breadcrumb
                        items={[
                            {
                                name: "Models",
                                Icon: MonitoringIcon,
                                href: "/models",
                            },
                            {
                                name: "...",
                                Icon: ModelIcon,
                            },
                        ]}
                    />
                </div>
                <div className="flex flex-col items-center justify-center m-32">
                    <ModelIcon className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
                    <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                        Loading model data ...
                    </p>
                    <p className="text-sm text-center">Please, be patient.</p>
                    <Loading className="w-10 h-10 mt-8 animate-spin text-mlops-primary dark:text-mlops-primary-tx-dark" />
                </div>
            </>
        );
    }

    const monitoringContent = () => {
        if (modelData && modelData.iteration) {
            if (
                modelData.predictions_data &&
                modelData.predictions_data.length > 0
            ) {
                return <MonitoringWrapper modelData={modelData} />;
            }
            return <ModelNoPredictions />;
        }
        return <ModelIsEmpty />;
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute top-[50%] left-[50%] w-full h-full z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 text-center backdrop-blur-[2px] rounded-md">
                    <div className="flex items-center px-2 py-1 font-semibold text-white rounded bg-mlops-primary">
                        <Loading className="animate-spin" />
                        Updating ...
                    </div>
                </div>
            )}

            <div className="mb-4">
                <PageHeader
                    title={modelData.model_name}
                    modelBadge={modelData.model_status}
                    pin={modelData.pinned}
                    actionButton={
                        <ModelDropdownActions
                            model={modelData}
                            setLoading={setIsLoading}
                        />
                    }
                />
                <Breadcrumb
                    items={[
                        {
                            name: "Models",
                            Icon: MonitoringIcon,
                            href: "/projects",
                        },
                        {
                            name: modelData.model_name,
                            Icon: ModelIcon,
                        },
                    ]}
                />
            </div>

            <div className="flex flex-col">{monitoringContent()}</div>
        </div>
    );
};

export default Monitoring;
