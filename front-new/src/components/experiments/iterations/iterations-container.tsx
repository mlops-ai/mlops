import { Experiment } from "@/types/experiment";
import { Project } from "@/types/project";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useTreeselect } from "@/hooks/use-tree-select-hook";
import {
    TreeSelectBaseColumnsChecked,
    TreeSelectBaseColumnsOptions,
} from "./treeselect-base-columns-definitions/treeselect-base-columns";
import { TreeSelectBaseNodesExpanded } from "./treeselect-base-columns-definitions/treeselect-base-nodes-expanded";
import { defaultColDef } from "./grid-base-columns-definitions/default-col-def";
import { extractColumnsData } from "@/lib/utils";
import { CheckboxSection } from "./grid-base-columns-definitions/checkbox-column";
import { DatasetInfo } from "./grid-base-columns-definitions/dataset-info-columns";
import { ModelInfo } from "./grid-base-columns-definitions/model-info-columns";
import { IterationInfo } from "./grid-base-columns-definitions/iteration-info-columns";
import { useGrid } from "@/hooks/use-grid-hook";
import { Button } from "@/components/ui/button";
import { Delete, Edit, Loading, Monitoring } from "@/components/icons";
import Download from "@/components/icons/download";
import ClearSorting from "@/components/icons/clear-sorting";
import ClearFilter from "@/components/icons/clear-filter";
import Compare from "@/components/icons/compare";
import { ChevronDown, Search } from "lucide-react";
import { TreeSelect } from "primereact/treeselect";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MdSort } from "react-icons/md";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "@/components/providers/theme-provider";
import { IRowNode } from "ag-grid-community";
import moment from "moment";
import { useModal } from "@/hooks/use-modal-hook";
import { Iteration } from "@/types/iteration";
import NoIterationsInfo from "./no-iterations-info";
import { useNavigate } from "react-router-dom";

interface IterationsContainerProps {
    projectData: Project;
    activeExperiments: Experiment[];
}

const IterationsContainer = ({
    projectData,
    activeExperiments,
}: IterationsContainerProps) => {
    const treeselect = useTreeselect();
    const grid = useGrid();

    const { onOpen } = useModal();

    const gridRef = useRef<AgGridReact>(null);
    const textFilterRef = useRef<HTMLInputElement>(null);
    const filterDateRef = useRef<HTMLSpanElement>(null);

    const { theme } = useTheme();

    const [dateFilterState, setDateFilterState] = useState<string>("ALLTIME");

    let dateFilter: string = "ALLTIME";

    useEffect(() => {
        let rowData;
        rowData = activeExperiments.map((experiment) => {
            return {
                ...experiment,
                iterations: experiment.iterations.map((iteration) => {
                    return {
                        ...iteration,
                        experiment_name: experiment.name,
                        experiment_id: experiment.id,
                    };
                }),
            };
        });
        rowData = rowData.map((experiment) => experiment.iterations);
        rowData = rowData.flat();

        let TreeSelectBaseColumnsOptionsAll: any = JSON.parse(
            JSON.stringify(TreeSelectBaseColumnsOptions)
        );
        let TreeSelectBaseColumnsCheckedAll: any = JSON.parse(
            JSON.stringify(TreeSelectBaseColumnsChecked)
        );

        let [
            gridColumnsParameters,
            TreeSelectBaseColumnsOptionsWithParams,
            TreeSelectBaseColumnsCheckedWithParams,
        ] = extractColumnsData(
            rowData,
            "parameters",
            TreeSelectBaseColumnsOptionsAll,
            TreeSelectBaseColumnsCheckedAll
        );

        let [
            gridColumnsMetrics,
            TreeSelectBaseColumnsOptionsWithParamsAndMetrics,
            TreeSelectBaseColumnsCheckedWithParamsAndMetrics,
        ] = extractColumnsData(
            rowData,
            "metrics",
            TreeSelectBaseColumnsOptionsWithParams,
            TreeSelectBaseColumnsCheckedWithParams
        );

        treeselect.setAll(
            TreeSelectBaseColumnsOptionsWithParamsAndMetrics,
            TreeSelectBaseColumnsCheckedWithParamsAndMetrics,
            TreeSelectBaseNodesExpanded
        );

        let gridColumnsAll = [
            CheckboxSection,
            {
                headerName: "Iteration Info",
                children: IterationInfo(projectData._id),
            },
            {
                headerName: "Model Info",
                children: ModelInfo,
            },
            {
                headerName: "Dataset Info",
                children: DatasetInfo,
            },
            {
                headerName: "Parameters",
                children: gridColumnsParameters,
            },
            {
                headerName: "Metrics",
                children: gridColumnsMetrics,
            },
        ];

        grid.setAll(rowData, defaultColDef, gridColumnsAll);
    }, [projectData, activeExperiments, location.search]);

    const deleteButton = useRef() as MutableRefObject<HTMLButtonElement>;
    const editButton = useRef() as MutableRefObject<HTMLButtonElement>;
    const compareButton = useRef() as MutableRefObject<HTMLButtonElement>;
    const createModelButton = useRef() as MutableRefObject<HTMLButtonElement>;

    useEffect(() => {
        deleteButton.current.disabled = true;
        editButton.current.disabled = true;
        createModelButton.current.disabled = true;
        compareButton.current.disabled = true;
    }, [projectData, activeExperiments]);

    const onSelectionChanged = useCallback(() => {
        if (!gridRef.current) return;

        let selectedRows = gridRef.current.api.getSelectedRows();

        if (selectedRows.length > 0) {
            if (selectedRows.length === 1) {
                editButton.current.disabled = false;
                createModelButton.current.disabled = false;
                compareButton.current.disabled = true;
            } else {
                editButton.current.disabled = true;
                createModelButton.current.disabled = true;
                compareButton.current.disabled = false;
            }
            deleteButton.current.disabled = false;
        } else {
            deleteButton.current.disabled = true;
            editButton.current.disabled = true;
            createModelButton.current.disabled = true;
            compareButton.current.disabled = true;
        }
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
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(1, "hours")
                        );
                    case "LAST3H":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(3, "hours")
                        );
                    case "LAST6H":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(6, "hours")
                        );
                    case "LAST12H":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(12, "hours")
                        );
                    case "LAST24H":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(24, "hours")
                        );
                    case "LAST7D":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(7, "days")
                        );
                    case "LAST14D":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(14, "days")
                        );
                    case "LAST30D":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(30, "days")
                        );
                    case "LAST90D":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(90, "days")
                        );
                    case "LAST180D":
                        return moment(node.data.created_at).isAfter(
                            moment().subtract(180, "days")
                        );
                    case "LASTY":
                        return moment(node.data.created_at).isAfter(
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
            .filter((col) => col !== "id" && col !== "iteration_name");
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

    const handleEditIteration = useCallback(() => {
        if (!gridRef.current) return;

        let selectedRows = gridRef.current.api.getSelectedRows();

        if (selectedRows.length === 1) {
            onOpen("editIteration", {
                iteration: selectedRows[0] as Iteration,
            });
        }
    }, []);

    const handleDeleteIterations = useCallback(() => {
        if (!gridRef.current) return;

        let selectedRows = gridRef.current.api.getSelectedRows() as Iteration[];

        if (selectedRows.length > 0) {
            let numberOfIterations = selectedRows.length;
            let iterationsData = selectedRows.map((iteration) => {
                return {
                    experiment_id: iteration.experiment_id,
                    iteration_id: iteration.id,
                };
            });

            let iterationsDataGrouped = iterationsData.reduce(
                (group: any, iteration: any) => {
                    group[iteration.experiment_id] =
                        group[iteration.experiment_id] ?? [];
                    group[iteration.experiment_id].push(iteration.iteration_id);
                    return group;
                },
                {}
            );

            onOpen("deleteIterations", {
                deleteIterations: {
                    project_id: projectData._id,
                    numberOfIterations: numberOfIterations,
                    iterationsToDelete: iterationsDataGrouped,
                },
            });

            console.log(iterationsDataGrouped);
        }
    }, []);

    const handleCreateModel = useCallback(() => {
        if (!gridRef.current) return;

        let selectedRows = gridRef.current.api.getSelectedRows() as Iteration[];

        if (selectedRows.length === 1) {
            document.body.style.overflow = "hidden";
            onOpen("createModelFromIteration", { iteration: selectedRows[0] });
        }
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const onKeyDownEL = (event: KeyboardEvent) => {
            if (event.key === "]") {
                event.preventDefault();

                if (event.repeat) {
                    return;
                }

                let newUrlParams = new URLSearchParams(location.search);

                newUrlParams.set(
                    "el",
                    newUrlParams.get("el") &&
                        newUrlParams.get("el") === "false"
                        ? "true"
                        : "false"
                );

                navigate(
                    {
                        pathname: location.pathname,
                        search: newUrlParams.toString(),
                    },
                    { replace: true }
                );
            }
        };

        document.addEventListener("keydown", onKeyDownEL);

        return () => {
            document.removeEventListener("keydown", onKeyDownEL);
        };
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
                    <Button
                        ref={deleteButton}
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={handleDeleteIterations}
                    >
                        <Delete className="flex-shrink-0 w-6 h-6 mr-1" /> Delete
                    </Button>

                    <Button
                        ref={editButton}
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={handleEditIteration}
                    >
                        <Edit className="flex-shrink-0 w-6 h-6 mr-1" /> Rename
                    </Button>

                    <Button
                        ref={createModelButton}
                        variant="mlopsGridAction"
                        size="grid"
                        onClick={handleCreateModel}
                    >
                        <Monitoring className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Create model
                    </Button>

                    <Button
                        ref={compareButton}
                        variant="mlopsGridAction"
                        size="grid"
                    >
                        <Compare className="flex-shrink-0 w-6 h-6 mr-1" />{" "}
                        Compare
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
                    onSelectionChanged={onSelectionChanged}
                    noRowsOverlayComponent={NoIterationsInfo}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                />
            </div>
        </>
    );
};

export default IterationsContainer;
