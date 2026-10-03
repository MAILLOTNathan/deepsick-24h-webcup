import type { Metadata } from "next";
import Link from "next/link";

import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { AnnouncementForm } from "@/components/colony/AnnouncementForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toggleAnnouncementAction } from "@/lib/actions/admin";
import { getAllAnnouncements } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().council.announcements.title };
}

export default async function CouncilAnnouncementsPage() {
  const t = getDictionary();
  await requirePageRole(["COUNCIL"]);
  const announcements = await getAllAnnouncements();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-mono text-xl text-foreground">{t.council.announcements.title}</h1>
        <p className="text-sm text-muted-foreground">{t.council.announcements.subtitle}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr,1.3fr]">
        <Card className="p-4">
          <SectionHeader title={t.council.announcements.newAnnouncement} />
          <AnnouncementForm />
        </Card>

        <section>
          <SectionHeader
            title={t.council.announcements.list}
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
                      announcement.author?.name ?? t.common.none
                    }`}
                  />
                  <div className="flex items-center gap-2">
                    <Badge tone={announcement.published ? "success" : "neutral"}>
                      {announcement.published
                        ? t.council.announcements.published
                        : t.council.announcements.draft}
                    </Badge>
                    {announcement.published ? (
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline"
                      >
                        {t.council.announcements.view}
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
                        {announcement.published
                          ? t.council.announcements.unpublish
                          : t.council.announcements.publish}
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
