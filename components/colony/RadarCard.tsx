"use client";

import { useRef } from "react";

import { animate, stagger } from "animejs";

import { useT } from "@/lib/i18n/client";
import {
  DUR,
  EASE_INOUT,
  EASE_LINEAR,
  drawIn,
  prefersReducedMotion,
  revealSelf,
  useMotionLayoutEffect,
  type Motion,
} from "@/lib/motion";
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
 *
 * Motion: the graticule draws itself in, the sweep rotates continuously and the
 * blips breathe. A locked radar scans more slowly — it is tracking something.
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
  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGGElement>(null);
  const sweepRef = useRef<SVGPathElement>(null);
  const blipsRef = useRef<SVGGElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);

  const dots =
    blips.length > 0
      ? blips
      : [
          { x: 0.34, y: 0.4, tone: "danger" as const },
          { x: 0.62, y: 0.56, tone: "info" as const },
          { x: 0.5, y: 0.29, tone: "success" as const },
        ];

  // Entrance.
  useMotionLayoutEffect(() => {
    const animation = revealSelf(cardRef.current, { step: 0, y: 14, duration: DUR.base });
    return () => {
      animation?.revert();
    };
  }, []);

  // Draw the graticule on (rings then crosshair).
  useMotionLayoutEffect(() => {
    const geometry = gridRef.current ? Array.from(gridRef.current.children) : [];
    const animation = drawIn(geometry, { step: 150, duration: DUR.draw, delay: 100 });
    return () => {
      animation?.revert();
    };
  }, []);

  // Rotating sweep — slower while the station is locked on a target.
  useMotionLayoutEffect(() => {
    if (!sweepRef.current || prefersReducedMotion()) return;

    const animation = animate(sweepRef.current, {
      rotate: 360,
      duration: locked ? 7600 : 4200,
      loop: true,
      ease: EASE_LINEAR,
    });

    return () => {
      animation.revert();
    };
  }, [locked]);

  // Blips + core: a slow breath so the scope feels alive.
  useMotionLayoutEffect(() => {
    const blipDots = blipsRef.current ? Array.from(blipsRef.current.children) : [];
    if (prefersReducedMotion()) return;

    const animations: Motion[] = [];

    if (blipDots.length > 0) {
      animations.push(
        animate(blipDots, {
          opacity: [0.4, 1],
          duration: 1200,
          loop: true,
          alternate: true,
          ease: EASE_INOUT,
          delay: stagger(260),
        }),
      );
    }

    if (coreRef.current) {
      animations.push(
        animate(coreRef.current, {
          opacity: [1, 0.35],
          duration: 1500,
          loop: true,
          alternate: true,
          ease: EASE_INOUT,
        }),
      );
    }

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, [dots.length]);

  return (
    <div
      ref={cardRef}
      className={cn("overflow-hidden rounded-xl border border-border bg-card p-4", className)}
    >
      <svg viewBox="0 0 200 200" className="mx-auto h-44 w-44" role="img" aria-label={label}>
        <defs>
          <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--info)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--info)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g ref={gridRef}>
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
        </g>

        <path
          ref={sweepRef}
          d="M100 100 L190 100 A90 90 0 0 1 129 173 Z"
          fill="url(#radar-sweep)"
          style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
        />

        <g ref={blipsRef}>
          {dots.map((dot, index) => (
            <circle
              key={index}
              cx={dot.x * 200}
              cy={dot.y * 200}
              r="4"
              fill={TONE_VAR[dot.tone ?? "info"]}
            />
          ))}
        </g>
        <circle ref={coreRef} cx="100" cy="100" r="3" fill="var(--primary)" />
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
