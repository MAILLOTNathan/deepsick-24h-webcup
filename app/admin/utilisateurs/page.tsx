import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { RoleBadge } from "@/components/ui/StatusBadge";
import { setUserRoleAction } from "@/lib/actions/admin";
import { getUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";
import { ROLES, ROLE_LABELS } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gérer les utilisateurs" };

export default async function AdminUsersPage() {
  const session = await requirePageRole(["ADMIN"]);
  const users = await getUsers();

  return (
    <div>
      <PageHeader
        title="Comptes & droits d'accès"
        description="Attribuez les rôles qui déterminent les outils accessibles à chaque profil."
      />

      {users.length === 0 ? (
        <EmptyState title="Aucun utilisateur" />
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const isSelf = user.id === session.user.id;
            return (
              <Card key={user.id} className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-mono text-sm text-foreground">
                        {user.name ?? "Sans nom"}
                      </h3>
                      <RoleBadge role={user.role} />
                      {isSelf ? (
                        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                          Vous
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.email} · inscrit le {formatDate(user.createdAt)}
                    </p>
                  </div>

                  {isSelf ? (
                    <p className="text-xs text-muted-foreground">
                      Vous ne pouvez pas modifier votre propre rôle.
                    </p>
                  ) : (
                    <form action={setUserRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" variant="secondary" size="sm">
                        Mettre à jour
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
