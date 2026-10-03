import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { getRequestById } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";
import { REQUEST_STATUS_LABELS, isRequestStatus } from "@/lib/roles";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export default async function CitizenRequestDetailPage({ params }: Params) {
  const session = await requirePageRole(["CITIZEN"]);
  const request = await getRequestById(params.id);

  // Ownership check: a citizen can only see their own requests.
  if (!request || request.authorId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/demandes" className="text-sm text-primary hover:underline">
        ← Mes demandes
      </Link>

      <div className="mt-4">
        <PageHeader
          title={request.subject}
          description={`Référence ${request.reference} · créée le ${formatDateTime(request.createdAt)}`}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <StatusBadge status={request.status} />
        <PriorityBadge priority={request.priority} />
        {request.category ? (
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {request.category}
          </span>
        ) : null}
        {request.assignee?.name ? (
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Agent : {request.assignee.name}
          </span>
        ) : null}
      </div>

      <Card className="mb-6">
        <h2 className="font-mono text-sm uppercase tracking-wide text-foreground">Description</h2>
        <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{request.description}</p>
      </Card>

      <Card>
        <h2 className="font-mono text-sm uppercase tracking-wide text-foreground">
          Suivi de la demande
        </h2>
        <ol className="mt-4 space-y-4">
          {request.history.map((event) => (
            <li key={event.id} className="border-l border-border pl-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={event.status} />
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDateTime(event.createdAt)}
                </span>
              </div>
              {event.note ? <p className="mt-1 text-sm text-muted-foreground">{event.note}</p> : null}
            </li>
          ))}
        </ol>
        {request.history.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {isRequestStatus(request.status)
              ? REQUEST_STATUS_LABELS[request.status]
              : request.status}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
