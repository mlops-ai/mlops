import { breakpointsMasonry } from "@/config/breakpoints";
import ProjectPanelSkeleton from "@/pages/projects/projects-panel/projects-panel-skeleton";
import Masonry from "react-masonry-css";
import ProjectCardSkeleton from "./project-card-skeleton";
import ProjectsHeader from "./projects-header";

const ProjectsLoading = () => {
    return (
        <>
            <ProjectsHeader />

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
};

export default ProjectsLoading;
