import { useSearchParams } from "react-router-dom";
import { useData } from "@/hooks/use-data-hook";
import { useDebounce } from "@/hooks/use-debounce-hook";
import React, { useEffect, useLayoutEffect, useState } from "react";

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
 * Import icons components
 */
import { VscFolderActive } from "react-icons/vsc";
import { Database } from "lucide-react";
import { DataArchive } from "@/components/icons";

/**
 * Import components
 */
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import Tabs from "@/components/tabs/tabs";
import TabItem from "@/components/tabs/tab-item";
import DatasetCard from "@/components/datasets/dataset-card";
import DatasetsPanel from "./datasets-panel/datasets-panel";
import DatasetNoActive from "@/components/datasets/dataset-messages/dataset-no-active";
import DatasetNoArchive from "@/components/datasets/dataset-messages/dataset-no-archive";
import DatasetNoResults from "@/components/datasets/dataset-messages/dataset-no-results";
import DatasetPanelSkeleton from "./datasets-panel/datasets-panel-skeleton";
import DatasetCardSkeleton from "@/components/datasets/dataset-card-skeleton";

/**
 * Define models data state interface
 */
interface DatasetsData {
    activeDatasets: React.ReactNode[];
    archivedDatasets: React.ReactNode[];
}

/**
 * Datasets page component
 */
const Datasets = () => {
    console.log("Datasets");
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
     * State for storing models data to display
     */
    const [datasets, setDatasets] = useState<DatasetsData | null>(null);

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
     * useEffect hook for preparing datasets data to display (with filtering, sorting)
     * @runs after component mount and every time when debounceSearch, data.datasets, isArchived or sortBy changes
     */

    const index = location.href.indexOf("#");
    const dataset_id = index === -1 ? null : location.href.substring(index + 1);

    useEffect(() => {
        console.log("useEffect");
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

            debounceSearch === ""
                ? setDatasets({
                      activeDatasets: activeDatasets
                          .sort((p1, p2) =>
                              sortDatasetComparator(p1, p2, sortBy)
                          )
                          .map((dataset) => (
                              <DatasetCard
                                  key={dataset._id}
                                  dataset={dataset}
                                  scrollTo={dataset_id === dataset._id}
                              />
                          )),
                      archivedDatasets: archivedDatasets
                          .sort((p1, p2) =>
                              sortDatasetComparator(p1, p2, sortBy)
                          )
                          .map((dataset) => (
                              <DatasetCard
                                  key={dataset._id}
                                  dataset={dataset}
                                  scrollTo={dataset_id === dataset._id}
                              />
                          )),
                  })
                : setDatasets({
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
                  });
        }
    }, [debounceSearch, data.datasets, sortBy]);

    /**
     * Function for rendering dataset dashboard content
     * @returns JSX.Element based on datasets data state
     */
    const datasetDashboardContent = () => {
        if (!data.datasets) {
            return (
                <>
                    <DatasetPanelSkeleton />

                    <Masonry
                        breakpointCols={breakpointsMasonryDatasets}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid-column"
                    >
                        {[...Array(10).keys()].map((_, id) => (
                            <DatasetCardSkeleton key={id} />
                        ))}
                    </Masonry>
                </>
            );
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

    console.log("Models", data.models);
    console.log("Projects", data.projects);
    console.log("Datasets", data.datasets);

    useLayoutEffect(() => {
        document.getElementById(dataset_id as string)?.scrollIntoView({
            block: "center",
            behavior: "smooth",
        } );
    });

    /**
     * Datasets page render
     */
    return (
        <>
            <div className="mb-4">
                <PageHeader title="Datasets" />
                <Breadcrumb
                    items={[
                        {
                            name: "Datasets",
                            Icon: Database,
                            href: "/datasets",
                        },
                    ]}
                />
            </div>
            <div className="text-base border-b-2 border-gray-200 dark:border-gray-700">
                <Tabs>
                    <TabItem
                        title="Active datasets"
                        Icon={VscFolderActive}
                        param="archived"
                        value="false"
                    />
                    <TabItem
                        title="Archive"
                        Icon={DataArchive}
                        param="archived"
                        value="true"
                    />
                </Tabs>
            </div>

            {datasetDashboardContent()}

            {/* {modelDashboardContent()} */}
        </>
    );
};

export default Datasets;
