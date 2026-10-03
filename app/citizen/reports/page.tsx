import Link from "next/link";

import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { Alert } from "@/components/ui/Alert";
import { buttonClasses } from "@/components/ui/Button";
import { ReportPriorityBadge, ReportStatusBadge } from "@/components/ui/StatusBadge";
import { getReports } from "@/lib/data";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes signalements" };

export default async function CitizenReportsPage({
  searchParams,
}: {
  searchParams: { cree?: string };
}) {
  const session = await requirePageRole(["CITIZEN"]);
  const reports = await getReports({ authorId: session.user.id });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-xl text-foreground">Mes signalements</h1>
          <p className="text-sm text-muted-foreground">
            Suivez chaque incident, de l'ouverture à la clôture.
          </p>
        </div>
        <Link href="/citizen/report" className={buttonClasses("primary", "sm")}>
          Nouveau signalement
        </Link>
      </div>

      {searchParams.cree === "1" ? (
        <Alert tone="success" className="mb-4">
          Signalement transmis. Le service compétent en a été notifié.
        </Alert>
      ) : null}

      <SectionHeader
        title="Historique"
        badge={<span className="font-mono text-[11px] text-muted-foreground">{reports.length}</span>}
      />

      {reports.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Aucun signalement pour le moment.
        </p>
      ) : (
        <div className="space-y-2">
          {reports.map((report) => (
            <Link key={report.id} href={`/citizen/reports/${report.id}`}>
              <FeedRow
                title={`${report.reference} · ${report.title}`}
                meta={[report.sector, report.assignee?.name ?? "non affecté"]
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
    </div>
  );
}
