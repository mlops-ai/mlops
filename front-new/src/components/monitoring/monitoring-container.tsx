import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useGrid } from "@/hooks/use-grid-hook";
import { useTreeselect } from "@/hooks/use-tree-select-hook";
import { Model } from "@/types/model";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { predictions } from "@/test-data/predictions";
import { defaultColDef } from "./model/grid-base-columns-definitions/default-col-def";
import { CheckboxSection } from "./model/grid-base-columns-definitions/checkbox-column";
import { PredictionInfo } from "./model/grid-base-columns-definitions/prediction-info-columns";
import { useTheme } from "../providers/theme-provider";
import { TreeSelect } from "primereact/treeselect";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { MdSort } from "react-icons/md";

import {
    TreeSelectBaseColumnsChecked,
    TreeSelectBaseColumnsOptions,
} from "./model/treeselect-base-columns-definitions/treeselect-base-columns";
import { TreeSelectBaseNodesExpanded } from "./model/treeselect-base-columns-definitions/treeselect-base-nodes-expanded";
import moment from "moment";
import { IRowNode, ModelUpdatedEvent } from "ag-grid-community";
import { Button } from "../ui/button";
import {
    Chart,
    ClearFilter,
    ClearSorting,
    Delete,
    Download,
    Loading,
} from "@/components/icons";
import NoPredictionsHistory from "./no-predictions-history";

interface MonitoringContainerProps {
    modelData: Model;
}

const MonitoringContainer = ({ modelData }: MonitoringContainerProps) => {
    const treeselect = useTreeselect();
    const grid = useGrid();
    const { theme } = useTheme();

    const gridRef = useRef<AgGridReact>(null);
    const textFilterRef = useRef<HTMLInputElement>(null);
    const filterDateRef = useRef<HTMLSpanElement>(null);

    const { model_id } = useParams();

    const [searchParams] = useSearchParams({
        ne: "default",
    });

    const [dateFilterState, setDateFilterState] = useState<string>("ALLTIME");

    let dateFilter: string = "ALLTIME";

    useEffect(() => {
        let rowData;

        // rowData = modelData.predictions_data;
        rowData = predictions;

        const exampleRow = rowData[0];

        const defaultColumns = [
            "prediction_id",
            "prediction_date",
            "predicted_value",
            "predicted_by",
        ];

        const columns = Object.getOwnPropertyNames(exampleRow).filter(
            (col) => !defaultColumns.includes(col)
        );

        let TreeSelectBaseColumnsOptionsAll: any = JSON.parse(
            JSON.stringify(TreeSelectBaseColumnsOptions)
        );
        let TreeSelectBaseColumnsCheckedAll: any = JSON.parse(
            JSON.stringify(TreeSelectBaseColumnsChecked)
        );

        let featuresColumns: any[] = [];
        let treeselectColumns: any[] = [];

        if (columns.length > 0) {
            Object.assign(TreeSelectBaseColumnsCheckedAll, {
                features: {
                    checked: true,
                    partialChecked: false,
                },
            });

            columns.forEach((col) => {
                featuresColumns.push({
                    field: col,
                    headerName: col,
                });
                treeselectColumns.push({
                    key: col,
                    label: col,
                });
                Object.assign(TreeSelectBaseColumnsCheckedAll, {
                    [col]: {
                        checked: true,
                        partialChecked: false,
                    },
                });
            });
        }

        TreeSelectBaseColumnsOptionsAll.push({
            key: "features",
            label: "Features",
            leaf: true,
            children: treeselectColumns,
        });

        let gridColumnsAll = [
            CheckboxSection,
            {
                headerName: "Prediction Info",
                children: PredictionInfo(),
            },
            {
                headerName: "Model Features",
                children: featuresColumns,
            },
        ];

        treeselect.setAll(
            TreeSelectBaseColumnsOptionsAll,
            TreeSelectBaseColumnsCheckedAll,
            TreeSelectBaseNodesExpanded
        );

        grid.setAll(rowData, defaultColDef, gridColumnsAll);
    }, []);

    const externalFilterChanged = useCallback((newValue: string) => {
        dateFilter = newValue;
        gridRef.current!.api.onFilterChanged();
    }, []);

    const isExternalFilterPresent = useCallback((): boolean => {
        return dateFilter !== "ALLTIME";
    }, []);

    const doesExternalFilterPass = useCallback(
        (node: IRowNode) => {
            if (node.data) {
                switch (dateFilter) {
                    case "LAST1H":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(1, "hours")
                        );
                    case "LAST3H":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(3, "hours")
                        );
                    case "LAST6H":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(6, "hours")
                        );
                    case "LAST12H":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(12, "hours")
                        );
                    case "LAST24H":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(24, "hours")
                        );
                    case "LAST7D":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(7, "days")
                        );
                    case "LAST14D":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(14, "days")
                        );
                    case "LAST30D":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(30, "days")
                        );
                    case "LAST90D":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(90, "days")
                        );
                    case "LAST180D":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(180, "days")
                        );
                    case "LASTY":
                        return moment(node.data.prediction_date).isAfter(
                            moment().subtract(1, "years")
                        );
                    default:
                        return true;
                }
            }
            return true;
        },
        [dateFilter]
    );

    const onFilterTextBoxChanged = useCallback((value: string) => {
        if (!gridRef.current) return;
        gridRef.current.api.setQuickFilter(value);
    }, []);

    const updateColumnVisibility = useCallback((data: any) => {
        if (!gridRef.current) return;

        let columns_active = Object.getOwnPropertyNames(data);
        let grid_cols = gridRef.current.columnApi
            .getColumns()
            ?.map((col) => col.getColId())
            .filter(
                (col) => col !== "prediction_id" && col !== "predicted_value"
            );
        for (let col of grid_cols!) {
            if (columns_active.includes(col)) {
                gridRef.current.columnApi.setColumnVisible(col, true);
            } else {
                gridRef.current.columnApi.setColumnVisible(col, false);
            }
        }
    }, []);

    const clearFilters = useCallback(() => {
        if (!gridRef.current) return;
        if (!textFilterRef.current) return;
        if (!filterDateRef.current) return;

        gridRef.current.api.setFilterModel(null);

        textFilterRef.current.value = "";

        gridRef.current.api.setQuickFilter("");

        dateFilter = "allTime";

        gridRef.current.api.onFilterChanged();

        setDateFilterState("ALLTIME");
    }, []);

    const clearSorting = useCallback(() => {
        if (!gridRef.current) return;

        gridRef.current.columnApi.applyColumnState({
            defaultState: { sort: null },
        });
    }, []);

    const exportToCSV = useCallback(() => {
        if (!gridRef.current) return;

        gridRef.current.api.exportDataAsCsv({
            skipColumnGroupHeaders: true,
            processCellCallback: ({ column, value }) => {
                if (column.getId() === "created_at") {
                    return moment(new Date(value)).format(
                        "DD-MM-YYYY, HH:mm:ss"
                    );
                }
                return value;
            },
        });
    }, []);

    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                <Select
                    defaultValue="ALLTIME"
                    onValueChange={(value) => {
                        externalFilterChanged(value);
                        setDateFilterState(value);
                    }}
                    value={dateFilterState}
                >
                    <SelectTrigger
                        className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx h-9 w-[220px] pl-2"
                        Icon={
                            <MdSort className="flex-shrink-0 w-5 h-5 mr-2 top-2 left-2 dark:text-mlops-primary-tx-dark text-mlops-primary-tx" />
                        }
                    >
                        <SelectValue
                            placeholder="Sort projects"
                            ref={filterDateRef}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key="ALLTIME" value="ALLTIME">
                            All time
                        </SelectItem>
                        <SelectItem key="LAST1H" value="LAST1H">
                            Last hour
                        </SelectItem>
                        <SelectItem key="LAST3H" value="LAST3H">
                            Last 3 hours
                        </SelectItem>
                        <SelectItem key="LAST6H" value="LAST6H">
                            Last 6 hours
                        </SelectItem>
                        <SelectItem key="LAST12H" value="LAST12H">
                            Last 12 hours
                        </SelectItem>
                        <SelectItem key="LAST24H" value="LAST24H">
                            Last 24 hours
                        </SelectItem>
                        <SelectItem key="LAST7D" value="LAST7D">
                            Last 7 days
                        </SelectItem>
                        <SelectItem key="LAST30D" value="LAST30D">
                            Last 30 days
                        </SelectItem>
                        <SelectItem key="LAST90D" value="LAST90D">
                            Last 90 days
                        </SelectItem>
                        <SelectItem key="LAST180D" value="LAST180D">
                            Last 180 days
                        </SelectItem>
                        <SelectItem key="LASTY" value="LASTY">
                            Last year
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    className="transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx w-[320px] h-9"
                    ref={textFilterRef}
                    placeholder="Filter rows by text data columns ..."
                    Icon={
                        <Search className="absolute flex-shrink-0 w-5 h-5 top-2 left-2 dark:text-mlops-primary-tx-dark text-mlops-primary-tx" />
                    }
                    id="filter-text-box"
                    onChange={(e) => onFilterTextBoxChanged(e.target.value)}
                    // disabled={disabled}
                />

                <TreeSelect
                    value={treeselect.selectedOptions}
                    options={treeselect.options}
                    placeholder="Select columns to display ..."
                    selectionMode="checkbox"
                    expandedKeys={treeselect.expandedKeys}
                    resetFilterOnHide={true}
                    onChange={(e) => {
                        // @ts-ignore
                        treeselect.setSelectedOptions(e.value);
                        updateColumnVisibility(e.value);
                    }}
                    onToggle={(e) => {
                        console.log(e.value);
                        treeselect.setExpandedKeys(e.value);
                    }}
                    scrollHeight="300px"
                    filter
                    dropdownIcon={
                        <ChevronDown className="w-4 h-4 mr-2 opacity-50" />
                    }
                ></TreeSelect>
            </div>

            <div className="my-4 text-base border-b-2 border-gray-200 dark:border-gray-700"></div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="mlopsGridAction" size="grid">
                        <Delete className="flex-shrink-0 w-6 h-6 mr-1" /> Delete
                    </Button>

                    <Button variant="mlopsGridAction" size="grid">
                        <Chart className="flex-shrink-0 w-6 h-6 mr-1" /> Create
                        chart
                    </Button>

                    <Button
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={clearFilters}
                    >
                        <ClearFilter className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Clear filters
                    </Button>

                    <Button
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={clearSorting}
                    >
                        <ClearSorting className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Clear sorting
                    </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={exportToCSV}
                    >
                        <Download className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Export to CSV
                    </Button>

                    <Button
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={() => window.location.reload()}
                    >
                        <Loading className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Refresh
                    </Button>
                </div>
            </div>

            <div
                className={
                    theme === "dark"
                        ? "ag-theme-alpine-dark"
                        : "ag-theme-alpine"
                }
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={grid.rowData}
                    rowSelection="multiple"
                    columnDefs={grid.columnDefs}
                    defaultColDef={grid.defaultColDef}
                    pagination={true}
                    paginationPageSize={20}
                    rowHeight={25}
                    domLayout={"autoHeight"}
                    // onSelectionChanged={onSelectionChanged}
                    noRowsOverlayComponent={NoPredictionsHistory}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                />
            </div>
        </>
    );
};

export default MonitoringContainer;
