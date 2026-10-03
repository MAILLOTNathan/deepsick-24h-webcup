"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import { RoleBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/ui";

type NavItem = { href: string; label: string; icon: string };

const NAV: Record<string, NavItem[]> = {
  CITIZEN: [
    { href: "/espace", label: "Mon espace", icon: "▸" },
    { href: "/demandes", label: "Mes demandes", icon: "▤" },
    { href: "/demandes/nouvelle", label: "Nouvelle demande", icon: "+" },
  ],
  AGENT: [
    { href: "/agents", label: "Tableau de bord", icon: "▸" },
    { href: "/agents/demandes", label: "Demandes", icon: "▤" },
  ],
  ADMIN: [
    { href: "/admin", label: "Vue d'ensemble", icon: "▸" },
    { href: "/admin/services", label: "Services", icon: "▤" },
    { href: "/admin/announcements", label: "Annonces", icon: "▤" },
    { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "▤" },
  ],
};

const AREA_LABELS: Record<string, string> = {
  CITIZEN: "Espace citoyen",
  AGENT: "Espace agents",
  ADMIN: "Administration",
};

export function AppShell({
  role,
  name,
  email,
  children,
}: {
  role: string;
  name?: string | null;
  email?: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV[role] ?? [];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Logo href={items[0]?.href ?? "/"} />
            <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              {AREA_LABELS[role] ?? "Espace"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm text-foreground">{name ?? email}</p>
              <div className="mt-0.5 flex justify-end">
                <RoleBadge role={role} />
              </div>
            </div>
            <ThemeToggle />
            <Link href="/" className={buttonClasses("ghost", "sm")}>
              Site public
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className={buttonClasses("secondary", "sm")}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 font-mono text-xs uppercase tracking-wide transition",
                  isActive(item.href)
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span aria-hidden className="text-primary/70">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <nav className="mb-4 flex flex-wrap gap-2 lg:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wide",
                  isActive(item.href)
                    ? "bg-muted text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
