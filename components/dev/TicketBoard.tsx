"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { StatTile } from "@/components/colony/StatTile";
import { AiBadge, DifficultyBadge, TicketStatusBadge } from "@/components/dev/TicketBadges";
import { EmptyState } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/client";
import { format } from "@/lib/i18n/format";
import type { TicketRowDto } from "@/lib/serialize";
import { DIFFICULTIES, TICKET_STATUSES } from "@/lib/ticket-status";
import { cn } from "@/lib/ui";

type View = "list" | "board";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Ticketing view over the Webcup needs: stats, filters, list and board. */
export function TicketBoard({ tickets }: { tickets: TicketRowDto[] }) {
  const t = useT();
  const [view, setView] = useState<View>("list");
  const [status, setStatus] = useState<string>("ALL");
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const value of TICKET_STATUSES) {
      result[value] = tickets.filter((ticket) => ticket.status === value).length;
    }
    return result;
  }, [tickets]);

  const xpTotal = tickets.reduce((sum, ticket) => sum + ticket.xp, 0);
  const xpDone = tickets
    .filter((ticket) => ticket.status === "DONE")
    .reduce((sum, ticket) => sum + ticket.xp, 0);
  const doneRatio = tickets.length ? Math.round((counts.DONE / tickets.length) * 100) : 0;

  const visible = useMemo(
    () =>
      tickets.filter((ticket) => {
        if (status !== "ALL" && ticket.status !== status) return false;
        if (difficulty !== "ALL" && ticket.difficulty !== difficulty) return false;
        if (query) {
          const haystack = `${ticket.code} ${ticket.title} ${ticket.assignee ?? ""} ${ticket.group ?? ""}`.toLowerCase();
          if (!haystack.includes(query.toLowerCase())) return false;
        }
        return true;
      }),
    [tickets, status, difficulty, query],
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile
          label={t.dev.board.tickets}
          value={tickets.length}
          hint={format(t.dev.board.todoHint, { count: counts.TODO })}
          tone="primary"
        />
        <StatTile
          label={t.dev.board.inProgress}
          value={counts.IN_PROGRESS}
          hint={format(t.dev.board.blockedHint, { count: counts.BLOCKED })}
          tone="info"
        />
        <StatTile
          label={t.dev.board.review}
          value={counts.REVIEW}
          hint={t.dev.board.reviewHint}
          tone="warning"
        />
        <StatTile
          label={t.dev.board.done}
          value={counts.DONE}
          hint={`${doneRatio}%`}
          tone="success"
        />
        <StatTile
          label={t.dev.board.xp}
          value={`${xpDone}/${xpTotal}`}
          hint={t.dev.board.xpHint}
          tone="primary"
        />
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              {t.dev.board.status}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip active={status === "ALL"} onClick={() => setStatus("ALL")}>
                {format(t.dev.board.all, { count: tickets.length })}
              </Chip>
              {TICKET_STATUSES.map((value) => (
                <Chip key={value} active={status === value} onClick={() => setStatus(value)}>
                  {`${t.ticketStatus[value]} (${counts[value]})`}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              {t.dev.board.difficulty}
            </p>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="mt-2 h-8 rounded-md border border-input bg-transparent px-2 font-mono text-xs text-foreground"
            >
              <option value="ALL">{t.dev.board.allDifficulties}</option>
              {DIFFICULTIES.map((value) => (
                <option key={value} value={value}>
                  {(t.difficulty as Record<string, string>)[value] ?? value}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-40 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              {t.dev.board.search}
            </p>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.dev.board.searchPlaceholder}
              className="mt-2 h-8 w-full rounded-md border border-input bg-transparent px-2 font-mono text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-1 rounded-md border border-border p-1">
            <Chip active={view === "list"} onClick={() => setView("list")}>
              {t.dev.board.list}
            </Chip>
            <Chip active={view === "board"} onClick={() => setView("board")}>
              {t.dev.board.boardView}
            </Chip>
          </div>
        </div>
      </Card>

      {visible.length === 0 ? (
        <EmptyState title={t.dev.board.empty} description={t.dev.board.emptyHint} />
      ) : view === "list" ? (
        <div className="space-y-2">
          {visible.map((ticket) => (
            <Link key={ticket.code} href={`/dev/tickets/${ticket.code}`}>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition hover:border-primary/50">
                <span className="w-14 shrink-0 font-mono text-xs text-primary">{ticket.code}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm text-foreground">{ticket.title}</p>
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {[
                      ticket.group,
                      `${ticket.xp} XP`,
                      ticket.assignee
                        ? format(t.dev.board.assigned, { name: ticket.assignee })
                        : t.dev.board.unassigned,
                      ticket.commentCount
                        ? format(t.dev.board.comments, { count: ticket.commentCount })
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {ticket.isAi ? <AiBadge /> : null}
                  <DifficultyBadge difficulty={ticket.difficulty} />
                  <TicketStatusBadge status={ticket.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TICKET_STATUSES.map((column) => {
            const items = visible.filter((ticket) => ticket.status === column);
            return (
              <div key={column} className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t.ticketStatus[column]} · {items.length}
                </p>
                {items.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border p-3 text-center font-mono text-[10px] text-muted-foreground">
                    {t.dev.board.columnEmpty}
                  </p>
                ) : (
                  items.map((ticket) => (
                    <Link key={ticket.code} href={`/dev/tickets/${ticket.code}`}>
                      <Card size="sm" className="mb-2 gap-1 p-3 transition hover:border-primary/50">
                        <p className="font-mono text-[10px] text-primary">{ticket.code}</p>
                        <p className="font-mono text-xs leading-snug text-foreground">
                          {ticket.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          {ticket.isAi ? <AiBadge /> : null}
                          <DifficultyBadge difficulty={ticket.difficulty} />
                        </div>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
