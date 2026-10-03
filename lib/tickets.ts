import "server-only";

import { prisma } from "@/lib/prisma";
import { DIFFICULTY_ORDER, TICKET_STATUSES, isTicketStatus, ticketTitle } from "@/lib/ticket-status";

/* ------------------------------------------------------------------ *
 * Webcup API client
 * ------------------------------------------------------------------ */

const DEFAULT_API_URL = "https://24h.webcup.fr/wp-json/webcup/v1/requests";

export const WEBCUP_API_URL = process.env.WEBCUP_API_URL ?? DEFAULT_API_URL;

export function isWebcupConfigured(): boolean {
  return Boolean(process.env.WEBCUP_API_KEY);
}

export type WebcupRequest = {
  request_code: string;
  message_public?: string;
  difficulty?: string;
  difficulty_level?: number;
  xp_available?: number;
  xp_total?: number;
  group_name?: string;
  requester_name?: string;
  requester_type?: string;
  wave_number?: number | null;
  visible_since_wave?: number | null;
  is_ai_request?: boolean;
  is_ai_related?: boolean;
  sort_order?: number;
};

export type WebcupSession = {
  status?: string;
  is_running?: boolean;
  current_wave?: number;
  visible_requests_count?: number;
  next_wave_number?: number;
  minutes_until_next_wave?: number;
};

export type WebcupPayload = { session?: WebcupSession; requests?: WebcupRequest[] };

async function fetchNeeds(): Promise<WebcupPayload> {
  const apiKey = process.env.WEBCUP_API_KEY;
  if (!apiKey) {
    throw new Error(
      "WEBCUP_API_KEY n'est pas configurée. Renseignez-la dans .env (ou via le wrapper scripts) puis réessayez.",
    );
  }

  const response = await fetch(WEBCUP_API_URL, {
    headers: { "X-Webcup-Api-Key": apiKey, Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`L'API Webcup a répondu ${response.status} ${response.statusText}.`);
  }

  return (await response.json()) as WebcupPayload;
}

/* ------------------------------------------------------------------ *
 * Sync — API fields only; local status/assignee are preserved
 * ------------------------------------------------------------------ */

export type SyncResult = {
  fetched: number;
  created: number;
  updated: number;
  session: WebcupSession | null;
};

export async function syncTickets(): Promise<SyncResult> {
  const payload = await fetchNeeds();
  const requests = payload.requests ?? [];
  let created = 0;
  let updated = 0;

  for (const request of requests) {
    if (!request.request_code) continue;

    const code = request.request_code;
    const message = request.message_public ?? "";
    const data = {
      title: ticketTitle(code, message),
      description: message.trim(),
      difficulty: request.difficulty ?? "Facile",
      level: request.difficulty_level ?? DIFFICULTY_ORDER[request.difficulty ?? "Facile"] ?? 1,
      xp: request.xp_available ?? request.xp_total ?? 0,
      group: request.group_name ?? null,
      requester: request.requester_name ?? null,
      requesterType: request.requester_type ?? null,
      wave: request.wave_number ?? request.visible_since_wave ?? null,
      isAi: Boolean(request.is_ai_request ?? request.is_ai_related),
      sortOrder: request.sort_order ?? 0,
      syncedAt: new Date(),
    };

    const existing = await prisma.ticket.findUnique({ where: { code } });
    if (existing) {
      await prisma.ticket.update({ where: { code }, data });
      updated += 1;
    } else {
      await prisma.ticket.create({
        data: { code, ...data, status: "TODO" },
      });
      created += 1;
    }
  }

  return { fetched: requests.length, created, updated, session: payload.session ?? null };
}

/* ------------------------------------------------------------------ *
 * Queries
 * ------------------------------------------------------------------ */

export function getTickets() {
  return prisma.ticket.findMany({
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    include: { _count: { select: { comments: true } } },
  });
}

export function getTicketByCode(code: string) {
  return prisma.ticket.findUnique({
    where: { code },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });
}

export async function getTicketStats() {
  const tickets = await prisma.ticket.findMany({ select: { status: true, xp: true } });

  const byStatus = TICKET_STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = tickets.filter((ticket) => ticket.status === status).length;
    return acc;
  }, {});

  const xpTotal = tickets.reduce((sum, ticket) => sum + ticket.xp, 0);
  const done = tickets.filter((ticket) => ticket.status === "DONE");
  const xpDone = done.reduce((sum, ticket) => sum + ticket.xp, 0);

  return { total: tickets.length, byStatus, xpTotal, xpDone, doneCount: done.length };
}

/* ------------------------------------------------------------------ *
 * Mutations
 * ------------------------------------------------------------------ */

export async function updateTicket(
  code: string,
  input: { status?: string; assignee?: string | null },
  actor: string,
) {
  const existing = await prisma.ticket.findUnique({ where: { code } });
  if (!existing) throw new Error("Ticket introuvable.");

  const changes: string[] = [];

  if (input.status && isTicketStatus(input.status) && input.status !== existing.status) {
    changes.push(`statut ${existing.status} → ${input.status}`);
  }
  if (input.assignee !== undefined && (input.assignee || null) !== existing.assignee) {
    changes.push(`assigné à ${input.assignee ? input.assignee : "personne"}`);
  }

  const ticket = await prisma.ticket.update({
    where: { code },
    data: {
      ...(input.status && isTicketStatus(input.status) ? { status: input.status } : {}),
      ...(input.assignee !== undefined ? { assignee: input.assignee?.trim() || null } : {}),
    },
  });

  if (changes.length > 0) {
    await prisma.ticketComment.create({
      data: { ticketId: ticket.id, author: actor, kind: "EVENT", body: changes.join(" · ") },
    });
  }

  return ticket;
}

export async function addTicketComment(code: string, body: string, author: string) {
  const ticket = await prisma.ticket.findUnique({ where: { code } });
  if (!ticket) throw new Error("Ticket introuvable.");

  return prisma.ticketComment.create({
    data: { ticketId: ticket.id, author, body: body.trim(), kind: "COMMENT" },
  });
}
