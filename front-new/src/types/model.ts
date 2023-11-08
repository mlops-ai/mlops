import { Iteration } from "./iteration";
import { ModelStatus } from "./types";

export interface Model {
    _id: string;
    model_name: string;
    model_description: string;
    model_status: ModelStatus;
    iteration?: Iteration;
    pinned: boolean;
    created_at: Date;
    updated_at: Date;
    // ml_model: any;
}