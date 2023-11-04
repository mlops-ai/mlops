import { Iteration } from "./iteration";
import { Keyable, ModelStatus } from "./types";

export interface Model {
    _id: string;

    model_name: string;
    model_description: string;
    model_status: ModelStatus;

    iteration?: Iteration;
    pinned: boolean;

    predictions_data: Keyable[];
    ml_model: string;

    created_at: Date;
    updated_at: Date;
    last_prediction: Date;
}