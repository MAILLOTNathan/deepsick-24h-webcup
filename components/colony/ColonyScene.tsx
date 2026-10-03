import { cn } from "@/lib/ui";

/**
 * Stylised "colony window" scene used as the hero artwork on the landing page
 * and the login panel. Pure CSS — no bitmap assets.
 */
export function ColonyScene({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none relative overflow-hidden", className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 72% 12%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 58%), linear-gradient(180deg, #070b14 0%, #121a29 55%, #080c15 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 18% 26%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 64% 18%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 82% 58%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 34% 72%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 52% 40%, rgba(255,255,255,0.5), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklch, var(--primary) 22%, #05070c) 65%, #05070c 100%)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-44 w-72 -translate-x-1/2 -translate-y-1/2 rounded-t-[100%] border border-white/20 bg-white/[0.04]" />
      <div className="absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-t-[100%] border border-white/15 bg-white/[0.03]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
    </div>
  );
}
