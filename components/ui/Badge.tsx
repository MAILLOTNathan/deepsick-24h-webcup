import type { ReactNode } from "react";

import { cn } from "@/lib/ui";

type Tone = "neutral" | "mars" | "info" | "success" | "warning" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "border-border/60 bg-surface text-slate-300",
  mars: "border-mars/40 bg-mars/10 text-mars",
  info: "border-info/40 bg-info/10 text-info",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  danger: "border-alert/40 bg-alert/10 text-alert",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
