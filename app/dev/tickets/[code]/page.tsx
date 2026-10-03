import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/colony/FeedRow";
import { AiBadge, DifficultyBadge, TicketStatusBadge } from "@/components/dev/TicketBadges";
import { TicketCommentForm, TicketUpdateForm } from "@/components/dev/TicketForms";
import { Card } from "@/components/ui/Card";
import { requireDevPanel } from "@/lib/dev-access";
import { formatDateTime } from "@/lib/format";
import { getTicketByCode } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function DevTicketPage({ params }: { params: { code: string } }) {
  await requireDevPanel();

  const ticket = await getTicketByCode(params.code);
  if (!ticket) notFound();

  const metadata: Array<[string, string, string?]> = [
    ["Difficulté", ticket.difficulty, `niveau ${ticket.level}`],
    ["XP", `${ticket.xp}`, "récompense"],
    ["Groupe", ticket.group ?? "—", "vague d'origine"],
    ["Vague", ticket.wave === null ? "—" : `#${ticket.wave}`],
    ["Demandeur", ticket.requester ?? "—", ticket.requesterType ?? undefined],
    ["Synchronisé", formatDateTime(ticket.syncedAt)],
  ];

  return (
    <div className="space-y-5">
      <Link
        href="/dev/tickets"
        className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline"
      >
        ← Tous les tickets
      </Link>

      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {ticket.code} · {ticket.group ?? "Besoins"}
        </p>
        <h1 className="mt-1 font-mono text-xl text-foreground">{ticket.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <TicketStatusBadge status={ticket.status} />
          <DifficultyBadge difficulty={ticket.difficulty} />
          {ticket.isAi ? <AiBadge /> : null}
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {ticket.assignee ? `Assigné à ${ticket.assignee}` : "Non assigné"}
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-4">
          <Card className="p-4">
            <SectionHeader title="Description officielle (API Webcup)" />
            <p className="whitespace-pre-line text-sm text-foreground">{ticket.description}</p>
          </Card>

          <Card className="p-4">
            <SectionHeader
              title="Activité"
              badge={
                <span className="font-mono text-[11px] text-muted-foreground">
                  {ticket.comments.length}
                </span>
              }
            />
            {ticket.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune activité pour l'instant.</p>
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
                          événement
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
            <SectionHeader title="Traitement" />
            <TicketUpdateForm
              code={ticket.code}
              status={ticket.status}
              assignee={ticket.assignee}
            />
          </Card>

          <Card className="p-4">
            <SectionHeader title="Ajouter une note" />
            <TicketCommentForm code={ticket.code} />
          </Card>

          <Card className="p-4">
            <SectionHeader title="Métadonnées" />
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
