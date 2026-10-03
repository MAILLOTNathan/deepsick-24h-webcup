"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, Stat } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import type { ActivityDto, StatsDto } from "@/lib/serialize";
import { formatDateTime } from "@/lib/format";

const KIND_ICONS: Record<string, string> = {
  request: "📋",
  contact: "✉️",
  announcement: "📣",
};

export function AgentDashboard({
  initialStats,
  initialActivity,
}: {
  initialStats: StatsDto;
  initialActivity: ActivityDto[];
}) {
  const [stats, setStats] = useState(initialStats);
  const [activity, setActivity] = useState(initialActivity);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function refresh() {
      try {
        const response = await fetch("/api/agent/activity", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { stats: StatsDto; activity: ActivityDto[] };
        setStats(data.stats);
        setActivity(data.activity);
        setUpdatedAt(new Date().toISOString());
      } catch {
        // Network hiccups are ignored — the next tick retries.
      }
    }

    const interval = setInterval(refresh, 5000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl text-foreground">Activité de la plateforme</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Flux transmis par l'API Nova Terra, actualisé automatiquement.
          </p>
        </div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {updatedAt ? `Actualisé à ${formatDateTime(updatedAt)}` : "Synchronisation…"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Demandes" value={stats.requests} />
        <Stat label="À traiter" value={stats.actionable} hint="Nécessitent une action" />
        <Stat label="Habitants" value={stats.citizens} />
        <Stat label="Messages reçus" value={stats.contacts} />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-mono text-lg text-foreground">Dernière activité</h2>
          <Link href="/agents/demandes" className="text-sm text-primary hover:underline">
            Voir les demandes →
          </Link>
        </div>

        {activity.length === 0 ? (
          <EmptyState title="Aucune activité pour le moment" />
        ) : (
          <ul className="space-y-2">
            {activity.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>
                  <Card className="flex items-center gap-4 p-4 transition hover:border-primary/50">
                    <span className="text-xl" aria-hidden>
                      {KIND_ICONS[item.kind] ?? "•"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-sm text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
                      {formatDateTime(item.date)}
                    </span>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
