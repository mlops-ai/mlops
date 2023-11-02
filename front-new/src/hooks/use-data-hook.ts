import { create } from "zustand";

import { Project } from "@/types/project";
import { Experiment } from "@/types/experiment";
import { Iteration } from "@/types/iteration";
import { Keyable } from "@/types/types";
import { Model } from "@/types/model";
import { Dataset } from "@/types/dataset";

interface DataStore {
    projects: Project[] | null;
    setProjectsData: (data: Project[]) => void;
    addProject: (project: Project) => void;
    deleteProject: (project_id: string) => void;
    updateProject: (project_id: string, project: Project) => void;

    addExperiment: (project_id: string, experiment: Experiment) => void;
    deleteExperiment: (project_id: string, experiment_id: string) => void;
    updateExperiment: (
        project_id: string,
        experiment_id: string,
        experiment: Experiment
    ) => void;

    updateIteration: (
        project_id: string,
        experiment_id: string,
        iteration_id: string,
        iteration: Iteration
    ) => void;
    deleteIterations: (project_id: string, iterationsToDelete: Keyable) => void;

    datasets: Dataset[] | null;
    setDatasetsData: (data: Dataset[]) => void;
    addDataset: (dataset: Dataset) => void;
    updateDataset: (dataset_id: string, dataset: Dataset) => void;
    deleteDataset: (dataset_id: string) => void;

    models: Model[] | null;
    setModelsData: (data: Model[]) => void;
    addModel: (model: Model) => void;
    deleteModel: (model_id: string) => void;
    updateModel: (model_id: string, model: Model) => void;

    setAll: (
        projectData: Project[],
        modelData: Model[],
        datasetData: Dataset[]
    ) => void;
}

export const useData = create<DataStore>((set) => ({
    projects: null,
    setProjectsData: (data: Project[]) => set({ projects: data }),
    addProject: (project: Project) =>
        set((state) => {
            if (state.projects) {
                return { projects: [...state.projects, project] };
            }
            return { projects: null };
        }),
    deleteProject: (project_id: string) =>
        set((state) => {
            if (state.projects) {
                return {
                    projects: [
                        ...state.projects.filter(
                            (project) => project._id !== project_id
                        ),
                    ],
                };
            }
            return { projects: null };
        }),
    updateProject: (project_id: string, project: Project) =>
        set((state) => {
            if (state.projects) {
                const index = state.projects.findIndex(
                    (project) => project._id === project_id
                );

                if (index === -1) return state;

                state.projects[index] = project;
                return { projects: [...state.projects] };
            }
            return { projects: null };
        }),

    addExperiment: (project_id: string, experiment: Experiment) => {
        set((state) => {
            if (state.projects) {
                const index = state.projects.findIndex(
                    (project) => project._id === project_id
                );

                if (index === -1) return state;

                state.projects[index].experiments.push(experiment);
                return { projects: [...state.projects] };
            }
            return { projects: null };
        });
    },
    deleteExperiment: (project_id: string, experiment_id: string) => {
        set((state) => {
            if (state.projects) {
                const index = state.projects.findIndex(
                    (project) => project._id === project_id
                );

                if (index === -1) return state;

                state.projects[index].experiments = state.projects[
                    index
                ].experiments.filter(
                    (experiment) => experiment.id !== experiment_id
                );
                return { projects: [...state.projects] };
            }
            return { projects: null };
        });
    },
    updateExperiment: (
        project_id: string,
        experiment_id: string,
        experiment: Experiment
    ) => {
        set((state) => {
            if (state.projects) {
                const index = state.projects.findIndex(
                    (project) => project._id === project_id
                );

                if (index === -1) return state;

                const experiment_index = state.projects[
                    index
                ].experiments.findIndex(
                    (experiment) => experiment.id === experiment_id
                );

                if (experiment_index === -1) return state;

                state.projects[index].experiments[experiment_index] =
                    experiment;
                return { projects: [...state.projects] };
            }
            return { projects: null };
        });
    },

    updateIteration: (
        project_id: string,
        experiment_id: string,
        iteration_id: string,
        iteration: Iteration
    ) => {
        set((state) => {
            if (state.projects) {
                console.log("test");
                const index = state.projects.findIndex(
                    (project) => project._id === project_id
                );

                if (index === -1) return state;

                const experiment_index = state.projects[
                    index
                ].experiments.findIndex(
                    (experiment) => experiment.id === experiment_id
                );

                if (experiment_index === -1) return state;

                const iteration_index = state.projects[index].experiments[
                    experiment_index
                ].iterations.findIndex(
                    (iteration) => iteration.id === iteration_id
                );

                if (iteration_index === -1) return state;

                console.log("test2");

                state.projects[index].experiments[experiment_index].iterations[
                    iteration_index
                ] = iteration;
                console.log(
                    state.projects[index].experiments[experiment_index]
                        .iterations[iteration_index]
                );
                return { projects: [...state.projects] };
            }
            return { projects: null };
        });
    },
    deleteIterations: (project_id: string, iterationsToDelete: Keyable) => {
        set((state) => {
            if (state.projects) {
                const index = state.projects.findIndex(
                    (project) => project._id === project_id
                );

                if (index === -1) return state;

                let experiments =
                    Object.getOwnPropertyNames(iterationsToDelete);

                for (let experiment_id of experiments) {
                    const experiment_index = state.projects[
                        index
                    ].experiments.findIndex(
                        (experiment) => experiment.id === experiment_id
                    );

                    if (experiment_index === -1) return state;

                    state.projects[index].experiments[
                        experiment_index
                    ].iterations = state.projects[index].experiments[
                        experiment_index
                    ].iterations.filter(
                        (iteration) =>
                            !iterationsToDelete[experiment_id].includes(
                                iteration.id
                            )
                    );
                }

                return { projects: [...state.projects] };
            }
            return { projects: null };
        });
    },

    datasets: null,
    setDatasetsData: (data: Dataset[]) => set({ datasets: data }),
    addDataset: (dataset: Dataset) =>
        set((state) => {
            if (state.datasets) {
                return { datasets: [...state.datasets, dataset] };
            }
            return { datasets: null };
        }),
    updateDataset: (dataset_id: string, dataset: Dataset) =>
        set((state) => {
            if (state.datasets) {
                const index = state.datasets.findIndex(
                    (dataset) => dataset._id === dataset_id
                );

                if (index === -1) return state;

                state.datasets[index] = dataset;
                return { datasets: [...state.datasets] };
            }
            return { datasets: null };
        }),
    deleteDataset: (dataset_id: string) =>
        set((state) => {
            if (state.datasets) {
                return {
                    datasets: [
                        ...state.datasets.filter(
                            (dataset) => dataset._id !== dataset_id
                        ),
                    ],
                };
            }
            return { datasets: null };
        }),

    models: null,
    setModelsData: (data: Model[]) => set({ models: data }),
    setAll: (
        projectData: Project[],
        modelData: Model[],
        datasetData: Dataset[]
    ) =>
        set({
            projects: projectData,
            models: modelData,
            datasets: datasetData,
        }),
    addModel: (model: Model) => {
        set((state) => {
            if (state.models) {
                return { models: [...state.models, model] };
            }
            return { models: null };
        });
    },
    deleteModel: (model_id: string) => {
        set((state) => {
            if (state.models) {
                return {
                    models: [
                        ...state.models.filter(
                            (model) => model._id !== model_id
                        ),
                    ],
                };
            }
            return { models: null };
        });
    },
    updateModel: (model_id: string, model: Model) => {
        set((state) => {
            if (state.models) {
                const index = state.models.findIndex(
                    (model) => model._id === model_id
                );

                if (index === -1) return state;

                state.models[index] = model;
                return { models: [...state.models] };
            }
            return { models: null };
        });
    },
}));
