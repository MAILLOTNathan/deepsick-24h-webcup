import type { ReactNode } from "react";

import { cn } from "@/lib/ui";

type Tone = "info" | "success" | "error";

const TONES: Record<Tone, string> = {
  info: "border-info/40 bg-info/10 text-info",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  error: "border-alert/50 bg-alert/10 text-red-200",
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border px-4 py-3 text-sm", TONES[tone], className)}>
      {title ? <p className="font-mono text-xs uppercase tracking-wide">{title}</p> : null}
      {children ? <div className={cn(title && "mt-1")}>{children}</div> : null}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-surface/30 p-8 text-center">
      <p className="font-mono text-sm text-slate-300">{title}</p>
      {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
    </div>
  );
}
