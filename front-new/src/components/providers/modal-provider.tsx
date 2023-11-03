import React from "react";

import {
    CreateProjectModal,
    EditProjectModal,
    DeleteProjectModal,
    ArchiveRestoreProjectModal,
} from "@/components/modals/projects";
import CreateExperimentModal from "@/components/modals/experiments/create-experiment-modal";
import DeleteExperimentModal from "@/components/modals/experiments/delete-experiment-modal";
import EditExperimentModal from "@/components/modals/experiments/edit-experiment-modal";
import EditIterationModal from "../modals/iterations/edit-iteration-modal";
import DeleteIterationsModal from "../modals/iterations/delete-iterations-modal";
import DeleteModelModal from "../modals/models/delete-model-modal";
import CreateEmptyModelModal from "../modals/models/create-empty-model-modal";
import EditModelModal from "../modals/models/edit-model-modal";
import ArchiveRestoreModelModal from "../modals/models/archive-restore-model-modal";
import CreateModelFromIterationModal from "../modals/models/create-model-from-iteration-modal";
import CreateDatasetModal from "../modals/datasets/create-dataset-modal";
import EditDatasetModal from "../modals/datasets/edit-dataset-modal";
import DeleteDatasetModal from "../modals/datasets/delete-dataset-modal";
import ArchiveRestoreDatasetModal from "../modals/datasets/archive-restore-dataset-modal";

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <CreateProjectModal />
            <EditProjectModal />
            <DeleteProjectModal />
            <ArchiveRestoreProjectModal />

            <CreateExperimentModal />
            <EditExperimentModal />
            <DeleteExperimentModal />

            <EditIterationModal />
            <DeleteIterationsModal />

            <CreateDatasetModal />
            <EditDatasetModal />
            <DeleteDatasetModal />
            <ArchiveRestoreDatasetModal />

            <CreateEmptyModelModal />
            <CreateModelFromIterationModal />
            <DeleteModelModal />
            <EditModelModal />
            <ArchiveRestoreModelModal />
        </>
    );
};

export default ModalProvider;
