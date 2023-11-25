import { Iteration } from "./iteration";
import { MonitoringChart } from "./monitoring-chart";
import { Prediction } from "./prediction";
import { ModelStatus } from "./types";

export interface Model {
    _id: string;

    model_name: string;
    model_description: string;
    model_status: ModelStatus;

    iteration?: Iteration;
    pinned: boolean;

    predictions_data: Prediction[];
    ml_model?: string;

    interactive_charts: MonitoringChart[];
    // interactive_charts_existed:

    created_at: Date;
    updated_at: Date;
}