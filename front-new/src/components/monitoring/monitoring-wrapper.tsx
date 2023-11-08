import { useGrid } from "@/hooks/use-grid-hook";
import { useTreeselect } from "@/hooks/use-tree-select-hook";
import { useEffect, useMemo } from "react";

import {
    TreeSelectBaseColumnsChecked,
    TreeSelectBaseColumnsOptions,
} from "./treeselect-base-columns-definitions/treeselect-base-columns";
import { TreeSelectBaseNodesExpanded } from "./treeselect-base-columns-definitions/treeselect-base-nodes-expanded";

import { predictions } from "@/test-data/predictions_new";
import { PredictionInfo } from "./grid-base-columns-definitions/prediction-info-columns";
import { defaultColDef } from "./grid-base-columns-definitions/default-col-def";
import { Model } from "@/types/model";
import { useSearchParams } from "react-router-dom";
import ModelInfo from "./model/model-info";
import ModelDescription from "./model/model-description";
import MonitoringContainer from "./monitoring-container";
import Tabs from "../tabs/tabs";
import TabItem from "../tabs/tab-item";
import { Chart, Cycle } from "../icons";
import MonitoringCharts from "./monitoring-charts";

interface MonitoringWrapperProps {
    modelData: Model;
}

const MonitoringWrapper = ({ modelData }: MonitoringWrapperProps) => {
    const treeselect = useTreeselect();
    const grid = useGrid();

    const [searchParams, setSearchParams] = useSearchParams({
        charts: "false",
    });

    /**
     * Constant used for switching between model grid and model charts.
     */
    const charts = searchParams.get("charts") === "true";

    useEffect(() => {
        let rowData;

        // rowData = model.predictions_data;
        rowData = predictions;

        let TreeSelectBaseColumnsOptionsAll: any = JSON.parse(
            JSON.stringify(TreeSelectBaseColumnsOptions)
        );
        let TreeSelectBaseColumnsCheckedAll: any = JSON.parse(
            JSON.stringify(TreeSelectBaseColumnsChecked)
        );

        let baseFeatures: string[] = [];
        let featuresGridColumns: any[] = [];
        let treeselectColumns: any[] = [];
        let gridColumnsAll: any[] = [];

        if (rowData.length > 0) {
            const baseRow = rowData[0];

            baseFeatures = Object.getOwnPropertyNames(baseRow.input_data);

            if (baseFeatures.length > 0) {
                Object.assign(TreeSelectBaseColumnsCheckedAll, {
                    features: {
                        checked: true,
                        partialChecked: false,
                    },
                });

                baseFeatures.forEach((col) => {
                    const key = `input_data.${col}`;
                    featuresGridColumns.push({
                        field: key,
                        headerName: col,
                    });
                    treeselectColumns.push({
                        key: key,
                        label: col,
                    });
                    Object.assign(TreeSelectBaseColumnsCheckedAll, {
                        [key]: {
                            checked: true,
                            partialChecked: false,
                        },
                    });
                });

                TreeSelectBaseColumnsOptionsAll.push({
                    key: "features",
                    label: "Features",
                    leaf: true,
                    children: treeselectColumns,
                });

                gridColumnsAll = [
                    {
                        headerName: "Prediction Info",
                        children: PredictionInfo(),
                    },
                    {
                        headerName: "Model Features",
                        children: featuresGridColumns,
                    },
                ];
            }
        } else {
            gridColumnsAll = [
                {
                    headerName: "Prediction Info",
                    children: PredictionInfo(),
                },
            ];
        }

        treeselect.setAll(
            TreeSelectBaseColumnsOptionsAll,
            TreeSelectBaseColumnsCheckedAll,
            TreeSelectBaseNodesExpanded
        );

        grid.setAll(rowData, defaultColDef, gridColumnsAll, baseFeatures);
    }, []);

    const monitoringCharts = useMemo(() => {
        return <MonitoringCharts modelData={modelData} />;
    }, [modelData]);

    const monitoringWrapperContent = () => {
        if (!charts) {
            return (
                <>
                    <ModelInfo model={modelData} />
                    <ModelDescription
                        description={modelData.model_description}
                    />
                    <MonitoringContainer modelData={modelData} />
                </>
            );
        }
        return monitoringCharts;
    };

    return (
        <>
            <div className="mb-4 text-base border-b-2 border-gray-200 dark:border-gray-700">
                <Tabs>
                    <TabItem
                        title="Model predictions"
                        Icon={Cycle}
                        param="charts"
                        value="false"
                    />
                    <TabItem
                        title="Charts"
                        Icon={Chart}
                        param="charts"
                        value="true"
                    />
                </Tabs>
            </div>
            <div className="flex flex-col w-full">
                {monitoringWrapperContent()}
            </div>
        </>
    );
};

export default MonitoringWrapper;
