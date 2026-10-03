import Link from "next/link";

import { ColonyScene } from "@/components/colony/ColonyScene";
import { SectionHeader } from "@/components/colony/FeedRow";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { ReportStatusBadge } from "@/components/ui/StatusBadge";
import { colonyClock, COLONY_ARC, COLONY_POPULATION, COLONY_STATUS } from "@/lib/colony";
import { getPublishedAnnouncements, getPublishedServices } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getAuthSession } from "@/lib/permissions";
import { homeForRole, REPORT_STATUSES } from "@/lib/roles";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { href: "/citizen/report", icon: "⚠️", title: "Signaler un incident", description: "Sécurité, médical, maintenance ou propreté." },
  { href: "/citizen/orders", icon: "🚡", title: "Commander un service", description: "Rover Hermes ou repas Mercator." },
  { href: "/services/demarches", icon: "📄", title: "Démarches", description: "Permis, autorisations et documents." },
  { href: "/announcements", icon: "📣", title: "Annonces du Conseil", description: "Informations officielles de la ville." },
];

export default async function LandingPage() {
  const [session, services, announcements] = await Promise.all([
    getAuthSession(),
    getPublishedServices(),
    getPublishedAnnouncements(),
  ]);

  const spaceHref = session?.user ? homeForRole(session.user.role) : "/register";
  const featuredServices = services.slice(0, 4);
  const latestAnnouncements = announcements.slice(0, 2);

  return (
    <div>
      {/* Hero — mirrors the desktop frame of the ui-v1 design */}
      <section className="relative border-b border-border">
        <ColonyScene className="absolute inset-0" />
        <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col justify-between px-4 py-6">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em]">
            <span className="text-foreground">Terra Nova</span>
            <span className="text-muted-foreground">Mars Civic OS · 01</span>
          </div>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--info)]/40 bg-[var(--info)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--info)]">
              {COLONY_ARC}
            </span>
            <h1 className="mt-4 font-mono text-3xl leading-tight text-foreground md:text-5xl">
              Une seule ville. Un seul système. Un nouveau monde.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Services civiques connectés pour les {COLONY_POPULATION} habitants qui construisent
              l&apos;avenir permanent de l&apos;humanité sur Mars.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={spaceHref} className={buttonClasses("primary")}>
                {session?.user ? "Accéder à mon espace" : "Créer mon identité colon"}
              </Link>
              <Link href="/services" className={buttonClasses("secondary")}>
                Découvrir les services
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>{colonyClock()}</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[var(--chart-3)]" />
              {COLONY_STATUS}
            </span>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeader title="Que souhaitez-vous faire ?" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card size="sm" className="h-full gap-2 p-4 transition hover:border-primary/50">
                <span aria-hidden className="text-xl">
                  {action.icon}
                </span>
                <p className="font-mono text-sm text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <SectionHeader
          title="Réseau civique"
          action={
            <Link href="/services" className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline">
              Tous les services →
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}>
              <Card size="sm" className="h-full gap-2 p-4 transition hover:border-primary/50">
                <span aria-hidden className="text-xl">
                  {service.icon ?? "🏛️"}
                </span>
                <p className="font-mono text-sm text-foreground">{service.name}</p>
                <p className="line-clamp-3 text-xs text-muted-foreground">{service.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <SectionHeader
          title="Dernières annonces"
          action={
            <Link href="/announcements" className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline">
              Toutes les annonces →
            </Link>
          }
        />
        <div className="grid gap-3 md:grid-cols-2">
          {latestAnnouncements.map((announcement) => (
            <Link key={announcement.id} href={`/announcements/${announcement.slug}`}>
              <Card size="sm" className="h-full gap-2 p-4 transition hover:border-primary/50">
                <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  {formatDate(announcement.publishedAt ?? announcement.createdAt)}
                </p>
                <p className="font-mono text-sm text-foreground">{announcement.title}</p>
                {announcement.excerpt ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{announcement.excerpt}</p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Signalement lifecycle */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <Card className="p-6">
          <SectionHeader title="Du signalement à la clôture" />
          <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
            Un colon signale, le service compétent prend en charge, intervient et clôture. Le suivi
            est visible des deux côtés.
          </p>
          <ol className="flex flex-wrap items-center gap-2">
            {REPORT_STATUSES.map((status, index) => (
              <li key={status} className="flex items-center gap-2">
                <ReportStatusBadge status={status} />
                {index < REPORT_STATUSES.length - 1 ? (
                  <span className="text-muted-foreground" aria-hidden>
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}
