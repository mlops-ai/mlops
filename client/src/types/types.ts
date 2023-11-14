import { Dataset } from "./dataset";
import { Iteration } from "./iteration";
import { Model } from "./model";
import { Project } from "./project";

export interface ProjectData {
    _id: string;
    title: string;
    status: "completed" | "in_progress" | "not_started";
    experiments_count: number;
    iterations_count: number;
    archived: boolean;
}

export interface ExperimentData {
    id: string;
    name: string;
    project_id: string;
    project_title: string;
    iterations_count: number;
}

export interface IterationData {
    id: string;
    iteration_name: string;
    experiment_id: string;
    experiment_name: string;
    project_id: string;
    project_title: string;
}

export interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

export interface Keyable {
    [key: string]: any;
}

export interface ProjectQuickAction {
    project: Project;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    ItemType: any;
    SubItemType?: any;
}

export interface IterationQuickAction {
    iteration: Iteration;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    ItemType: any;
    SubItemType?: any;
}

export interface ModelQuickAction {
    model: Model;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    ItemType: any;
    SubItemType?: any;
}

export interface DatasetQuickAction {
    dataset: Dataset;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    ItemType: any;
    SubItemType?: any;
}

export enum ProjectStatus {
    FINISHED = "completed",
    IN_PROGRESS = "in_progress",
    NOT_STARTED = "not_started",
}

export enum ModelStatus {
    ACTIVE = "active",
    IDLE = "idle",
    ARCHIVED = "archived",
}