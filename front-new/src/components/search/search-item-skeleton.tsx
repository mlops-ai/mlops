import { lorem, numberBetween } from "@/lib/utils";

import { statuses } from "@/config/maping";

import { CommandItem } from "@/components/ui/command-searchbar";
import { Skeleton } from "@/components/ui/skeleton";

const SearchItemSkeleton = () => {
    return (
        <CommandItem
            className="flex items-center justify-between w-full cursor-pointer select-none"
            disabled={true}
        >
            <div className="flex items-center mr-3 text-transparent">
                <Skeleton className="mr-2 rounded">
                    <div className="flex-shrink-0 w-5 h-5" />
                </Skeleton>
                <Skeleton className="rounded">
                    {lorem.generateWords(numberBetween(2, 5))}
                </Skeleton>
            </div>
            <div className="flex items-center text-transparent gap-x-1">
                <Skeleton className="border-none h-[20px] px-1 gap-x-[1px] flex items-center text-xs rounded">
                    <div className="flex-shrink-0 w-3 h-3" />
                    <span>{numberBetween(0, 1000)}</span>
                </Skeleton>
                <Skeleton className="border-none h-[20px] px-1 gap-x-[1px] flex items-center text-xs rounded">
                    <div className="flex-shrink-0 w-3 h-3" />
                    <span>numberBetween(0, 100)</span>
                </Skeleton>
                <Skeleton className="text-xs border-none px-[10px] py-[2px] rounded">
                    {statuses[numberBetween(0, 2)]}
                </Skeleton>
            </div>
        </CommandItem>
    );
};

export default SearchItemSkeleton;
