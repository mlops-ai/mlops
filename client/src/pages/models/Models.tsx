import { useSearchParams } from "react-router-dom";
import { useData } from "@/hooks/use-data-hook";
import { useDebounce } from "@/hooks/use-debounce-hook";
import { useMemo, useState } from "react";

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
 * Import components
 */
import { ModelStatus } from "@/types/types";
import ModelCard from "@/components/models/model-card";
import ModelPanel from "./models-panel/models-panel";
import ModelNoActiveOrIdle from "@/components/models/model-messages/model-no-active-or-idle";
import ModelNoArchive from "@/components/models/model-messages/model-no-archive";
import ModelNoResults from "@/components/models/model-messages/model-no-results";
import ModelsLoading from "@/components/models/models-loading";
import ModelsHeader from "@/components/models/models-header";

/**
 * Models page component
 */
const Models = () => {
    console.count("Models");
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
     * State for storing information about sorting models method (default: UDESC - newest first by update date)
     */
    const [sortBy, setSortBy] = useState("UDESC");

    /**
     * Preparing monitored models data to display (with filtering, sorting).
     */
    const models = useMemo(() => {
        console.count("useMemo");
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
                keys: [
                    "model_name",
                    "model_status",
                    "model_description",
                    "iteration.iteration_name",
                ],
            });

            const fuseSearchActive = new Fuse(activeOrIdleModels, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: [
                    "model_name",
                    "model_status",
                    "model_description",
                    "iteration.iteration_name",
                ],
            });

            if (debounceSearch === "") {
                return {
                    activeOrIdleModels: activeOrIdleModels
                        .sort((p1, p2) => sortModelComparator(p1, p2, sortBy))
                        .map((model) => (
                            <ModelCard key={model._id} model={model} />
                        )),
                    archivedModels: archivedModels
                        .sort((p1, p2) => sortModelComparator(p1, p2, sortBy))
                        .map((model) => (
                            <ModelCard key={model._id} model={model} />
                        )),
                };
            }

            return {
                activeOrIdleModels: fuseSearchActive
                    .search(debounceSearch)
                    .sort((p1, p2) =>
                        sortModelComparator(p1.item, p2.item, sortBy)
                    )
                    .map((result) => (
                        <ModelCard key={result.item._id} model={result.item} />
                    )),
                archivedModels: fuseSearchArchived
                    .search(debounceSearch)
                    .sort((p1, p2) =>
                        sortModelComparator(p1.item, p2.item, sortBy)
                    )
                    .map((result) => (
                        <ModelCard key={result.item._id} model={result.item} />
                    )),
            };
        }
        return null;
    }, [debounceSearch, data.models, sortBy]);

    /**
     * Function for rendering monitored models dashboard content
     * @returns JSX.Element based on models data state
     */
    const modelDashboardContent = () => {
        if (!data.models) {
            return (
                <>
                    <ModelsLoading />
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
                    <ModelsHeader />
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
                    <ModelsHeader />
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
                    <ModelsHeader />
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
                <ModelsHeader />
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

    /**
     * Monitored models page content.
     */
    return <>{modelDashboardContent()}</>;
};

export default Models;
