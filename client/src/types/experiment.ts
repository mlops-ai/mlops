import { Iteration } from "@/types/iteration";

export interface Experiment {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    iterations: Iteration[];
    checked?: boolean;
}
