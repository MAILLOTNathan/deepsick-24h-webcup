import Link from "next/link";

import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { StatTile } from "@/components/colony/StatTile";
import { Card } from "@/components/ui/Card";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { getStaffRequests } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Démarches administratives" };

export default async function AdministrationConsolePage() {
  await requirePageRole(["ADMIN_AGENT", "COUNCIL"]);
  const requests = await getStaffRequests();

  const actionable = requests.filter((request) =>
    ["SUBMITTED", "IN_REVIEW", "IN_PROGRESS"].includes(request.status),
  );
  const inReview = requests.filter((request) => request.status === "IN_REVIEW");
  const resolved = requests.filter((request) =>
    ["RESOLVED", "CLOSED"].includes(request.status),
  );

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          BUREAU DES DÉMARCHES
        </p>
        <h1 className="mt-1 font-mono text-xl text-foreground">Démarches des colons</h1>
        <p className="text-sm text-muted-foreground">
          Permis, autorisations et documents — instruction et réponse officielle.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="À traiter" value={actionable.length} hint="file d'attente" tone="warning" />
        <StatTile label="En examen" value={inReview.length} hint="instruction" tone="info" />
        <StatTile label="Traitées" value={resolved.length} hint="ce cycle" tone="success" />
      </div>

      <section>
        <SectionHeader
          title="File des demandes"
          badge={<span className="font-mono text-[11px] text-muted-foreground">{requests.length}</span>}
        />
        {requests.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">Aucune demande.</Card>
        ) : (
          <div className="space-y-2">
            {requests.map((request) => (
              <Link key={request.id} href={`/operations/administration/${request.id}`}>
                <FeedRow
                  title={`${request.reference} · ${request.subject}`}
                  meta={`${request.author?.name ?? "Colon"} · ${formatDate(request.createdAt)}${
                    request.category ? ` · ${request.category}` : ""
                  }`}
                  trailing={
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={request.priority} />
                      <StatusBadge status={request.status} />
                    </div>
                  }
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
