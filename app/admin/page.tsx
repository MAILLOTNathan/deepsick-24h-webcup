import Link from "next/link";

import { Card, Stat } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClasses } from "@/components/ui/Button";
import { getContactMessages, getPlatformStats } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administration" };

export default async function AdminHomePage() {
  await requirePageRole(["ADMIN"]);
  const [stats, messages] = await Promise.all([getPlatformStats(), getContactMessages()]);

  return (
    <div>
      <PageHeader
        title="Vue d'ensemble"
        description="Pilotez les services, les annonces, les comptes et l'activité de la plateforme."
        actions={
          <>
            <Link href="/admin/services" className={buttonClasses("secondary", "sm")}>
              Services
            </Link>
            <Link href="/admin/announcements" className={buttonClasses("secondary", "sm")}>
              Annonces
            </Link>
            <Link href="/admin/utilisateurs" className={buttonClasses("primary", "sm")}>
              Utilisateurs
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Demandes" value={stats.requests} hint={`${stats.actionable} à traiter`} />
        <Stat label="Habitants" value={stats.citizens} hint={`${stats.agents} agents`} />
        <Stat label="Services publiés" value={stats.services} />
        <Stat label="Annonces publiées" value={stats.announcements} />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-mono text-lg text-slate-100">Messages des habitants</h2>
          <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
            {stats.contacts} au total
          </span>
        </div>

        {messages.length === 0 ? (
          <EmptyState title="Aucun message reçu" />
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 6).map((message) => (
              <Card key={message.id} className="p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-mono text-sm text-slate-100">
                      {message.subject}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {message.email} · {formatDateTime(message.createdAt)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">{message.body}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-slate-500">
                    {message.reference}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
