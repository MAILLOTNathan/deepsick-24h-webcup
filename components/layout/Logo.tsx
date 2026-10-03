import Link from "next/link";

import { cn } from "@/lib/ui";

/** Circular colony mark, as in the ui-v1 design. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-full border-2 border-primary">
        <span className="size-3 rounded-full bg-primary" />
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-primary">
        Terra&nbsp;Nova
      </span>
    </Link>
  );
}
