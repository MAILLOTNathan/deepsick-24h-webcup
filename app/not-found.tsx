import Link from "next/link";

import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-mars">Erreur 404</p>
      <h1 className="mt-4 font-mono text-3xl text-slate-100">Page introuvable</h1>
      <p className="mt-3 max-w-md text-sm text-slate-400">
        La ressource demandée n'existe pas ou n'est plus disponible sur la plateforme de Nova Terra.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClasses("primary")}>
          Retour à l'accueil
        </Link>
        <Link href="/services" className={buttonClasses("secondary")}>
          Voir les services
        </Link>
      </div>
    </div>
  );
}
