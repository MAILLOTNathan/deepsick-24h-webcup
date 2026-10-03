"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FeedRow, LiveBadge, SectionHeader } from "@/components/colony/FeedRow";
import { RadarCard } from "@/components/colony/RadarCard";
import { StatTile } from "@/components/colony/StatTile";
import { EmptyState } from "@/components/ui/Alert";
import { ReportPriorityBadge, ReportStatusBadge } from "@/components/ui/StatusBadge";
import { REPORT_ACTIONABLE } from "@/lib/roles";
import type { ReportRowDto } from "@/lib/serialize";

type Chip = "ALL" | "CRITICAL" | "ACTION" | "DONE";

const CHIPS: { key: Chip; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "CRITICAL", label: "Critiques" },
  { key: "ACTION", label: "À traiter" },
  { key: "DONE", label: "Résolus" },
];

/**
 * Live incident console shared by the security, medical and maintenance
 * stations: filter chips, four metric tiles, a radar and the incident feed.
 */
export function IncidentConsole({
  title,
  subtitle,
  station,
  reports,
  detailBase,
}: {
  title: string;
  subtitle: string;
  station: string;
  reports: ReportRowDto[];
  detailBase: string;
}) {
  const [chip, setChip] = useState<Chip>("ACTION");
  const router = useRouter();

  // Short polling (~5 s) so the console stays live during the demo.
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(interval);
  }, [router]);

  const actionable = useMemo(
    () => new Set<string>(REPORT_ACTIONABLE as readonly string[]),
    [],
  );

  const counts = useMemo(() => {
    const critical = reports.filter((r) => r.priority === "CRITICAL" && actionable.has(r.status)).length;
    const open = reports.filter((r) => r.status === "OPEN").length;
    const active = reports.filter((r) => r.status === "IN_PROGRESS" || r.status === "EN_ROUTE").length;
    const done = reports.filter((r) => !actionable.has(r.status)).length;
    return { critical, open, active, done, actionableTotal: reports.filter((r) => actionable.has(r.status)).length };
  }, [reports, actionable]);

  const visible = useMemo(() => {
    return reports.filter((report) => {
      if (chip === "CRITICAL") return report.priority === "CRITICAL" && actionable.has(report.status);
      if (chip === "ACTION") return actionable.has(report.status);
      if (chip === "DONE") return !actionable.has(report.status);
      return true;
    });
  }, [reports, chip, actionable]);

  const blips = reports.slice(0, 5).map((report, index) => ({
    x: 0.28 + ((index * 0.13) % 0.5),
    y: 0.3 + ((index * 0.17) % 0.45),
    tone: (report.priority === "CRITICAL"
      ? "danger"
      : report.status === "CLOSED" || report.status === "RESOLVED"
        ? "success"
        : "info") as "danger" | "success" | "info",
  }));

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {station}
          </p>
          <LiveBadge />
        </div>
        <h1 className="mt-1 font-mono text-xl text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {CHIPS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setChip(item.key)}
            className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition ${
              chip === item.key
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="À traiter" value={counts.actionableTotal} hint={`${counts.open} ouverts`} tone="danger" />
        <StatTile label="Critiques" value={counts.critical} hint="priorité maximale" tone="danger" />
        <StatTile label="Engagés" value={counts.active} hint="en route / en cours" tone="info" />
        <StatTile label="Résolus" value={counts.done} hint="ce cycle" tone="success" />
      </div>

      <RadarCard
        label={`${station} · Secteur actif`}
        caption="Balayage en direct · données simulées"
        blips={blips}
      />

      <section>
        <SectionHeader
          title="Journal des incidents"
          badge={<LiveBadge label={`${visible.length} actifs`} />}
        />

        {visible.length === 0 ? (
          <EmptyState title="Aucun incident sur ce filtre" description="Ajustez les filtres ci-dessus." />
        ) : (
          <div className="space-y-2">
            {visible.map((report) => (
              <Link key={report.id} href={`${detailBase}/${report.id}`}>
                <FeedRow
                  title={`${report.reference} · ${report.title}`}
                  meta={[report.sector, report.authorName, report.assigneeName ? `→ ${report.assigneeName}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                  trailing={
                    <div className="flex items-center gap-1.5">
                      <ReportPriorityBadge priority={report.priority} />
                      <ReportStatusBadge status={report.status} />
                    </div>
                  }
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        Actualisation automatique toutes les 5 secondes
      </p>
    </div>
  );
}
