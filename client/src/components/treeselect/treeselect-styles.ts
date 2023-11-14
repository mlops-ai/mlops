import { PrimeReactPTOptions } from "primereact/api";
import { classNames } from "primereact/utils";

const TRANSITIONS = {
    overlay: {
        enterFromClass: "opacity-0 scale-75",
        enterActiveClass:
            "transition-transform transition-opacity duration-150 ease-in",
        leaveActiveClass: "transition-opacity duration-150 ease-linear",
        leaveToClass: "opacity-0",
    },
};

// @ts-ignore
export const Tailwind = {
    treeselect: {
        root: () => ({
            className: classNames(
                "flex items-center cursor-pointer select-none w-[300px]",
                "transition duration-300 text-md focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark bg-[#a1a1aa25] focus:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] hover:dark:bg-[#a1a1aa44] focus:bg-[#a1a1aa20] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx h-9 shadow-none rounded-md"
            ),
        }),
        filterContainer: {
            className: classNames("m-0"),
        },
        filter: {
            className: classNames(
                "bg-[#E7E9F1] dark:bg-[#3F3C4B] hover:bg-[#E9EBF2] hover:dark:bg-[#4D4B58] relative flex items-center transition duration-300 text-md focus-visible:ring-mlops-primary-tx ring-offset-background focus-visible:dark:ring-mlops-primary-tx-dark hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark focus:dark:bg-[#4D4B58] focus:bg-[#E9EBF2] border border-mlops-secondary-tx/25 focus:dark:border-mlops-primary-tx-dark focus:border-mlops-primary-tx h-9 focus-visible:outline-none ring ring-transparent focus-visible:ring-2 focus-visible:ring-offset-2 pl-9 w-full rounded placeholder:text-muted-foreground"
            ),
            placeholder: "Search in columns ...",
        },
        filterIcon: {
            className: classNames(
                "absolute flex-shrink-0 w-5 h-5 top-4 left-4 dark:text-mlops-primary-tx-dark text-mlops-primary-tx"
            ),
        },
        labelContainer: {
            className: classNames(
                "overflow-hidden flex flex-auto cursor-pointer"
            ),
        },
        label: {
            className: classNames(
                "before:content-[Selected_columns:] block overflow-hidden whitespace-nowrap cursor-pointer overflow-ellipsis",
                "p-3 pl-2"
            ),
        },
        trigger: {
            className: classNames(
                "flex items-center justify-center shrink-0",
                "bg-transparent text-gray-600 dark:text-white/70 w-8 rounded-tr-lg rounded-br-lg"
            ),
        },
        triggerIcon: {
            className: classNames("w-4 h-4"),
        },
        header: {
            className: classNames("bg-white dark:bg-black p-2 rounded-t-md border-b"),
        },
        closeButton: {
            className: classNames("hidden"),
        },
        panel: {
            className: classNames(
                "bg-white dark:bg-black text-gray-700 dark:text-white/80 rounded-md shadow-lg border"
            ),
        },
        wrapper: {
            className: classNames(
                "max-h-[200px] overflow-auto",
                "bg-white dark:bg-gray-900 text-gray-700 dark:text-white/80 border-0 rounded"
            ),
        },
        transition: TRANSITIONS.overlay,
    },
    tree: {
        wrapper: "overflow-auto",
        container: "bg-white dark:bg-black m-0 p-2 list-none overflow-auto",
        content: () => ({
            className: classNames(
                "flex items-center group cursor-pointer",
                "rounded-lg  duration-300 p-[2px] hover:bg-accent hover:text-accent-foreground"
            ),
        }),
        toggler: () => ({
            className: classNames(
                "cursor-pointer select-none inline-flex items-center justify-center overflow-hidden relative shrink-0",
                "mr-2 w-8 h-8 border-0 bg-transparent rounded-full transition duration-200",
                "hover:border-transparent focus:outline-none focus:outline-offset-0"
            ),
        }),
        checkboxcontainer:
            "mr-2 flex items-center w-5 h-5 text-primary-mlops-tx dark:text-primary-mlops-tx-dark bg-transparent",
        checkbox: () => ({
            className: classNames(
                "cursor-pointer relative select-none rounded-sm",
                "w-full h-full m-0 p-0",
                "flex items-center justify-center",
                "border-2 border-mlops-secondary-tx/25 w-4 h-4 rounded-sm transition duration-300 text-base [&[aria-checked=true]]:text-white [&[aria-checked=false]]:text-primary-mlops-tx [&[aria-checked=true]]:bg-mlops-primary-tx [&[aria-checked=true]]:border-mlops-primary-tx dark:[&[aria-checked=true]]:text-mlops-primary-tx dark:[&[aria-checked=true]]:border-white dark:[&[aria-checked=true]]:bg-white hover:border-mlops-primary-tx dark:hover:border-mlops-primary-tx-dark group-hover:border-mlops-primary-tx group-hover:dark:border-mlops-primary-tx-dark"
            ),
        }),
        nodeicon: "mr-2 text-gray-600 dark:text-white/70",
        subgroup: {
            className: classNames("m-0 list-none", "p-0 pl-4"),
        },
        filtercontainer: {
            className: classNames("mb-2", "relative block w-full"),
        },
        searchicon:
            "absolute top-1/2 -mt-2 right-3 text-gray-600 dark:hover:text-white/70 text-mlops-primary-tx",
    },
} as PrimeReactPTOptions;