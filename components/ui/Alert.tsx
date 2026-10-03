import type { ReactNode } from "react";

import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { cn } from "@/lib/ui";

type Tone = "info" | "success" | "error";

const TONES: Record<Tone, string> = {
  info: "border-info/40 bg-info/10 text-info",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  error: "border-destructive/50 bg-destructive/10 text-destructive",
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
    <ShadcnAlert
      variant={tone === "error" ? "destructive" : "default"}
      className={cn(TONES[tone], className)}
    >
      {title ? (
        <AlertTitle className="font-mono text-xs uppercase tracking-wide">{title}</AlertTitle>
      ) : null}
      {children ? (
        <AlertDescription className={cn("text-inherit", title && "mt-1")}>
          {children}
        </AlertDescription>
      ) : null}
    </ShadcnAlert>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
      <p className="font-mono text-sm text-foreground">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
