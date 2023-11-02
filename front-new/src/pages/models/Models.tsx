import { useSearchParams } from "react-router-dom";
import { useData } from "@/hooks/use-data-hook";
import { useDebounce } from "@/hooks/use-debounce-hook";
import React, { useEffect, useState } from "react";

import Fuse from "fuse.js";
import Masonry from "react-masonry-css";

/**
 * Import utils functions
 */
import { sortModelComparator } from "@/lib/utils";

/**
 * Import config variables
 */
import { breakpointsMasonry } from "@/config/breakpoints";

/**
 * Import icons components
 */
import { VscFolderActive } from "react-icons/vsc";
import { DataArchive, Monitoring } from "@/components/icons";

/**
 * Import components
 */
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import Tabs from "@/components/tabs/tabs";
import TabItem from "@/components/tabs/tab-item";
import { ModelStatus } from "@/types/types";
import ModelCard from "@/components/models/model-card";
import ModelPanel from "./models-panel/models-panel";
import ModelPanelSkeleton from "./models-panel/models-panel-skeleton";
import ModelCardSkeleton from "@/components/models/model-card-skeleton";
import ModelNoActiveOrIdle from "@/components/models/model-messages/model-no-active-or-idle";
import ModelNoArchive from "@/components/models/model-messages/model-no-archive";
import ModelNoResults from "@/components/models/model-messages/model-no-results";

/**
 * Define models data state interface
 */
interface ModelsData {
    activeOrIdleModels: React.ReactNode[];
    archivedModels: React.ReactNode[];
}

/**
 * Models page component
 */
const Models = () => {
    console.log("Models");
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
    const [models, setModels] = useState<ModelsData | null>(null);

    /**
     * State for storing search query
     */
    const [query, setQuery] = useState(searchParams.get("search") || "");

    /**
     * Custom debounceSearch hook for search query
     */
    const debounceSearch = useDebounce(query, 250);

    /**
     * State for storing information about sorting models method (default: UDESC - newest first by update date)
     */
    const [sortBy, setSortBy] = useState("UDESC");

    /**
     * useEffect hook for preparing models data to display (with filtering, sorting)
     * @runs after component mount and every time when debounceSearch, data.models, isArchived or sortBy changes
     */
    useEffect(() => {
        console.log("useEffect");
        if (data.models) {
            const archivedModels = data.models.filter((model) => {
                return model.model_status === ModelStatus.ARCHIVED;
            });

            const activeOrIdleModels = data.models.filter((model) => {
                return model.model_status !== ModelStatus.ARCHIVED;
            });

            const fuseSearchArchived = new Fuse(archivedModels, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: ["model_name", "model_status", "model_description", "iteration.iteration_name"],
            });

            const fuseSearchActive = new Fuse(activeOrIdleModels, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: ["model_name", "model_status", "model_description", "iteration.iteration_name"],
            });

            debounceSearch === ""
                ? setModels({
                      activeOrIdleModels: activeOrIdleModels
                            .sort((p1, p2) =>
                                sortModelComparator(p1, p2, sortBy)
                            )
                          .map((model) => (
                              <ModelCard key={model._id} model={model} />
                          )),
                      archivedModels: archivedModels
                            .sort((p1, p2) =>
                                sortModelComparator(p1, p2, sortBy)
                            )
                          .map((model) => (
                              <ModelCard key={model._id} model={model} />
                          )),
                  })
                : setModels({
                      activeOrIdleModels: fuseSearchActive
                          .search(debounceSearch)
                            .sort((p1, p2) =>
                                sortModelComparator(p1.item, p2.item, sortBy)
                            )
                          .map((result) => (
                              <ModelCard
                                  key={result.item._id}
                                  model={result.item}
                              />
                          )),
                      archivedModels: fuseSearchArchived
                          .search(debounceSearch)
                            .sort((p1, p2) =>
                                sortModelComparator(p1.item, p2.item, sortBy)
                            )
                          .map((result) => (
                              <ModelCard
                                  key={result.item._id}
                                  model={result.item}
                              />
                          )),
                  });
        }
    }, [debounceSearch, data.models, sortBy]);

    /**
     * Function for rendering project dashboard content
     * @returns JSX.Element based on models data state
     */
    const modelDashboardContent = () => {
        if (!data.models) {
            return (
                <>
                    <ModelPanelSkeleton />

                    <Masonry
                        breakpointCols={breakpointsMasonry}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid-column"
                    >
                        {[...Array(10).keys()].map((_, id) => (
                            <ModelCardSkeleton key={id} />
                        ))}
                    </Masonry>
                </>
            );
        }

        const modelsInDatabase = data.models.length;
        const archivedModels = data.models.reduce(
            (counter, item) =>
                item.model_status === ModelStatus.ARCHIVED
                    ? (counter += 1)
                    : counter,
            0
        );
        const activeOrIdleModels = modelsInDatabase - archivedModels;

        if (
            !isArchived &&
            (modelsInDatabase === 0 || activeOrIdleModels === 0)
        ) {
            return (
                <>
                    <ModelPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                        disabled={true}
                    />
                    <ModelNoActiveOrIdle />
                </>
            );
        }
        if (isArchived && (modelsInDatabase === 0 || archivedModels === 0)) {
            return (
                <>
                    <ModelPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                        disabled={true}
                    />
                    <ModelNoArchive />
                </>
            );
        }

        if (
            (isArchived &&
                archivedModels > 0 &&
                models &&
                models.archivedModels.length === 0) ||
            (!isArchived &&
                activeOrIdleModels > 0 &&
                models &&
                models.activeOrIdleModels.length === 0)
        ) {
            return (
                <>
                    <ModelPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                    />
                    <ModelNoResults />
                </>
            );
        }

        return (
            <>
                <ModelPanel
                    query={query}
                    setQuery={setQuery}
                    setSortBy={setSortBy}
                />
                <Masonry
                    breakpointCols={breakpointsMasonry}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid-column"
                >
                    {!isArchived
                        ? models?.activeOrIdleModels
                        : models?.archivedModels}
                </Masonry>
            </>
        );
    };

    console.log("Models", data.models);
    console.log("Projects", data.projects);

    /**
     * Models page render
     */
    return (
        <>
            <div className="mb-4">
                <PageHeader title="Models" />
                <Breadcrumb
                    items={[
                        {
                            name: "Models",
                            Icon: Monitoring,
                            href: "/models",
                        },
                    ]}
                />
            </div>
            <div className="text-base border-b-2 border-gray-200 dark:border-gray-700">
                <Tabs>
                    <TabItem
                        title="Active/Idle models"
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

            {modelDashboardContent()}
        </>
    );
};

export default Models;
