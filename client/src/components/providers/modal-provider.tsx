import React from "react";

import {
    CreateProjectModal,
    EditProjectModal,
    DeleteProjectModal,
    ArchiveRestoreProjectModal,
} from "@/components/modals/projects";

import {
    CreateExperimentModal,
    EditExperimentModal,
    DeleteExperimentModal,
} from "@/components/modals/experiments";

import {
    EditIterationModal,
    DeleteIterationsModal,
} from "@/components/modals/iterations";

import {
    CreateEmptyModelModal,
    CreateModelFromIterationModal,
    DeleteModelModal,
    EditModelModal,
    ArchiveRestoreModelModal,
} from "@/components/modals/models";

import {
    CreateDatasetModal,
    EditDatasetModal,
    DeleteDatasetModal,
    ArchiveRestoreDatasetModal,
} from "@/components/modals/datasets";
import CreateMonitoringChartModal from "../modals/monitoring/create-monitoring-chart-modal";
import DeleteMonitoringChartModal from "../modals/monitoring/delete-monitoring-chart-modal";
import EditMonitoringChartModal from "../modals/monitoring/edit-monitoring-chart-modal";

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

            <CreateMonitoringChartModal />
            <EditMonitoringChartModal />
            <DeleteMonitoringChartModal />
        </>
    );
};

export default ModalProvider;
