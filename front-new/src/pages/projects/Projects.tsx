import { useSearchParams } from "react-router-dom";
import { useData } from "@/hooks/use-data-hook";
import { useDebounce } from "@/hooks/use-debounce-hook";
import React, { useEffect, useState } from "react";

import Fuse from "fuse.js";
import Masonry from "react-masonry-css";

/**
 * Import utils functions
 */
import { sortProjectComparator } from "@/lib/utils";

/**
 * Import config variables
 */
import { breakpointsMasonry } from "@/config/breakpoints";

/**
 * Import icons components
 */
import { LayoutDashboard } from "lucide-react";
import { VscFolderActive } from "react-icons/vsc";
import { DataArchive } from "@/components/icons";

/**
 * Import components
 */
import ProjectCard from "@/components/projects/project-card";
import ProjectNoActive from "@/components/projects/project-messages/project-no-active";
import ProjectNoResults from "@/components/projects/project-messages/project-no-results";
import ProjectCardSkeleton from "@/components/projects/project-card-skeleton";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import Tabs from "@/components/tabs/tabs";
import TabItem from "@/components/tabs/tab-item";
import ProjectNoArchive from "@/components/projects/project-messages/project-no-archive";
import ProjectPanel from "./projects-panel/projects-panel";
import ProjectPanelSkeleton from "./projects-panel/projects-panel-skeleton";

/**
 * Define projects data state interface
 */
interface ProjectsData {
    activeProjects: React.ReactNode[];
    archivedProjects: React.ReactNode[];
}

/**
 * Projects page component
 */
const Projects = () => {
    console.log("Projects");
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
     * Constant used for switching between active and archived projects
     */
    const isArchived = searchParams.get("archived") === "true";

    /**
     * State for storing projects data to display
     */
    const [projects, setProjects] = useState<ProjectsData | null>(null);

    /**
     * State for storing search query
     */
    const [query, setQuery] = useState(searchParams.get("search") || "");

    /**
     * Custom debounceSearch hook for search query
     */
    const debounceSearch = useDebounce(query, 250);

    /**
     * State for storing information about sorting projects method (default: UDESC - newest first by update date)
     */
    const [sortBy, setSortBy] = useState("UDESC");

    /**
     * useEffect hook for preparing projects data to display (with filtering, sorting)
     * @runs after component mount and every time when debounceSearch, data.projects, isArchived or sortBy changes
     */
    useEffect(() => {
        console.log("useEffect");
        if (data.projects) {
            const archivedProjects = data.projects.filter((project) => {
                return project.archived;
            });

            const activeProjects = data.projects.filter((project) => {
                return !project.archived;
            });

            const fuseSearchArchived = new Fuse(archivedProjects, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: ["title", "status", "description"],
            });

            const fuseSearchActive = new Fuse(activeProjects, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: ["title", "status", "description"],
            });

            debounceSearch === ""
                ? setProjects({
                      activeProjects: activeProjects
                          .sort((p1, p2) =>
                              sortProjectComparator(p1, p2, sortBy)
                          )
                          .map((project) => (
                              <ProjectCard
                                  key={project._id}
                                  project={project}
                              />
                          )),
                      archivedProjects: archivedProjects
                          .sort((p1, p2) =>
                              sortProjectComparator(p1, p2, sortBy)
                          )
                          .map((project) => (
                              <ProjectCard
                                  key={project._id}
                                  project={project}
                              />
                          )),
                  })
                : setProjects({
                      activeProjects: fuseSearchActive
                          .search(debounceSearch)
                          .sort((p1, p2) =>
                              sortProjectComparator(p1.item, p2.item, sortBy)
                          )
                          .map((result) => (
                              <ProjectCard
                                  key={result.item._id}
                                  project={result.item}
                              />
                          )),
                      archivedProjects: fuseSearchArchived
                          .search(debounceSearch)
                          .sort((p1, p2) =>
                              sortProjectComparator(p1.item, p2.item, sortBy)
                          )
                          .map((result) => (
                              <ProjectCard
                                  key={result.item._id}
                                  project={result.item}
                              />
                          )),
                  });
        }
    }, [debounceSearch, data.projects, sortBy]);

    /**
     * Function for rendering project dashboard content
     * @returns JSX.Element based on projects data state
     */
    const projectDashboardContent = () => {
        if (!data.projects) {
            return (
                <>
                    <ProjectPanelSkeleton />

                    <Masonry
                        breakpointCols={breakpointsMasonry}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid-column"
                    >
                        {[...Array(10).keys()].map((_, id) => (
                            <ProjectCardSkeleton key={id} />
                        ))}
                    </Masonry>
                </>
            );
        }

        const projectsInDatabase = data.projects.length;
        const archivedProjects = data.projects.reduce(
            (counter, item) => (item.archived ? (counter += 1) : counter),
            0
        );
        const activeProjects = projectsInDatabase - archivedProjects;

        if (!isArchived && (projectsInDatabase === 0 || activeProjects === 0)) {
            return (
                <>
                    <ProjectPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                        disabled={true}
                    />
                    <ProjectNoActive />
                </>
            );
        }
        if (
            isArchived &&
            (projectsInDatabase === 0 || archivedProjects === 0)
        ) {
            return (
                <>
                    <ProjectPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                        disabled={true}
                    />
                    <ProjectNoArchive />
                </>
            );
        }

        if (
            (isArchived &&
                archivedProjects > 0 &&
                projects &&
                projects.archivedProjects.length === 0) ||
            (!isArchived &&
                activeProjects > 0 &&
                projects &&
                projects.activeProjects.length === 0)
        ) {
            return (
                <>
                    <ProjectPanel
                        query={query}
                        setQuery={setQuery}
                        setSortBy={setSortBy}
                    />
                    <ProjectNoResults />
                </>
            );
        }

        return (
            <>
                <ProjectPanel
                    query={query}
                    setQuery={setQuery}
                    setSortBy={setSortBy}
                />
                <Masonry
                    breakpointCols={breakpointsMasonry}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid-column"
                >
                    {isArchived
                        ? projects?.archivedProjects
                        : projects?.activeProjects}
                </Masonry>
            </>
        );
    };

    /**
     * Projects page render
     */
    return (
        <>
            <div className="mb-4">
                <PageHeader title="Projects dashboard" />
                <Breadcrumb
                    items={[
                        {
                            name: "Projects",
                            Icon: LayoutDashboard,
                            href: "/projects",
                        },
                    ]}
                />
            </div>
            <div className="text-base border-b-2 border-gray-200 dark:border-gray-700">
                <Tabs>
                    <TabItem
                        title="Active projects"
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

            {projectDashboardContent()}
        </>
    );
};

export default Projects;
