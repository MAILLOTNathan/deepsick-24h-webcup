import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/ui";

type Tone = "primary" | "info" | "success" | "danger" | "warning";

const TONE_VAR: Record<Tone, string> = {
  primary: "var(--primary)",
  info: "var(--info)",
  success: "var(--chart-3)",
  danger: "var(--destructive)",
  warning: "var(--chart-4)",
};

/**
 * Compact command-centre metric tile (label / big value / hint), as seen in
 * every screen of the ui-v1 design.
 */
export function StatTile({
  label,
  value,
  hint,
  tone = "primary",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Card size="sm" className={cn("gap-1 p-3", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className="font-mono text-2xl leading-none"
        style={{ color: TONE_VAR[tone] }}
      >
        {value}
      </p>
      {hint ? (
        <p className="truncate font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </Card>
  );
}
