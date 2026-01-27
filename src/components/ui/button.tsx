import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-500/25 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/30",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-sm",
        outline: "border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm",
        success: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md shadow-accent-500/25 hover:from-accent-600 hover:to-accent-700 hover:shadow-lg hover:shadow-accent-500/30",
        ghost: "hover:bg-slate-100 text-slate-700"
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-xs",
        icon: "h-9 w-9",
        lg: "h-12 px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button, buttonVariants };
