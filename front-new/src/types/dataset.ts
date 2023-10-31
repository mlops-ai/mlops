import { Keyable } from "./types";

export interface Dataset {
    _id: string;
    dataset_name: string;
    path_to_dataset: string;
    dataset_description: string;
    tags: string;
    version: string;
    archived: boolean;
    pinned: boolean;

    linked_iterations: Keyable;

    created_at: Date;
    updated_at: Date;
}