import { Badge } from "@/components/ui/Badge";
import {
  DIFFICULTY_TONES,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_TONES,
  isTicketStatus,
} from "@/lib/ticket-status";

/** Ticket workflow status (TODO → DONE). */
export function TicketStatusBadge({ status }: { status: string }) {
  const label = isTicketStatus(status) ? TICKET_STATUS_LABELS[status] : status;
  return <Badge tone={isTicketStatus(status) ? TICKET_STATUS_TONES[status] : "neutral"}>{label}</Badge>;
}

/** Webcup difficulty tier. */
export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return <Badge tone={DIFFICULTY_TONES[difficulty] ?? "neutral"}>{difficulty}</Badge>;
}

/** Fictional AI-related marker from the API. */
export function AiBadge() {
  return <Badge tone="info">IA</Badge>;
}
