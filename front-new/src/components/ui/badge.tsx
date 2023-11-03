import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                mlops: "border-transparent text-white rounded",
                completed:
                    "border-transparent bg-mlops-completed text-white rounded text-xs font-medium",
                in_progress:
                    "border-transparent bg-mlops-in-progress text-white rounded text-xs font-medium",
                not_started:
                    "border-transparent bg-mlops-not-started text-white rounded text-xs font-medium",
                active:
                    "border-transparent bg-mlops-in-progress text-white rounded text-xs font-medium",
                idle:
                    "border-transparent bg-mlops-not-started text-white rounded text-xs font-medium",
                archived:
                    "border-transparent bg-mlops-archived text-white rounded text-xs font-medium",
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
