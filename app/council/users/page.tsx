import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RoleBadge } from "@/components/ui/StatusBadge";
import { setUserRoleAction } from "@/lib/actions/admin";
import { getUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";
import { ROLES, ROLE_LABELS } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Comptes & rôles" };

export default async function CouncilUsersPage() {
  const session = await requirePageRole(["COUNCIL"]);
  const users = await getUsers();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-mono text-xl text-foreground">Comptes & rôles</h1>
        <p className="text-sm text-muted-foreground">
          Attribuez les habilitations qui déterminent la vue et les actions de chaque colon.
        </p>
      </header>

      <SectionHeader
        title="Colons"
        badge={<span className="font-mono text-[11px] text-muted-foreground">{users.length}</span>}
      />

      <div className="space-y-2">
        {users.map((user) => {
          const isSelf = user.id === session.user.id;
          return (
            <Card key={user.id} className="p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <FeedRow
                  className="flex-1 border-0 bg-transparent p-0"
                  title={user.name ?? "Sans nom"}
                  meta={`${user.email} · inscrit le ${formatDate(user.createdAt)}`}
                  trailing={<RoleBadge role={user.role} />}
                />

                {isSelf ? (
                  <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    Vous
                  </span>
                ) : (
                  <form action={setUserRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="h-8 w-auto rounded-md border border-input bg-transparent px-2 font-mono text-xs text-foreground"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary" size="sm">
                      Maj
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
