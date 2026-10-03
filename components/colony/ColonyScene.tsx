"use client";

import { useRef } from "react";

import { animate, stagger } from "animejs";

import { EASE_INOUT, EASE_SOFT, prefersReducedMotion, useMotionLayoutEffect, type Motion } from "@/lib/motion";
import { cn } from "@/lib/ui";

/** Three independent star fields, so the sky can twinkle in layers. */
const STAR_LAYERS = [
  "radial-gradient(1px 1px at 18% 26%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 52% 40%, rgba(255,255,255,0.5), transparent)",
  "radial-gradient(1px 1px at 64% 18%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 34% 72%, rgba(255,255,255,0.6), transparent)",
  "radial-gradient(1px 1px at 82% 58%, rgba(255,255,255,0.8), transparent)",
];

/**
 * Stylised "colony window" scene used as the hero artwork on the landing page
 * and the login panel. Pure CSS — no bitmap assets.
 *
 * Motion: the star fields twinkle, the domes drift slowly and the skyline
 * follows the pointer for a subtle parallax. Everything is disabled when the
 * visitor prefers reduced motion.
 */
export function ColonyScene({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const domeRef = useRef<HTMLDivElement>(null);
  const innerDomeRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);

  // Ambient loop — twinkling sky, drifting domes, breathing horizon.
  useMotionLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const stars = starsRef.current ? Array.from(starsRef.current.children) : [];
    const animations: Motion[] = [];

    if (stars.length > 0) {
      animations.push(
        animate(stars, {
          opacity: [0.3, 1],
          duration: 2600,
          loop: true,
          alternate: true,
          ease: EASE_INOUT,
          delay: stagger(900),
        }),
      );
    }

    if (domeRef.current) {
      animations.push(
        animate(domeRef.current, {
          translateY: [-5, 5],
          duration: 5600,
          loop: true,
          alternate: true,
          ease: EASE_INOUT,
        }),
      );
    }

    if (innerDomeRef.current) {
      animations.push(
        animate(innerDomeRef.current, {
          translateY: [4, -4],
          duration: 6600,
          loop: true,
          alternate: true,
          ease: EASE_INOUT,
        }),
      );
    }

    if (horizonRef.current) {
      animations.push(
        animate(horizonRef.current, {
          opacity: [0.45, 1],
          duration: 3400,
          loop: true,
          alternate: true,
          ease: EASE_INOUT,
        }),
      );
    }

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, []);

  // Pointer parallax on the skyline — throttled to one animation per frame.
  // The scene itself is `pointer-events-none`, so the listener lives on the
  // window and the offset is normalised against the scene's own box.
  useMotionLayoutEffect(() => {
    const root = rootRef.current;
    const skyline = skylineRef.current;
    if (!root || !skyline || prefersReducedMotion()) return;

    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = root.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 26;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
        animate(skyline, { translateX: x, translateY: y, duration: 900, ease: EASE_SOFT });
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("pointer-events-none relative overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 72% 12%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 58%), linear-gradient(180deg, #070b14 0%, #121a29 55%, #080c15 100%)",
        }}
      />
      <div ref={starsRef} className="absolute inset-0">
        {STAR_LAYERS.map((layer, index) => (
          <div key={index} className="absolute inset-0" style={{ backgroundImage: layer }} />
        ))}
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklch, var(--primary) 22%, #05070c) 65%, #05070c 100%)",
        }}
      />

      <div ref={skylineRef} className="absolute inset-0">
        <div
          ref={domeRef}
          className="absolute left-1/2 top-1/2 h-44 w-72 -translate-x-1/2 -translate-y-1/2 rounded-t-[100%] border border-white/20 bg-white/[0.04]"
        />
        <div
          ref={innerDomeRef}
          className="absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-t-[100%] border border-white/15 bg-white/[0.03]"
        />
        <div ref={horizonRef} className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
      </div>
    </div>
  );
}
