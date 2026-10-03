import type { Metadata } from "next";
import Link from "next/link";

import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { StatTile } from "@/components/colony/StatTile";
import { Card } from "@/components/ui/Card";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { getStaffRequests } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().ops.administration.title };
}

export default async function AdministrationConsolePage() {
  const t = getDictionary();
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
        <h1 className="mt-1 font-mono text-xl text-foreground">{t.ops.administration.title}</h1>
        <p className="text-sm text-muted-foreground">{t.ops.administration.subtitle}</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatTile
          label={t.ops.administration.toProcess}
          value={actionable.length}
          hint={t.ops.administration.toProcessHint}
          tone="warning"
        />
        <StatTile
          label={t.ops.administration.inReview}
          value={inReview.length}
          hint={t.ops.administration.inReviewHint}
          tone="info"
        />
        <StatTile
          label={t.ops.administration.processed}
          value={resolved.length}
          hint={t.ops.administration.thisCycle}
          tone="success"
        />
      </div>

      <section>
        <SectionHeader
          title={t.ops.administration.queue}
          badge={<span className="font-mono text-[11px] text-muted-foreground">{requests.length}</span>}
        />
        {requests.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            {t.ops.administration.empty}
          </Card>
        ) : (
          <div className="space-y-2">
            {requests.map((request) => (
              <Link key={request.id} href={`/operations/administration/${request.id}`}>
                <FeedRow
                  title={`${request.reference} · ${request.subject}`}
                  meta={`${request.author?.name ?? t.common.colon} · ${formatDate(request.createdAt)}${
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
