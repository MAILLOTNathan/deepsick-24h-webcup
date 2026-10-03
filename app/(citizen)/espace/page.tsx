import Link from "next/link";

import { Card, Stat } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buttonClasses } from "@/components/ui/Button";
import { getRequestsByAuthor } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";
import { ACTIONABLE_STATUSES } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon espace" };

export default async function CitizenSpacePage() {
  const session = await requirePageRole(["CITIZEN"]);
  const requests = await getRequestsByAuthor(session.user.id);

  const inProgress = requests.filter((request) => request.status === "IN_PROGRESS").length;
  const resolved = requests.filter(
    (request) => request.status === "RESOLVED" || request.status === "CLOSED",
  ).length;
  const toFollow = requests.filter((request) =>
    (ACTIONABLE_STATUSES as readonly string[]).includes(request.status),
  ).length;

  const recent = requests.slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Bonjour${session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        description="Retrouvez ici vos informations, vos demandes et les démarches disponibles."
        actions={
          <Link href="/demandes/nouvelle" className={buttonClasses("primary")}>
            Nouvelle demande
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Demandes" value={requests.length} />
        <Stat label="En traitement" value={inProgress} />
        <Stat label="À suivre" value={toFollow} hint="En attente d'une action" />
        <Stat label="Résolues" value={resolved} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-mono text-lg text-foreground">Mes demandes récentes</h2>
            <Link href="/demandes" className="text-sm text-primary hover:underline">
              Tout voir →
            </Link>
          </div>

          {recent.length === 0 ? (
            <EmptyState
              title="Aucune demande pour le moment"
              description="Créez votre première demande pour signaler un besoin à la ville."
            />
          ) : (
            <div className="space-y-3">
              {recent.map((request) => (
                <Link key={request.id} href={`/demandes/${request.id}`}>
                  <Card className="transition hover:border-primary/50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-mono text-sm text-foreground">{request.subject}</h3>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {request.reference} · {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <Card>
            <h2 className="font-mono text-sm uppercase tracking-wide text-foreground">
              Démarches rapides
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/demandes/nouvelle" className="text-primary hover:underline">
                  Créer une demande
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-primary hover:underline">
                  Parcourir les services
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="text-primary hover:underline">
                  Lire les annonces
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary hover:underline">
                  Contacter l'administration
                </Link>
              </li>
            </ul>
          </Card>

          <Card className="text-sm text-muted-foreground">
            <h2 className="font-mono text-sm uppercase tracking-wide text-foreground">
              Votre identité
            </h2>
            <p className="mt-3 text-foreground">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
