import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedAnnouncements } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Annonces municipales" };

export default async function AnnouncementsPage() {
  const announcements = await getPublishedAnnouncements();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader
        title="Annonces municipales"
        description="Informations officielles, changements de service et actualités pratiques de la ville de Nova Terra."
      />

      {announcements.length === 0 ? (
        <EmptyState title="Aucune annonce publiée pour le moment" />
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Link key={announcement.id} href={`/announcements/${announcement.slug}`}>
              <Card className="transition hover:border-primary/50">
                <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {formatDate(announcement.publishedAt ?? announcement.createdAt)}
                </p>
                <h2 className="mt-2 font-mono text-lg text-foreground">{announcement.title}</h2>
                {announcement.excerpt ? (
                  <p className="mt-2 text-sm text-muted-foreground">{announcement.excerpt}</p>
                ) : null}
                <p className="mt-3 font-mono text-xs uppercase tracking-wide text-primary">
                  Lire l'annonce →
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
