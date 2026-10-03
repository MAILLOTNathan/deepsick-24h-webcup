import Link from "next/link";

import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { AnnouncementForm } from "@/components/colony/AnnouncementForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toggleAnnouncementAction } from "@/lib/actions/admin";
import { getAllAnnouncements } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Annonces du Conseil" };

export default async function CouncilAnnouncementsPage() {
  await requirePageRole(["COUNCIL"]);
  const announcements = await getAllAnnouncements();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-mono text-xl text-foreground">Annonces officielles</h1>
        <p className="text-sm text-muted-foreground">
          Rédigez et publiez les communications du Haut Conseil.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr,1.3fr]">
        <Card className="p-4">
          <SectionHeader title="Nouvelle annonce" />
          <AnnouncementForm />
        </Card>

        <section>
          <SectionHeader
            title="Publiées & brouillons"
            badge={<span className="font-mono text-[11px] text-muted-foreground">{announcements.length}</span>}
          />
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FeedRow
                    className="flex-1 border-0 bg-transparent p-0"
                    title={announcement.title}
                    meta={`${formatDate(announcement.publishedAt ?? announcement.createdAt)} · ${
                      announcement.author?.name ?? "—"
                    }`}
                  />
                  <div className="flex items-center gap-2">
                    <Badge tone={announcement.published ? "success" : "neutral"}>
                      {announcement.published ? "Publiée" : "Brouillon"}
                    </Badge>
                    {announcement.published ? (
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline"
                      >
                        Voir
                      </Link>
                    ) : null}
                    <form action={toggleAnnouncementAction}>
                      <input type="hidden" name="id" value={announcement.id} />
                      <input
                        type="hidden"
                        name="published"
                        value={announcement.published ? "false" : "true"}
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        {announcement.published ? "Dépublier" : "Publier"}
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
