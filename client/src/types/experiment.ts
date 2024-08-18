import { Iteration } from "@/types/iteration";
import { ColumnsMetadata } from "@/types/columns-metadata.ts";

export interface Experiment {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    iterations: Iteration[];
    checked?: boolean;
    columns_metadata: ColumnsMetadata;
}
