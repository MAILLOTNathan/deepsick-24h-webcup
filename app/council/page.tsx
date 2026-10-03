import Link from "next/link";

import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { StatTile } from "@/components/colony/StatTile";
import { Card } from "@/components/ui/Card";
import { ReportStatusBadge } from "@/components/ui/StatusBadge";
import { getCouncilStats, getReports } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";
import { REPORT_TYPE_LABELS, isReportType } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Haut Conseil" };

export default async function CouncilPage() {
  await requirePageRole(["COUNCIL"]);
  const [stats, reports] = await Promise.all([getCouncilStats(), getReports()]);

  const byType = reports.reduce<Record<string, number>>((acc, report) => {
    acc[report.type] = (acc[report.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          PILOTAGE · TERRA NOVA
        </p>
        <h1 className="mt-1 font-mono text-xl text-foreground">Vue d'ensemble de la colonie</h1>
        <p className="text-sm text-muted-foreground">
          Incidents, interventions, services et activité économique simulée.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Ouverts" value={stats.openReports} hint="signalements" tone="danger" />
        <StatTile label="En cours" value={stats.inProgress} hint="interventions" tone="info" />
        <StatTile label="Services" value={stats.services} hint="publiés" tone="primary" />
        <StatTile label="Annonces" value={stats.announcements} hint="publiées" tone="primary" />
        <StatTile label="Colons" value={stats.users} hint="comptes" tone="success" />
        <StatTile label="Commandes" value={stats.orders} hint="taxi + repas" tone="warning" />
      </div>

      <Card className="p-4">
        <SectionHeader title="Répartition par service" />
        <div className="flex flex-wrap gap-2">
          {Object.entries(byType).map(([type, count]) => (
            <span
              key={type}
              className="rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-foreground"
            >
              {isReportType(type) ? REPORT_TYPE_LABELS[type] : type} · {count}
            </span>
          ))}
        </div>
      </Card>

      <section>
        <SectionHeader
          title="Signalements récents"
          action={
            <Link href="/council/users" className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline">
              Gérer les comptes →
            </Link>
          }
        />
        <div className="space-y-2">
          {reports.slice(0, 8).map((report) => (
            <FeedRow
              key={report.id}
              title={`${report.reference} · ${report.title}`}
              meta={[report.sector, report.author?.name, formatDate(report.createdAt)]
                .filter(Boolean)
                .join(" · ")}
              trailing={<ReportStatusBadge status={report.status} />}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Outils développeur" />
        <Link href="/dev/tickets">
          <Card size="sm" className="gap-1 p-4 transition hover:border-primary/50">
            <p className="font-mono text-sm text-foreground">🎫 Panneau des tickets Webcup</p>
            <p className="text-xs text-muted-foreground">
              Suivre les besoins publiés par l'API, les assigner et synchroniser les vagues.
            </p>
          </Card>
        </Link>
      </section>
    </div>
  );
}
