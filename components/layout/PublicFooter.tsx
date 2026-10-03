import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs uppercase tracking-wide">
          Ville de Nova Terra — Plateforme citoyenne
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/services" className="hover:text-mars">
            Services
          </Link>
          <Link href="/announcements" className="hover:text-mars">
            Annonces
          </Link>
          <Link href="/contact" className="hover:text-mars">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
