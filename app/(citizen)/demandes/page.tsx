import Link from "next/link";

import { Alert, EmptyState } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { getRequestsByAuthor } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes demandes" };

export default async function MyRequestsPage({
  searchParams,
}: {
  searchParams: { creee?: string };
}) {
  const session = await requirePageRole(["CITIZEN"]);
  const requests = await getRequestsByAuthor(session.user.id);

  return (
    <div>
      <PageHeader
        title="Mes demandes"
        description="Suivez l'avancement de chaque demande, de la soumission à la résolution."
        actions={
          <Link href="/demandes/nouvelle" className={buttonClasses("primary")}>
            Nouvelle demande
          </Link>
        }
      />

      {searchParams.creee === "1" ? (
        <Alert tone="success" className="mb-5">
          Votre demande a bien été enregistrée. Vous pouvez suivre son avancement ci-dessous.
        </Alert>
      ) : null}

      {requests.length === 0 ? (
        <EmptyState
          title="Aucune demande enregistrée"
          description="Créez une demande pour signaler un besoin à la ville de Nova Terra."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Link key={request.id} href={`/demandes/${request.id}`}>
              <Card className="transition hover:border-mars/50">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-mono text-sm text-slate-100">
                      {request.subject}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      {request.reference} · {formatDate(request.createdAt)}
                      {request.assignee?.name ? ` · Agent : ${request.assignee.name}` : ""}
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
    </div>
  );
}
