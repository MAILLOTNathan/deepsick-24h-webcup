"use client";

import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/ui";

export type RadarBlip = { x: number; y: number; tone?: "info" | "danger" | "success" | "warning" };

const TONE_VAR: Record<string, string> = {
  info: "var(--info)",
  danger: "var(--destructive)",
  success: "var(--chart-3)",
  warning: "var(--chart-4)",
};

/**
 * Stylised radar used at the centre of the operational views (security,
 * medical, maintenance, transport). Purely decorative — no real map data.
 */
export function RadarCard({
  label,
  caption,
  locked = false,
  blips = [],
  className,
}: {
  label: string;
  caption?: string;
  locked?: boolean;
  blips?: RadarBlip[];
  className?: string;
}) {
  const t = useT();
  const dots =
    blips.length > 0
      ? blips
      : [
          { x: 0.34, y: 0.4, tone: "danger" as const },
          { x: 0.62, y: 0.56, tone: "info" as const },
          { x: 0.5, y: 0.29, tone: "success" as const },
        ];

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card p-4", className)}>
      <svg viewBox="0 0 200 200" className="mx-auto h-44 w-44" role="img" aria-label={label}>
        <defs>
          <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--info)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--info)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[30, 60, 90].map((r) => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        <line x1="10" y1="100" x2="190" y2="100" stroke="var(--border)" strokeWidth="1" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="var(--border)" strokeWidth="1" />

        <path d="M100 100 L190 100 A90 90 0 0 1 129 173 Z" fill="url(#radar-sweep)" />

        {dots.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x * 200}
            cy={dot.y * 200}
            r="4"
            fill={TONE_VAR[dot.tone ?? "info"]}
          />
        ))}
        <circle cx="100" cy="100" r="3" fill="var(--primary)" />
      </svg>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="truncate font-mono text-xs text-foreground">{label}</span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {locked ? t.common.locked : t.common.scanning}
        </span>
      </div>
      {caption ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
