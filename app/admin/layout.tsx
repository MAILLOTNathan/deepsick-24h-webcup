import { AppShell } from "@/components/layout/AppShell";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["ADMIN"]);

  return (
    <AppShell role="ADMIN" name={session.user.name} email={session.user.email}>
      {children}
    </AppShell>
  );
}
