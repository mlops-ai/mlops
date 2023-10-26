import { TreeNode } from "primereact/treenode";
import {
    TreeSelectExpandedKeysType,
    TreeSelectSelectionKeysType,
} from "primereact/treeselect";
import { create } from "zustand";

interface TreeSelectStore {
    options: TreeNode[] | undefined;
    selectedOptions:
        | string
        | TreeSelectSelectionKeysType
        | TreeSelectSelectionKeysType[]
        | undefined
        | null;
    expandedKeys: TreeSelectExpandedKeysType | undefined;
    setAll: (
        options: TreeNode[],
        selectedOptions:
            | string
            | TreeSelectSelectionKeysType
            | TreeSelectSelectionKeysType[],
        expandedKeys: TreeSelectExpandedKeysType
    ) => void;
    setOptions: (options: TreeNode[]) => void;
    setSelectedOptions: (
        selectedOptions:
            | string
            | TreeSelectSelectionKeysType
            | TreeSelectSelectionKeysType[]
    ) => void;
    setExpandedKeys: (expandedKeys: TreeSelectExpandedKeysType) => void;
}

export const useTreeselect = create<TreeSelectStore>((set) => ({
    options: undefined,
    selectedOptions: undefined,
    expandedKeys: undefined,
    setAll: (options, selectedOptions, expandedKeys) =>
        set({ options, selectedOptions, expandedKeys }),
    setOptions: (options) => set({ options }),
    setSelectedOptions: (selectedOptions) => set({ selectedOptions }),
    setExpandedKeys: (expandedKeys) => set({ expandedKeys }),
}));
