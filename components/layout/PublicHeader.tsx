"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { Logo } from "@/components/layout/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { homeForRole } from "@/lib/roles";
import { cn } from "@/lib/ui";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/announcements", label: "Annonces" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader({
  user,
}: {
  user: { name?: string | null; role: string } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 font-mono text-xs uppercase tracking-wide transition",
                isActive(link.href)
                  ? "bg-surface text-mars"
                  : "text-slate-300 hover:bg-surface hover:text-slate-100",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href={homeForRole(user.role)} className={buttonClasses("secondary", "sm")}>
                Mon espace
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={buttonClasses("ghost", "sm")}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonClasses("ghost", "sm")}>
                Connexion
              </Link>
              <Link href="/register" className={buttonClasses("primary", "sm")}>
                Créer un compte
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((value) => !value)}
          className={buttonClasses("secondary", "sm", "md:hidden")}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/60 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-wide text-slate-300 hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {user ? (
              <>
                <Link href={homeForRole(user.role)} className={buttonClasses("secondary", "sm")}>
                  Mon espace
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={buttonClasses("ghost", "sm")}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={buttonClasses("ghost", "sm")}>
                  Connexion
                </Link>
                <Link href="/register" className={buttonClasses("primary", "sm")}>
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
