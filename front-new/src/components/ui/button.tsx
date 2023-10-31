import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        mlopsPrimary: "bg-mlops-primary text-white hover:bg-mlops-primary/90 text-md font-semibold focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark",
        mlopsDanger: "bg-mlops-danger text-white hover:bg-mlops-danger/90 text-md font-semibold focus-visible:ring-mlops-primary-tx focus-visible:dark:ring-mlops-primary-tx-dark",
        mlopsGridAction: "bg-white text-mlops-primary-tx border border-[1.5px] border-mlops-primary-tx font-semibold text-base hover:bg-mlops-primary-tx hover:text-white transition duration-300 dark:bg-mlops-nav-bg-dark dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-mlops-nav-bg-dark",
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-2",
        md: "h-9 rounded-md px-3",
        lg: "h-10 rounded-md px-8",
        icon: "h-10 w-10",
        grid: "h-9 rounded-md py-1 px-[6px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
