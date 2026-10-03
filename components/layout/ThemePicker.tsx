"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Palette } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { buttonClasses } from "@/components/ui/Button";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/ui";

/** Compact theme chooser for headers and shells. */
export function ThemePicker({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const active = mounted ? theme : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Choisir un thème"
          className={buttonClasses("ghost", "sm", className)}
        >
          <Palette data-icon="inline-start" />
          <span className="sr-only">Choisir un thème</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Thème de l&apos;interface
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setTheme("system")} className="gap-3">
          <Monitor className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm">Système</span>
          {active === "system" ? <Check className="size-4 shrink-0" /> : null}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {THEMES.map((candidate) => {
          const isActive = active === candidate.id;
          return (
            <DropdownMenuItem
              key={candidate.id}
              onSelect={() => setTheme(candidate.id)}
              className="gap-3"
            >
              <span
                className="flex size-5 shrink-0 overflow-hidden rounded-sm border border-border"
                aria-hidden
              >
                <span className="h-full w-1/2" style={{ background: candidate.swatch.background }} />
                <span className="h-full w-1/2" style={{ background: candidate.swatch.primary }} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm">{candidate.label}</span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {candidate.description}
                </span>
              </span>
              {isActive ? <Check className="size-4 shrink-0" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Inline swatch preview reused by the appearance gallery. */
export function ThemeSwatch({
  theme,
  className,
}: {
  theme: (typeof THEMES)[number];
  className?: string;
}) {
  return (
    <span className={cn("flex overflow-hidden rounded-md border border-border", className)} aria-hidden>
      <span className="flex-1 p-3" style={{ background: theme.swatch.background }}>
        <span className="block h-2.5 w-12 rounded-sm" style={{ background: theme.swatch.primary }} />
        <span
          className="mt-2 block h-2 w-20 rounded-sm opacity-70"
          style={{ background: theme.swatch.card }}
        />
        <span
          className="mt-2 block h-2 w-14 rounded-sm opacity-50"
          style={{ background: theme.swatch.info }}
        />
      </span>
      <span className="w-14" style={{ background: theme.swatch.card }} />
    </span>
  );
}
