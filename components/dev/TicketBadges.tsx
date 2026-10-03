"use client";

import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/client";
import { DIFFICULTY_TONES, TICKET_STATUS_TONES, isTicketStatus } from "@/lib/ticket-status";

/** Ticket workflow status (TODO → DONE). */
export function TicketStatusBadge({ status }: { status: string }) {
  const t = useT();
  const label = isTicketStatus(status) ? t.ticketStatus[status] : status;
  return (
    <Badge tone={isTicketStatus(status) ? TICKET_STATUS_TONES[status] : "neutral"}>{label}</Badge>
  );
}

/** Webcup difficulty tier. */
export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const t = useT();
  const label = (t.difficulty as Record<string, string>)[difficulty] ?? difficulty;
  return <Badge tone={DIFFICULTY_TONES[difficulty] ?? "neutral"}>{label}</Badge>;
}

/** Fictional AI-related marker from the API. */
export function AiBadge() {
  const t = useT();
  return <Badge tone="info">{t.dev.ai}</Badge>;
}
