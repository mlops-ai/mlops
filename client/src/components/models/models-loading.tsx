import { breakpointsMasonry } from "@/config/breakpoints";
import ModelPanelSkeleton from "@/pages/models/models-panel/models-panel-skeleton";
import Masonry from "react-masonry-css";
import ModelCardSkeleton from "./model-card-skeleton";
import ModelsHeader from "./models-header";

const ModelsLoading = () => {
    return (
        <>
            <ModelsHeader />

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
};

export default ModelsLoading;
