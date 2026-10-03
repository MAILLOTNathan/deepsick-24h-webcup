import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/ui";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-mars text-background hover:brightness-110 border border-transparent",
  secondary: "bg-surface-light text-slate-100 hover:bg-surface border border-border/60",
  ghost: "bg-transparent text-slate-200 hover:bg-surface border border-transparent",
  danger: "bg-alert text-white hover:brightness-110 border border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-mono font-medium uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}
