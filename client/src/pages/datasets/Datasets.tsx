import { useSearchParams } from "react-router-dom";
import { useData } from "@/hooks/use-data-hook";
import { useDebounce } from "@/hooks/use-debounce-hook";
import { useLayoutEffect, useMemo, useState } from "react";

import Fuse from "fuse.js";
import Masonry from "react-masonry-css";

/**
 * Import utils functions
 */
import { sortDatasetComparator } from "@/lib/utils";

/**
 * Import config variables
 */
import { breakpointsMasonryDatasets } from "@/config/breakpoints";

/**
 * Import components
 */
import DatasetCard from "@/components/datasets/dataset-card";
import DatasetsPanel from "./datasets-panel/datasets-panel";
import DatasetNoActive from "@/components/datasets/dataset-messages/dataset-no-active";
import DatasetNoArchive from "@/components/datasets/dataset-messages/dataset-no-archive";
import DatasetNoResults from "@/components/datasets/dataset-messages/dataset-no-results";
import DatasetsLoading from "@/components/datasets/datasets-loading";
import DatasetsHeader from "@/components/datasets/datasets-header";

/**
 * Datasets page component
 */
const Datasets = () => {
    console.count("Datasets");
    /**
     * Custom data hook for data management
     */
    const data = useData();

    /**
     * Search params with default values
     */
    const [searchParams] = useSearchParams({
        archived: "false",
        search: "",
    });

    /**
     * Constant used for switching between active/idle and archived models
     */
    const isArchived = searchParams.get("archived") === "true";

    /**
     * State for storing search query
     */
    const [query, setQuery] = useState(searchParams.get("search") || "");

    /**
     * Custom debounceSearch hook for search query
     */
    const debounceSearch = useDebounce(query, 250);

    /**
     * State for storing information about sorting datasets method (default: UDESC - newest first by update date)
     */
    const [sortBy, setSortBy] = useState("UDESC");

    /**
     * Get dataset id from url to scroll to it (if exists)
     */
    const index = location.href.indexOf("#");
    const dataset_id = index === -1 ? null : location.href.substring(index + 1);

    /**
     * Prepare datasets data to display (with filtering, sorting).
     */
    const datasets = useMemo(() => {
        console.count("useMemo");
        if (data.datasets) {
            const archivedDatasets = data.datasets.filter((dataset) => {
                return dataset.archived;
            });

            const activeDatasets = data.datasets.filter((dataset) => {
                return !dataset.archived;
            });

            const fuseSearchArchived = new Fuse(archivedDatasets, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: [
                    "dataset_name",
                    "dataset_description",
                    "tags",
                    "version",
                    "path_to_dataset",
                ],
            });

            const fuseSearchActive = new Fuse(activeDatasets, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: [
                    "dataset_name",
                    "dataset_description",
                    "tags",
                    "version",
                    "path_to_dataset",
                ],
            });

            if (debounceSearch === "") {
                return {
                    activeDatasets: activeDatasets
                        .sort((p1, p2) => sortDatasetComparator(p1, p2, sortBy))
                        .map((dataset) => (
                            <DatasetCard
                                key={dataset._id}
                                dataset={dataset}
                                scrollTo={dataset_id === dataset._id}
                            />
                        )),
                    archivedDatasets: archivedDatasets
                        .sort((p1, p2) => sortDatasetComparator(p1, p2, sortBy))
                        .map((dataset) => (
                            <DatasetCard
                                key={dataset._id}
                                dataset={dataset}
                                scrollTo={dataset_id === dataset._id}
                            />
                        )),
                };
            }

            return {
                activeDatasets: fuseSearchActive
                    .search(debounceSearch)
                    .sort((p1, p2) =>
                        sortDatasetComparator(p1.item, p2.item, sortBy)
                    )
                    .map((result) => (
                        <DatasetCard
                            key={result.item._id}
                            dataset={result.item}
                            scrollTo={dataset_id === result.item._id}
                        />
                    )),
                archivedDatasets: fuseSearchArchived
                    .search(debounceSearch)
                    .sort((p1, p2) =>
                        sortDatasetComparator(p1.item, p2.item, sortBy)
                    )
                    .map((result) => (
                        <DatasetCard
                            key={result.item._id}
                            dataset={result.item}
                            scrollTo={dataset_id === result.item._id}
                        />
                    )),
            };
        }
        return null;
    }, [debounceSearch, data.datasets, sortBy]);

    /**
     * Function for rendering dataset dashboard content
     * @returns JSX.Element based on datasets data state
     */
    const datasetDashboardContent = () => {
        if (!data.datasets) {
            return <DatasetsLoading />;
        }

        const datasetsInDatabase = data.datasets.length;
        const archivedDatasets = data.datasets.reduce(
            (counter, item) => (item.archived ? (counter += 1) : counter),
            0
        );
        const activeDatasets = datasetsInDatabase - archivedDatasets;

        if (!isArchived && (datasetsInDatabase === 0 || activeDatasets === 0)) {
            return (
                <>
                    <DatasetsHeader />
                    <DatasetsPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                        disabled={true}
                    />
                    <DatasetNoActive />
                </>
            );
        }
        if (
            isArchived &&
            (datasetsInDatabase === 0 || archivedDatasets === 0)
        ) {
            return (
                <>
                    <DatasetsHeader />
                    <DatasetsPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                        disabled={true}
                    />
                    <DatasetNoArchive />
                </>
            );
        }

        if (
            (isArchived &&
                archivedDatasets > 0 &&
                datasets &&
                datasets.archivedDatasets.length === 0) ||
            (!isArchived &&
                activeDatasets > 0 &&
                datasets &&
                datasets.activeDatasets.length === 0)
        ) {
            return (
                <>
                    <DatasetsHeader />
                    <DatasetsPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                    />
                    <DatasetNoResults />
                </>
            );
        }

        return (
            <>
                <DatasetsHeader />
                <DatasetsPanel
                    query={query}
                    setQuery={setQuery}
                    setSortBy={setSortBy}
                />
                <Masonry
                    breakpointCols={breakpointsMasonryDatasets}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid-column"
                >
                    {!isArchived
                        ? datasets?.activeDatasets
                        : datasets?.archivedDatasets}
                </Masonry>
            </>
        );
    };

    useLayoutEffect(() => {
        document.getElementById(dataset_id as string)?.scrollIntoView({
            block: "center",
            behavior: "smooth",
        });
    });

    /**
     * Datasets page render
     */
    return <>{datasetDashboardContent()}</>;
};

export default Datasets;
