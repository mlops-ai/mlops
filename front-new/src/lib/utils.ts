import { Dataset } from "@/types/dataset";
import { Iteration } from "@/types/iteration";
import { Model } from "@/types/model";
import { Project } from "@/types/project";
import { type ClassValue, clsx } from "clsx";
import { LoremIpsum } from "lorem-ipsum";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const numberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 6,
        min: 2,
    },
});

export const sortProjectComparator = (
    p1: Project,
    p2: Project,
    method: string
) => {
    switch (method) {
        case "AZ":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.title.localeCompare(p2.title);
        case "ZA":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return -1 * p1.title.localeCompare(p2.title);
        case "UDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at < p2.updated_at ? 1 : -1;
        case "UASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at > p2.updated_at ? 1 : -1;
        case "CDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at < p2.created_at ? 1 : -1;
        case "CASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at > p2.created_at ? 1 : -1;
        default:
            return 0;
    }
};

export const sortDatasetComparator = (
    p1: Dataset,
    p2: Dataset,
    method: string
) => {
    switch (method) {
        case "AZ":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.dataset_name.localeCompare(p2.dataset_name);
        case "ZA":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return -1 * p1.dataset_name.localeCompare(p2.dataset_name);
        case "UDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at < p2.updated_at ? 1 : -1;
        case "UASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at > p2.updated_at ? 1 : -1;
        case "CDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at < p2.created_at ? 1 : -1;
        case "CASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at > p2.created_at ? 1 : -1;
        default:
            return 0;
    }
};

export const sortModelComparator = (
    p1: Model,
    p2: Model,
    method: string
) => {
    switch (method) {
        case "AZ":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.model_name.localeCompare(p2.model_name);
        case "ZA":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return -1 * p1.model_name.localeCompare(p2.model_name);
        case "UDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at < p2.updated_at ? 1 : -1;
        case "UASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.updated_at > p2.updated_at ? 1 : -1;
        case "CDESC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at < p2.created_at ? 1 : -1;
        case "CASC":
            if (p1.pinned && !p2.pinned) return -1;
            if (!p1.pinned && p2.pinned) return 1;
            return p1.created_at > p2.created_at ? 1 : -1;
        default:
            return 0;
    }
};

/**
 * Function for converting date to humanize form.
 * */
export const dateToHumanize = (date: string) => {
    const difference = moment.duration(Date.now() - Date.parse(date));
    return difference.humanize() + " ago";
};

export const extractColumnsData = (rowData: Iteration[], type: "parameters" | "metrics", TreeSelectBaseColumnsOptionsAll: any, TreeSelectBaseColumnsCheckedAll: any) => {
    let columnsPerIterations = rowData.map(
        (iteration) =>
            new Set(
                iteration[type]
                    ? Object.getOwnPropertyNames(iteration[type])
                    : ""
            )
    );

    let columnsUniqueSet = new Set<string>();

    columnsPerIterations.forEach((set) => {
        set.forEach((value) => {
            columnsUniqueSet.add(value);
        });
    });

    let columnsUniqueArray = Array.from(columnsUniqueSet);

    let gridColumns = []
    let treeselectColumns = []

    if (columnsUniqueArray.length > 0) {
        Object.assign(TreeSelectBaseColumnsCheckedAll, {
            [type]: {
                checked: true,
                partialChecked: false,
            }
        });

        for (let i = 0; i < columnsUniqueArray.length; i++) {
            const key = `${type}.` + columnsUniqueArray[i]
            gridColumns.push(
                {
                    field: key,
                    headerName: columnsUniqueArray[i],
                    filter: 'agNumberColumnFilter',
                    cellRenderer: (val: any) => {
                        if (val.data[type] && val.data[type][columnsUniqueArray[i]]) {
                            return val.data[type][columnsUniqueArray[i]]
                        }
                        return '-'
                    }
                }
            )
            treeselectColumns.push(
                {
                    key: key,
                    label: columnsUniqueArray[i]
                }
            )
            Object.assign(TreeSelectBaseColumnsCheckedAll, {
                [key]: {
                    checked: true,
                    partialChecked: false,
                }
            })
            // columns_list.push(key)
        }

        TreeSelectBaseColumnsOptionsAll.push(
            {
                key: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
                leaf: true,
                children: treeselectColumns
            }
        )
    }

    return [gridColumns, TreeSelectBaseColumnsOptionsAll, TreeSelectBaseColumnsCheckedAll];

};
