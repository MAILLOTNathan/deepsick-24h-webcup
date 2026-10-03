import { redirect } from "next/navigation";

import { ConsoleShell, type ConsoleNavItem } from "@/components/colony/ConsoleShell";
import { requirePageRole } from "@/lib/permissions";
import { STAFF_ROLES, STATION_NAMES, homeForRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

type NavConfig = { home: string; nav: ConsoleNavItem[] };

const NAV_BY_ROLE: Record<string, NavConfig> = {
  SECURITY: {
    home: "/operations/security",
    nav: [{ href: "/operations/security", label: "Opérations", icon: "🛡️" }],
  },
  MEDIC: {
    home: "/operations/medical",
    nav: [{ href: "/operations/medical", label: "Urgences", icon: "✚" }],
  },
  MAINTENANCE: {
    home: "/operations/maintenance",
    nav: [{ href: "/operations/maintenance", label: "Maintenance", icon: "🛠️" }],
  },
  DRIVER: {
    home: "/operations/transport",
    nav: [{ href: "/operations/transport", label: "Courses", icon: "🚡" }],
  },
  MERCHANT: {
    home: "/operations/commerce",
    nav: [{ href: "/operations/commerce", label: "Commandes", icon: "🍜" }],
  },
  ADMIN_AGENT: {
    home: "/operations/administration",
    nav: [{ href: "/operations/administration", label: "Démarches", icon: "📄" }],
  },
  COUNCIL: {
    home: "/council",
    nav: [
      { href: "/council", label: "Vue d'ensemble", icon: "🛰️" },
      { href: "/council/users", label: "Comptes", icon: "👥" },
      { href: "/council/announcements", label: "Annonces", icon: "📣" },
    ],
  },
};

export default async function OperationsLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(STAFF_ROLES);
  const config = NAV_BY_ROLE[session.user.role];

  if (!config) redirect(homeForRole(session.user.role));

  return (
    <ConsoleShell station={STATION_NAMES[session.user.role] ?? "Terra Nova"} nav={config.nav}>
      {children}
    </ConsoleShell>
  );
}
