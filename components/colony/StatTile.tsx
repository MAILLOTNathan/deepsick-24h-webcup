"use client";

import { useRef, useState, type ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { countUp, DUR, revealSelf, useMotionLayoutEffect } from "@/lib/motion";
import { cn } from "@/lib/ui";

type Tone = "primary" | "info" | "success" | "danger" | "warning";

const TONE_VAR: Record<Tone, string> = {
  primary: "var(--primary)",
  info: "var(--info)",
  success: "var(--chart-3)",
  danger: "var(--destructive)",
  warning: "var(--chart-4)",
};

/** Only plain integers are worth counting up; everything else renders as-is. */
function countable(value: ReactNode): number | null {
  if (typeof value === "number") return Number.isInteger(value) ? value : null;
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) return Number(value);
  return null;
}

/**
 * Compact command-centre metric tile (label / big value / hint), as seen in
 * every screen of the ui-v1 design.
 *
 * Motion: the tile fades in, staggered by its position in the grid, and plain
 * integer values count up from zero.
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
  const ref = useRef<HTMLDivElement>(null);
  const target = countable(value);
  const [display, setDisplay] = useState<ReactNode>(value);

  // Entrance — delayed by the tile's place in its grid.
  useMotionLayoutEffect(() => {
    const animation = revealSelf(ref.current, { step: 60, y: 10, duration: DUR.base });
    return () => {
      animation?.revert();
    };
  }, []);

  // Count-up — the zero value is written before paint, so there is no flash.
  useMotionLayoutEffect(() => {
    if (target === null) {
      setDisplay(value);
      return;
    }

    setDisplay(0);
    const animation = countUp(target, (current) => setDisplay(Math.round(current)), {
      duration: DUR.slow,
    });

    return () => {
      animation?.revert();
    };
  }, [target, value]);

  return (
    <div ref={ref}>
      <Card size="sm" className={cn("h-full gap-1 p-3", className)}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="font-mono text-2xl leading-none" style={{ color: TONE_VAR[tone] }}>
          {display}
        </p>
        {hint ? (
          <p className="truncate font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
