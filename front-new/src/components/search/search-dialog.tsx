import Fuse from "fuse.js";

import { useEffect, useState } from "react";
import { useData } from "@/hooks/use-data-hook";

import { cn } from "@/lib/utils";

import { Search } from "lucide-react";
import { SearchOff } from "@/components/icons";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
} from "@/components/ui/command-searchbar";
import Kbd from "@/components/kbd";
import SearchItem from "@/components/search/search-item";
import { useDebounce } from "@/hooks/use-debounce-hook";
import SearchItemSkeleton from "@/components/search/search-item-skeleton";
import { Keyable } from "@/types/types";

interface SearchData {
    projects_group: React.ReactNode[];
    experiments_group: React.ReactNode[];
    iterations_group: React.ReactNode[];
    datasets_group: React.ReactNode[];
    models_group: React.ReactNode[];
}

const SearchDialog = () => {
    const [open, setOpen] = useState(false);
    const data = useData();

    const [query, setQuery] = useState("");
    const debounceSearch = useDebounce(query, 250);

    const [searchData, setSearchData] = useState<SearchData | null>(null);

    useEffect(() => {
        const filterData = async () => {
            if (!data.projects || !data.models || !data.datasets) return;

            let projects_group: React.ReactNode[] = [];
            let experiments_group: React.ReactNode[] = [];
            let iterations_group: React.ReactNode[] = [];
            let datasets_group: React.ReactNode[] = [];
            let models_group: React.ReactNode[] = [];

            let search_data: Keyable[] = [];

            data.projects.forEach((project) => {
                let iterations = 0;
                project.experiments.forEach((experiment) => {
                    search_data.push({
                        type: "experiment",
                        id: experiment.id,
                        name: experiment.name,
                        project_id: project._id,
                        project_title: project.title,
                        iterations_count: experiment.iterations?.length,
                    });
                    iterations += experiment.iterations?.length;
                    experiment.iterations.forEach((iteration) => {
                        search_data.push({
                            type: "iteration",
                            id: iteration.id,
                            iteration_name: iteration.iteration_name,
                            experiment_id: experiment.id,
                            experiment_name: experiment.name,
                            project_id: project._id,
                            project_title: project.title,
                        });
                    });
                });
                search_data.push({
                    type: "project",
                    _id: project._id,
                    title: project.title,
                    status: project.status,
                    experiments_count: project.experiments.length,
                    iterations_count: iterations,
                    archived: project.archived,
                });
            });

            data.datasets.forEach((dataset) => {
                search_data.push({
                    type: "dataset",
                    ...dataset,
                });
            });

            data.models.forEach((model) => {
                search_data.push({
                    type: "model",
                    ...model,
                });
            });

            const fuseSearch = new Fuse(search_data, {
                includeScore: true,
                minMatchCharLength: 1,
                threshold: 0.25,
                keys: [
                    "name",
                    "title",
                    "project_title",
                    "status",
                    "iteration_name",
                    "model_name",
                    "iteration.iteration_name",
                    "dataset_name",
                ],
            });

            debounceSearch === ""
                ? search_data.forEach((item) => {
                      switch (item.type) {
                          case "project":
                              projects_group.push(
                                  <SearchItem
                                      key={item._id}
                                      handleClose={handleClose}
                                      type="project"
                                      data={{ [item.type]: item }}
                                  />
                              );
                              break;
                          case "experiment":
                              experiments_group.push(
                                  <SearchItem
                                      key={item.id}
                                      handleClose={handleClose}
                                      type="experiment"
                                      data={{ [item.type]: item }}
                                  />
                              );
                              break;
                          case "iteration":
                              iterations_group.push(
                                  <SearchItem
                                      key={item.id}
                                      handleClose={handleClose}
                                      type="iteration"
                                      data={{ [item.type]: item }}
                                  />
                              );
                              break;
                          case "model":
                              models_group.push(
                                  <SearchItem
                                      key={item._id}
                                      handleClose={handleClose}
                                      type="model"
                                      data={{ [item.type]: item }}
                                  />
                              );
                              break;
                          case "dataset":
                              datasets_group.push(
                                  <SearchItem
                                      key={item._id}
                                      handleClose={handleClose}
                                      type="dataset"
                                      data={{ [item.type]: item }}
                                  />
                              );
                              break;
                      }
                  })
                : fuseSearch.search(debounceSearch).forEach((results) => {
                      switch (results.item.type) {
                          case "project":
                              projects_group.push(
                                  <SearchItem
                                      key={results.item._id}
                                      type="project"
                                      handleClose={handleClose}
                                      data={{
                                          [results.item.type]: results.item,
                                      }}
                                  />
                              );
                              break;
                          case "experiment":
                              experiments_group.push(
                                  <SearchItem
                                      key={results.item.id}
                                      type="experiment"
                                      handleClose={handleClose}
                                      data={{
                                          [results.item.type]: results.item,
                                      }}
                                  />
                              );
                              break;
                          case "iteration":
                              iterations_group.push(
                                  <SearchItem
                                      key={results.item.id}
                                      handleClose={handleClose}
                                      type="iteration"
                                      data={{
                                          [results.item.type]: results.item,
                                      }}
                                  />
                              );
                              break;
                          case "model":
                              models_group.push(
                                  <SearchItem
                                      key={results.item._id}
                                      handleClose={handleClose}
                                      type="model"
                                      data={{
                                          [results.item.type]: results.item,
                                      }}
                                  />
                              );
                              break;
                          case "dataset":
                              datasets_group.push(
                                  <SearchItem
                                      key={results.item._id}
                                      handleClose={handleClose}
                                      type="dataset"
                                      data={{
                                          [results.item.type]: results.item,
                                      }}
                                  />
                              );
                              break;
                      }
                  });

            setSearchData({
                projects_group: projects_group.slice(
                    0,
                    Math.min(projects_group.length, 10)
                ),
                experiments_group: experiments_group.slice(
                    0,
                    Math.min(experiments_group.length, 10)
                ),
                iterations_group: iterations_group.slice(
                    0,
                    Math.min(iterations_group.length, 10)
                ),
                datasets_group: datasets_group.slice(
                    0,
                    Math.min(datasets_group.length, 10)
                ),
                models_group: models_group.slice(
                    0,
                    Math.min(models_group.length, 10)
                ),
            });
        };

        filterData();
    }, [data.projects, data.models, data.datasets, debounceSearch]);

    useEffect(() => {
        const openSearchDialog = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", openSearchDialog);
        return () => document.removeEventListener("keydown", openSearchDialog);
    }, []);

    const handleClose = () => {
        setOpen(false);
        setQuery("");
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="mx-4 flex-grow whitespace-nowrap items-center px-2 py-1 transition text-mlops-secondary-tx rounded-lg group gap-x-2 h-[40px] max-w-[300px] group bg-[#a1a1aa25] hover:dark:bg-[#a1a1aa44] hover:bg-[#a1a1aa20] duration-300 border border-mlops-secondary-tx/25 overflow-hidden hidden sm:flex hover:border-mlops-primary-tx hover:dark:border-mlops-primary-tx-dark"
            >
                <Search className="w-5 h-5 dark:text-mlops-primary-tx-dark text-mlops-primary-tx" />
                <p className="overflow-hidden font-medium transition duration-300 overflow-ellipsis text-md text-zinc-500 dark:text-zinc-400 group-hover:text-mlops-primary-tx dark:group-hover:text-mlops-primary-tx-dark">
                    Quick search ...
                </p>
                <Kbd>
                    <span>CTRL+K</span>
                </Kbd>
            </button>

            <div
                className="flex items-center w-10 h-10 ml-auto mr-4 rounded cursor-pointer dark:hover:bg-mlops-action-hover-bg-dark hover:bg-mlops-action-hover-bg sm:hidden"
                onClick={() => setOpen(true)}
            >
                <div className={cn("p-[6px]")}>
                    <Search
                        className={cn(
                            "w-7 h-7 text-mlops-primary-tx dark:text-mlops-primary-tx-dark"
                        )}
                    />
                </div>
            </div>

            <CommandDialog
                open={open}
                onOpenChange={handleClose}
                className="lg:max-w-[60vw] md:max-w-[80vw] sm:max-w-[90vw] max-w-[95vw] rounded-md"
            >
                <CommandInput
                    placeholder="Search database ..."
                    value={query}
                    onValueChange={(value) => setQuery(value)}
                    disabled={!searchData}
                />
                <CommandList>
                    <CommandEmpty className="flex flex-col items-center p-8">
                        <SearchOff className="w-16 h-16 mb-3" />
                        No results found based on query.
                    </CommandEmpty>
                    {!searchData && (
                        <CommandGroup heading="Loading ...">
                            {[...Array(10).keys()].map((_, id) => (
                                <SearchItemSkeleton key={id} />
                            ))}
                        </CommandGroup>
                    )}

                    {searchData && searchData.projects_group.length > 0 && (
                        <>
                            <CommandGroup heading="Projects">
                                {searchData.projects_group}
                            </CommandGroup>
                        </>
                    )}
                    {searchData && searchData.experiments_group.length > 0 && (
                        <>
                            <CommandGroup heading="Experiments">
                                {searchData.experiments_group}
                            </CommandGroup>
                        </>
                    )}
                    {searchData && searchData.iterations_group.length > 0 && (
                        <>
                            <CommandGroup heading="Iterations">
                                {searchData.iterations_group}
                            </CommandGroup>
                        </>
                    )}
                    {searchData && searchData.datasets_group.length > 0 && (
                        <>
                            <CommandGroup heading="Datasets">
                                {searchData.datasets_group}
                            </CommandGroup>
                        </>
                    )}
                    {searchData && searchData.models_group.length > 0 && (
                        <>
                            <CommandGroup heading="Models">
                                {searchData.models_group}
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
                <div className="border-t border-gray-300 dark:border-gray-700" />
                <div className="flex items-center justify-end px-3 py-2">
                    <div className="flex items-center pr-2 border-r-1">
                        <span className="mr-2 text-sm">Jump to</span>
                        <Kbd>
                            <span className="text-xs">↵</span>
                        </Kbd>
                    </div>
                    <div className="flex items-center ml-2">
                        <span className="mr-2 text-sm">Close</span>
                        <Kbd>
                            <span className="text-xs">ESC</span>
                        </Kbd>
                    </div>
                </div>
            </CommandDialog>
        </>
    );
};

export default SearchDialog;
