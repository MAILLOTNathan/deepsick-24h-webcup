import { ConsoleShell } from "@/components/colony/ConsoleShell";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/council", label: "Vue d'ensemble", icon: "🛰️" },
  { href: "/council/users", label: "Comptes", icon: "👥" },
  { href: "/council/announcements", label: "Annonces", icon: "📣" },
  { href: "/council/services", label: "Services", icon: "🏛️" },
];

export default async function CouncilLayout({ children }: { children: React.ReactNode }) {
  await requirePageRole(["COUNCIL"]);

  return (
    <ConsoleShell station="HAUT CONSEIL DE NOVA TERRA" nav={NAV}>
      {children}
    </ConsoleShell>
  );
}
