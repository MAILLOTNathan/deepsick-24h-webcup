import Link from "next/link";

import { cn } from "@/lib/ui";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-md border border-primary/40 bg-primary/10 font-mono text-sm font-bold text-primary">
        NT
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-primary">
        Nova&nbsp;Terra
      </span>
      <span aria-hidden className="cursor-blink" />
    </Link>
  );
}
