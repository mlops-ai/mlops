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
import MonitoringLoading from "@/components/monitoring/monitoring-loading";

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
        return <MonitoringLoading />;
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
