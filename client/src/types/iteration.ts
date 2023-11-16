import { Keyable } from "./types";

export interface IterationDataset {
    id: string;
    name: string;
    version: string;
}

export interface ImageChart {
    id: string;
    name: string;
    encoded_image: string;
    comparable?: boolean;
}

export interface Iteration {
    id: string;

    iteration_name: string;

    parameters: Keyable;
    metrics: Keyable;

    path_to_model: string;

    user_name: string;

    dataset?: IterationDataset;

    created_at: Date;
    updated_at: Date;

    project_id: string;
    project_title: string;

    experiment_id: string;
    experiment_name: string;

    interactive_charts: Keyable[];
    image_charts: ImageChart[];

    assigned_monitored_model_id?: string;
    assigned_monitored_model_name?: string;
}
