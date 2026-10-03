import Link from "next/link";
import { notFound } from "next/navigation";

import { AgentStatusForm } from "@/components/agent/AgentStatusForm";
import { Card } from "@/components/ui/Card";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { getRequestById } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export default async function AgentRequestDetailPage({ params }: Params) {
  await requirePageRole(["AGENT", "ADMIN"]);
  const request = await getRequestById(params.id);
  if (!request) notFound();

  return (
    <div>
      <Link href="/agents/demandes" className="text-sm text-mars hover:underline">
        ← Toutes les demandes
      </Link>

      <div className="mt-4 mb-6 border-b border-border/60 pb-5">
        <h1 className="font-mono text-2xl text-slate-100">{request.subject}</h1>
        <p className="mt-1 font-mono text-xs text-slate-500">
          {request.reference} · créée le {formatDateTime(request.createdAt)}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
          {request.category ? (
            <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
              {request.category}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-mono text-sm uppercase tracking-wide text-slate-200">
              Description de l'habitant
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm text-slate-300">
              {request.description}
            </p>
          </Card>

          <Card>
            <h2 className="font-mono text-sm uppercase tracking-wide text-slate-200">
              Historique
            </h2>
            <ol className="mt-4 space-y-4">
              {request.history.map((event) => (
                <li key={event.id} className="border-l border-border/60 pl-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={event.status} />
                    <span className="font-mono text-xs text-slate-500">
                      {formatDateTime(event.createdAt)}
                    </span>
                  </div>
                  {event.note ? <p className="mt-1 text-sm text-slate-400">{event.note}</p> : null}
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-mono text-sm uppercase tracking-wide text-slate-200">Habitant</h2>
            <p className="mt-3 text-sm text-slate-200">{request.author?.name ?? "—"}</p>
            <p className="text-xs text-slate-500">{request.author?.email}</p>
            {request.assignee?.name ? (
              <p className="mt-3 font-mono text-xs uppercase tracking-wide text-slate-500">
                Assignée à {request.assignee.name}
              </p>
            ) : null}
          </Card>

          <Card>
            <h2 className="mb-4 font-mono text-sm uppercase tracking-wide text-slate-200">
              Traitement
            </h2>
            <AgentStatusForm
              requestId={request.id}
              status={request.status}
              hasAssignee={Boolean(request.assigneeId)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
