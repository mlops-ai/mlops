import { create } from "zustand";

import { Project } from "@/types/project";
import { Experiment } from "@/types/experiment";
import { Iteration } from "@/types/iteration";
import { Keyable } from "@/types/types";
import { Model } from "@/types/model";
import { Dataset } from "@/types/dataset";

export type ModalType =
    | "createProject"
    | "editProject"
    | "deleteProject"
    | "archiveProject"
    | "restoreProject"
    | "createExperiment"
    | "editExperiment"
    | "deleteExperiment"
    | "editIteration"
    | "deleteIterations"
    | "createDataset"
    | "editDataset"
    | "deleteDataset"
    | "archiveDataset"
    | "restoreDataset"
    | "createEmptyModel"
    | "createModelFromIteration"
    | "editModel"
    | "deleteModel"
    | "archiveModel"
    | "restoreModel";

interface DeleteIterations {
    project_id: string;
    numberOfIterations: number;
    iterationsToDelete: Keyable;
}

interface ModalData {
    project?: Project;
    experiment?: Experiment;
    iteration?: Iteration;
    deleteIterations?: DeleteIterations;
    model?: Model;
    dataset?: Dataset;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false, data: {} }),
}));
