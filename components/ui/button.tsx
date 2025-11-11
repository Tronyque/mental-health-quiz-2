// components/ui/button.tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // base
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          // fond primaire + texte lisible + hover léger
          "bg-primary text-[hsl(var(--color-primary-foreground))] hover:brightness-110",
        secondary:
          "bg-accent text-[hsl(var(--color-accent-foreground))] hover:bg-accent/80",
        outline:
          // 👇 encadrement visible (utile pour ton besoin)
          "bg-[hsl(var(--color-card))] text-foreground border border-[hsl(var(--color-border))] hover:bg-accent/30",
        ghost: "bg-transparent hover:bg-accent/20",
        link: "underline-offset-4 hover:underline text-primary",
        destructive:
          "bg-destructive text-[hsl(var(--color-destructive-foreground))] hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
