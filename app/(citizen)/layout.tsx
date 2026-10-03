import { AppShell } from "@/components/layout/AppShell";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["CITIZEN"]);

  return (
    <AppShell role="CITIZEN" name={session.user.name} email={session.user.email}>
      {children}
    </AppShell>
  );
}
