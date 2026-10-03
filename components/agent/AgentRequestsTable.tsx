"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";
import { ACTIONABLE_STATUSES, REQUEST_STATUSES } from "@/lib/roles";
import type { RequestRowDto } from "@/lib/serialize";

type Filter = "all" | "actionable";

export function AgentRequestsTable({ initialRequests }: { initialRequests: RequestRowDto[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<Filter>("actionable");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function refresh() {
      try {
        const response = await fetch("/api/requests", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { requests: RequestRowDto[] };
        setRequests(data.requests);
      } catch {
        // Ignore transient errors; next tick retries.
      }
    }

    const interval = setInterval(refresh, 5000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const visible = useMemo(() => {
    const actionable = new Set<string>(ACTIONABLE_STATUSES as readonly string[]);
    return requests.filter((request) => {
      if (filter === "actionable" && !actionable.has(request.status)) return false;
      if (statusFilter !== "ALL" && request.status !== statusFilter) return false;
      if (query) {
        const haystack = `${request.reference} ${request.subject} ${request.authorName ?? ""}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [requests, filter, statusFilter, query]);

  const actionableCount = requests.filter((request) =>
    (ACTIONABLE_STATUSES as readonly string[]).includes(request.status),
  ).length;

  return (
    <div>
      <Card className="mb-5 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-slate-400">Afficher</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setFilter("actionable")}
                className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition ${
                  filter === "actionable"
                    ? "border-mars/50 bg-mars/10 text-mars"
                    : "border-border/60 text-slate-300 hover:bg-surface"
                }`}
              >
                À traiter ({actionableCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition ${
                  filter === "all"
                    ? "border-mars/50 bg-mars/10 text-mars"
                    : "border-border/60 text-slate-300 hover:bg-surface"
                }`}
              >
                Toutes ({requests.length})
              </button>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-slate-400">Statut</p>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-2 rounded-md border border-border/60 bg-background/70 px-3 py-1.5 text-sm text-slate-100"
            >
              <option value="ALL">Tous les statuts</option>
              {REQUEST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-48 flex-1">
            <p className="font-mono text-xs uppercase tracking-wide text-slate-400">Recherche</p>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Référence, objet, habitant…"
              className="mt-2 w-full rounded-md border border-border/60 bg-background/70 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>
      </Card>

      {visible.length === 0 ? (
        <EmptyState
          title="Aucune demande à afficher"
          description="Ajustez les filtres ou attendez de nouvelles demandes."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((request) => (
            <Link key={request.id} href={`/agents/demandes/${request.id}`}>
              <Card className="transition hover:border-mars/50">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-mono text-sm text-slate-100">
                      {request.subject}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      {request.reference} · {request.authorName ?? "Habitant"} ·{" "}
                      {formatDate(request.createdAt)}
                      {request.assigneeName ? ` · ${request.assigneeName}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <PriorityBadge priority={request.priority} />
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-5 font-mono text-xs uppercase tracking-wide text-slate-600">
        Actualisation automatique toutes les 5 secondes
      </p>
    </div>
  );
}
