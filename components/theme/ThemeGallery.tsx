"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";

import { ThemeSwatch } from "@/components/layout/ThemePicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/ui";

/** Full theme gallery — each card applies the theme on click. */
export function ThemeGallery() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const active = mounted ? theme : undefined;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {THEMES.map((candidate) => {
        const isActive = active === candidate.id;
        return (
          <Card
            key={candidate.id}
            className={cn("flex flex-col gap-4", isActive && "border-primary ring-2 ring-primary/30")}
          >
            <ThemeSwatch theme={candidate} className="h-24" />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-sm text-foreground">{candidate.label}</h2>
                <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  {candidate.scheme === "dark" ? "sombre" : "clair"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{candidate.description}</p>
            </div>

            <Button
              type="button"
              size="sm"
              variant={isActive ? "secondary" : "primary"}
              disabled={isActive}
              onClick={() => setTheme(candidate.id)}
            >
              {isActive ? (
                <>
                  <Check data-icon="inline-start" />
                  Thème actif
                </>
              ) : (
                "Appliquer"
              )}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
