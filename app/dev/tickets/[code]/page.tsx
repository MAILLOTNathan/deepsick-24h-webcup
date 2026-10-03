import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/colony/FeedRow";
import { AiBadge, DifficultyBadge, TicketStatusBadge } from "@/components/dev/TicketBadges";
import { TicketCommentForm, TicketUpdateForm } from "@/components/dev/TicketForms";
import { Card } from "@/components/ui/Card";
import { requireDevPanel } from "@/lib/dev-access";
import { formatDateTime } from "@/lib/format";
import { format, getDictionary } from "@/lib/i18n/server";
import { getTicketByCode } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function DevTicketPage({ params }: { params: { code: string } }) {
  const t = getDictionary();
  await requireDevPanel();

  const ticket = await getTicketByCode(params.code);
  if (!ticket) notFound();

  const metadata: Array<[string, string, string?]> = [
    [
      t.dev.board.difficulty,
      (t.difficulty as Record<string, string>)[ticket.difficulty] ?? ticket.difficulty,
      format(t.dev.detail.level, { level: ticket.level }),
    ],
    [t.dev.board.xp, `${ticket.xp}`, t.dev.detail.reward],
    [t.dev.detail.group, ticket.group ?? t.common.none, t.dev.detail.waveOrigin],
    [t.dev.detail.wave, ticket.wave === null ? t.common.none : `#${ticket.wave}`],
    [t.dev.detail.requester, ticket.requester ?? t.common.none, ticket.requesterType ?? undefined],
    [t.dev.detail.synced, formatDateTime(ticket.syncedAt)],
  ];

  return (
    <div className="space-y-5">
      <Link
        href="/dev/tickets"
        className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline"
      >
        {t.dev.detail.back}
      </Link>

      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {ticket.code} · {ticket.group ?? t.dev.nav.tickets}
        </p>
        <h1 className="mt-1 font-mono text-xl text-foreground">{ticket.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <TicketStatusBadge status={ticket.status} />
          <DifficultyBadge difficulty={ticket.difficulty} />
          {ticket.isAi ? <AiBadge /> : null}
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {ticket.assignee
              ? format(t.dev.detail.assignedTo, { name: ticket.assignee })
              : t.dev.detail.unassigned}
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-4">
          <Card className="p-4">
            <SectionHeader title={t.dev.detail.description} />
            <p className="whitespace-pre-line text-sm text-foreground">{ticket.description}</p>
          </Card>

          <Card className="p-4">
            <SectionHeader
              title={t.dev.detail.activity}
              badge={
                <span className="font-mono text-[11px] text-muted-foreground">
                  {ticket.comments.length}
                </span>
              }
            />
            {ticket.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.dev.detail.noActivity}</p>
            ) : (
              <ol className="space-y-3">
                {ticket.comments.map((comment) => (
                  <li key={comment.id} className="border-l border-border pl-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wide text-foreground">
                        {comment.author}
                      </span>
                      {comment.kind === "EVENT" ? (
                        <span className="font-mono text-[10px] uppercase tracking-wide text-primary">
                          {t.dev.detail.event}
                        </span>
                      ) : null}
                      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{comment.body}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <SectionHeader title={t.dev.detail.processing} />
            <TicketUpdateForm
              code={ticket.code}
              status={ticket.status}
              assignee={ticket.assignee}
            />
          </Card>

          <Card className="p-4">
            <SectionHeader title={t.dev.detail.addNote} />
            <TicketCommentForm code={ticket.code} />
          </Card>

          <Card className="p-4">
            <SectionHeader title={t.dev.detail.metadata} />
            <dl className="space-y-2">
              {metadata.map(([label, value, hint]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-right font-mono text-xs text-foreground">
                    {value}
                    {hint ? <span className="text-muted-foreground"> · {hint}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
