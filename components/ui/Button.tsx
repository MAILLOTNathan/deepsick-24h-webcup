import type { ButtonHTMLAttributes } from "react";

import { Button as ShadcnButton, buttonVariants } from "@/components/shadcn/button";
import { cn } from "@/lib/ui";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANT_MAP = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  danger: "destructive",
} as const;

const SIZE_MAP = {
  sm: "sm",
  md: "default",
} as const;

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(
    buttonVariants({ variant: VARIANT_MAP[variant], size: SIZE_MAP[size] }),
    "font-mono uppercase tracking-wide",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <ShadcnButton
      variant={VARIANT_MAP[variant]}
      size={SIZE_MAP[size]}
      className={cn("font-mono uppercase tracking-wide", className)}
      {...props}
    />
  );
}
