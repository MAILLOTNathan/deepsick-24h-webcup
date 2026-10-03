import { AppShell } from "@/components/layout/AppShell";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["AGENT", "ADMIN"]);

  return (
    <AppShell role={session.user.role} name={session.user.name} email={session.user.email}>
      {children}
    </AppShell>
  );
}
