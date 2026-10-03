import { colonyClock, COLONY_STATUS } from "@/lib/colony";

/** The thin colony status strip used across the console screens. */
export function StatusStrip({ status = COLONY_STATUS }: { status?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      <span>{colonyClock()}</span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-1.5 rounded-full bg-[var(--chart-3)]" />
        {status}
      </span>
    </div>
  );
}
