import { ConsoleShell } from "@/components/colony/ConsoleShell";
import { requireDevPanel } from "@/lib/dev-access";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/dev/tickets", label: "Tickets", icon: "🎫" },
  { href: "/apparence", label: "Apparence", icon: "🎨" },
];

export default async function DevLayout({ children }: { children: React.ReactNode }) {
  await requireDevPanel();

  return (
    <ConsoleShell station="DEV · WEBCUP CONSOLE" nav={NAV}>
      {children}
    </ConsoleShell>
  );
}
