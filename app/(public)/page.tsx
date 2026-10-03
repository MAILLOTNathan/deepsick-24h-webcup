import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPublishedAnnouncements, getPublishedServices } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getAuthSession } from "@/lib/permissions";
import { homeForRole, REQUEST_STATUSES, REQUEST_STATUS_LABELS } from "@/lib/roles";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  {
    href: "/services",
    icon: "🏛️",
    title: "Services municipaux",
    description: "Trouvez le service correspondant à votre besoin.",
  },
  {
    href: "/announcements",
    icon: "📣",
    title: "Annonces officielles",
    description: "Suivez l'actualité et les informations pratiques de la ville.",
  },
  {
    href: "/contact",
    icon: "✉️",
    title: "Contacter la mairie",
    description: "Une question ? Transmettez un message et recevez une référence.",
  },
  {
    href: "/demandes",
    icon: "📋",
    title: "Suivre mes demandes",
    description: "Créez une demande et suivez son avancement en temps réel.",
  },
];

export default async function HomePage() {
  const [session, services, announcements] = await Promise.all([
    getAuthSession(),
    getPublishedServices(),
    getPublishedAnnouncements(),
  ]);

  const featuredServices = services.slice(0, 3);
  const latestAnnouncements = announcements.slice(0, 2);
  const spaceHref = session?.user ? homeForRole(session.user.role) : "/register";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="rounded-2xl border border-border bg-muted/40 p-8 md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Ville de Nova Terra
        </p>
        <h1 className="mt-4 max-w-3xl font-mono text-3xl leading-tight text-foreground md:text-5xl">
          Vos services municipaux, réunis sur une seule plateforme.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Créez votre compte, découvrez les services de la ville, consultez les annonces
          officielles, contactez l'administration et suivez vos demandes jusqu'à leur résolution.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={spaceHref} className={buttonClasses("primary")}>
            {session?.user ? "Accéder à mon espace" : "Créer mon compte"}
          </Link>
          <Link href="/services" className={buttonClasses("secondary")}>
            Découvrir les services
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-10">
        <h2 className="font-mono text-lg text-foreground">Que souhaitez-vous faire ?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href} className="group">
              <Card className="h-full transition group-hover:border-primary/50">
                <span className="text-2xl" aria-hidden>
                  {action.icon}
                </span>
                <h3 className="mt-3 font-mono text-sm text-foreground group-hover:text-primary">
                  {action.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-mono text-lg text-foreground">Services les plus consultés</h2>
          <Link href="/services" className="text-sm text-primary hover:underline">
            Tous les services →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {featuredServices.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="group">
              <Card className="h-full transition group-hover:border-primary/50">
                <div className="flex items-center gap-2">
                  <span aria-hidden>{service.icon ?? "🏛️"}</span>
                  <h3 className="font-mono text-sm text-foreground">{service.name}</h3>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{service.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Announcements preview */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-mono text-lg text-foreground">Dernières annonces</h2>
          <Link href="/announcements" className="text-sm text-primary hover:underline">
            Toutes les annonces →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {latestAnnouncements.map((announcement) => (
            <Link key={announcement.id} href={`/announcements/${announcement.slug}`}>
              <Card className="h-full transition hover:border-primary/50">
                <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {formatDate(announcement.publishedAt ?? announcement.createdAt)}
                </p>
                <h3 className="mt-2 font-mono text-base text-foreground">{announcement.title}</h3>
                {announcement.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{announcement.excerpt}</p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Request lifecycle */}
      <section className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
        <h2 className="font-mono text-lg text-foreground">Comment vos demandes avancent-elles ?</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Chaque demande soumise est prise en charge par les agents municipaux et progresse dans un
          cycle de vie transparent.
        </p>
        <ol className="mt-5 flex flex-wrap items-center gap-2">
          {REQUEST_STATUSES.map((status, index) => (
            <li key={status} className="flex items-center gap-2">
              <StatusBadge status={status} />
              {index < REQUEST_STATUSES.length - 1 ? (
                <span className="text-muted-foreground" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          {REQUEST_STATUSES.map((status) => REQUEST_STATUS_LABELS[status]).join(" · ")}
        </p>
      </section>
    </div>
  );
}
