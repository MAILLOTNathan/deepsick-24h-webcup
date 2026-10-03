import Link from "next/link";

import { cn } from "@/lib/ui";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-md bg-mars font-mono text-sm font-bold text-background">
        NT
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-100 group-hover:text-mars">
        Nova&nbsp;Terra
      </span>
    </Link>
  );
}
