import { breakpointsMasonryDatasets } from "@/config/breakpoints";
import DatasetPanelSkeleton from "@/pages/datasets/datasets-panel/datasets-panel-skeleton";
import Masonry from "react-masonry-css";
import DatasetCardSkeleton from "./dataset-card-skeleton";
import DatasetsHeader from "./datasets-header";

const DatasetsLoading = () => {
    return (
        <>
            <DatasetsHeader />

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
};

export default DatasetsLoading;
