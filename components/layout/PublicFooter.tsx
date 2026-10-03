import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs uppercase tracking-wide">
          <span aria-hidden className="mr-2 text-primary">
            //
          </span>
          Ville de Nova Terra — Plateforme citoyenne
        </p>
        <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wide">
          <Link href="/services" className="hover:text-primary">
            [ Services ]
          </Link>
          <Link href="/announcements" className="hover:text-primary">
            [ Annonces ]
          </Link>
          <Link href="/contact" className="hover:text-primary">
            [ Contact ]
          </Link>
          <Link href="/apparence" className="hover:text-primary">
            [ Apparence ]
          </Link>
        </div>
      </div>
    </footer>
  );
}
