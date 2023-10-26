import { cn } from "@/lib/utils";

function Skeleton({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md dark:bg-[#52525b] bg-[#d4d4d8]", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export { Skeleton };
