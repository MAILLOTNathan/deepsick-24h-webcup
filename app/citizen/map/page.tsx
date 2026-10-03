import type { Metadata } from "next";

import { RadarCard } from "@/components/colony/RadarCard";
import { SectionHeader } from "@/components/colony/FeedRow";
import { Card } from "@/components/ui/Card";
import { getDictionary } from "@/lib/i18n/server";
import { requirePageRole } from "@/lib/permissions";
import { COLONY_SECTORS } from "@/lib/roles";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().citizen.map.title };
}

export default async function CitizenMapPage() {
  const t = getDictionary();
  await requirePageRole(["CITIZEN"]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-mono text-xl text-foreground">{t.citizen.map.title}</h1>
        <p className="text-sm text-muted-foreground">{t.citizen.map.subtitle}</p>
      </header>

      <RadarCard
        label="ARC-01 · Utopia Planitia"
        caption={`${COLONY_SECTORS.length} · ${t.common.scanning}`}
        blips={[
          { x: 0.36, y: 0.42, tone: "info" },
          { x: 0.6, y: 0.58, tone: "success" },
          { x: 0.48, y: 0.31, tone: "warning" },
          { x: 0.68, y: 0.38, tone: "info" },
        ]}
      />

      <Card className="p-4">
        <SectionHeader title={t.citizen.map.sectors} />
        <ul className="grid gap-2 sm:grid-cols-2">
          {COLONY_SECTORS.map((sector) => (
            <li
              key={sector}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-xs text-foreground"
            >
              <span className="inline-block size-1.5 rounded-full bg-[var(--info)]" />
              {sector}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
