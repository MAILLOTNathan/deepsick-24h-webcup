import Link from "next/link";

import { cn } from "@/lib/ui";

/** Circular colony mark, as in the ui-v1 design. */
export function Logo({
  className,
  href = "/",
  tone = "default",
}: {
  className?: string;
  href?: string;
  /** `scene` keeps the mark readable when drawn over the dark colony scene. */
  tone?: "default" | "scene";
}) {
  const overScene = tone === "scene";

  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-full border-2",
          overScene ? "border-scene-primary" : "border-primary",
        )}
      >
        <span
          className={cn("size-3 rounded-full", overScene ? "bg-scene-primary" : "bg-primary")}
        />
      </span>
      <span
        className={cn(
          "font-mono text-sm font-semibold uppercase tracking-[0.2em]",
          overScene
            ? "text-scene-foreground group-hover:text-scene-primary"
            : "text-foreground group-hover:text-primary",
        )}
      >
        Terra&nbsp;Nova
      </span>
    </Link>
  );
}
