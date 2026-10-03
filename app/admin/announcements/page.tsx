import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { toggleAnnouncementAction } from "@/lib/actions/admin";
import { getAllAnnouncements } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gérer les annonces" };

export default async function AdminAnnouncementsPage() {
  await requirePageRole(["ADMIN"]);
  const announcements = await getAllAnnouncements();

  return (
    <div>
      <PageHeader
        title="Annonces municipales"
        description="Rédigez et publiez les communications officielles de la ville."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
        <Card>
          <h2 className="mb-4 font-mono text-sm uppercase tracking-wide text-slate-200">
            Nouvelle annonce
          </h2>
          <AnnouncementForm />
        </Card>

        <section>
          <h2 className="mb-4 font-mono text-sm uppercase tracking-wide text-slate-200">
            Annonces ({announcements.length})
          </h2>

          {announcements.length === 0 ? (
            <EmptyState title="Aucune annonce" description="Rédigez la première communication." />
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-mono text-sm text-slate-100">{announcement.title}</h3>
                        <Badge tone={announcement.published ? "success" : "neutral"}>
                          {announcement.published ? "Publiée" : "Brouillon"}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                        {announcement.excerpt ?? announcement.body}
                      </p>
                      <p className="mt-2 font-mono text-xs text-slate-500">
                        {formatDate(announcement.publishedAt ?? announcement.createdAt)}
                        {announcement.author?.name ? ` · ${announcement.author.name}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {announcement.published ? (
                        <Link
                          href={`/announcements/${announcement.slug}`}
                          className="font-mono text-xs uppercase tracking-wide text-mars hover:underline"
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
          )}
        </section>
      </div>
    </div>
  );
}
