import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useGrid } from "@/hooks/use-grid-hook";
import { useTreeselect } from "@/hooks/use-tree-select-hook";
import { Model } from "@/types/model";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
} from "@/components/ui/select";
import { MdSort } from "react-icons/md";

import moment from "moment";
import { CellValueChangedEvent, IRowNode } from "ag-grid-community";
import { Button } from "../ui/button";
import {
    Chart,
    ClearFilter,
    ClearSorting,
    Download,
    Loading,
} from "@/components/icons";
import NoPredictionsHistory from "./no-predictions-history";
import { useModal } from "@/hooks/use-modal-hook";
import { useData } from "@/hooks/use-data-hook";
import axios from "axios";
import { backendConfig } from "@/config/backend";
import { createToast } from "@/lib/toast";

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

    const { onOpen } = useModal();

    const data = useData();

    const { model_id } = useParams();

    const [searchParams] = useSearchParams({
        ne: "default",
    });

    const { url, port } = backendConfig;

    const [dateFilterState, setDateFilterState] = useState<string>("ALLTIME");

    let dateFilter: string = "ALLTIME";

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
            .filter((col) => col !== "prediction");
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

    const updateActualValue = async (row: any) => {
        await axios
            .put(
                `${url}:${port}/monitored-models/${modelData._id}/predictions/${row.id}`,
                {
                    actual: row.actual !== '' ? row.actual : null,
                }
            )
            .then((res) => {

                data.updatePrediction(modelData._id, row.id, res.data);

                createToast({
                    id: "update-actual-prediction-value",
                    message: "Real value updated successfully!",
                    type: "success",
                });
            })
            .catch((error: any) => {
                createToast({
                    id: "update-actual-prediction-value",
                    message: error.response?.data.detail,
                    type: "error",
                });
            });
    };

    const onCellValueChanged = useCallback((params: CellValueChangedEvent) => {
        if (!gridRef.current) return;

        updateActualValue(params.data);

        gridRef.current!.api.applyTransaction({ update: [params.data] });
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
                            placeholder="Filter by date ..."
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
                    <Button
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={() => {
                            document.body.style.overflow = "hidden";
                            onOpen("createMonitoringChart", {
                                model: modelData,
                                baseFeatures: grid.baseFeatures,
                            });
                        }}
                        disabled={grid.rowData.length === 0 ? true : false}
                    >
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
                    noRowsOverlayComponent={NoPredictionsHistory}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                    onCellValueChanged={onCellValueChanged}
                />
            </div>
        </>
    );
};

export default MonitoringContainer;
