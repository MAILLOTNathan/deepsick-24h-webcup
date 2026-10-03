import { ConsoleShell, type ConsoleNavItem } from "@/components/colony/ConsoleShell";
import { getUnreadNotificationCount } from "@/lib/data";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const NAV: ConsoleNavItem[] = [
  { href: "/citizen", label: "Accueil", icon: "🏠" },
  { href: "/citizen/report", label: "Signaler", icon: "⚠️" },
  { href: "/citizen/reports", label: "Signalements", icon: "📋" },
  { href: "/citizen/orders", label: "Commandes", icon: "🎫" },
  { href: "/citizen/wallet", label: "Portefeuille", icon: "◈" },
  { href: "/citizen/map", label: "Carte", icon: "🗺️" },
];

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["CITIZEN"]);
  const unread = await getUnreadNotificationCount(session.user.id);

  return (
    <ConsoleShell
      station="Terra Nova · Résident"
      nav={NAV}
      unread={unread}
      bellHref="/citizen/notifications"
    >
      {children}
    </ConsoleShell>
  );
}
