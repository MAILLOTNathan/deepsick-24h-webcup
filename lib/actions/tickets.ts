"use server";

import { revalidatePath } from "next/cache";

import { devActor, requireDevPanel } from "@/lib/dev-access";
import { format, getDictionary } from "@/lib/i18n/server";
import { addTicketComment, syncTickets, updateTicket } from "@/lib/tickets";

export type TicketActionState = { ok: boolean; message: string };

export async function syncTicketsAction(
  _previous: TicketActionState,
  _formData: FormData,
): Promise<TicketActionState> {
  const t = getDictionary();
  await requireDevPanel();

  try {
    const result = await syncTickets();
    revalidatePath("/dev/tickets");

    const wave =
      result.session?.next_wave_number !== undefined
        ? format(t.dev.sync.nextWave, {
            minutes: result.session.minutes_until_next_wave ?? "?",
          })
        : "";

    return {
      ok: true,
      message: format(t.dev.sync.ok, {
        fetched: result.fetched,
        created: result.created,
        updated: result.updated,
        wave,
      }),
    };
  } catch (error) {
    const raw = error instanceof Error ? error.message : "";
    const api = raw.match(/répondu (\d+)\s*(.*)\.$/);

    return {
      ok: false,
      message: raw.includes("WEBCUP_API_KEY")
        ? t.dev.sync.missingKey
        : api
          ? format(t.dev.sync.apiError, { status: api[1], statusText: api[2] })
          : t.dev.sync.failed,
    };
  }
}

export async function updateTicketAction(formData: FormData) {
  await requireDevPanel();
  const actor = await devActor();

  const code = String(formData.get("code") ?? "");
  if (!code) return;

  const status = formData.get("status") ? String(formData.get("status")) : undefined;
  const assignee = formData.has("assignee") ? String(formData.get("assignee")) : undefined;

  await updateTicket(code, { status, assignee }, actor);

  revalidatePath("/dev/tickets");
  revalidatePath(`/dev/tickets/${code}`);
}

export async function addTicketCommentAction(formData: FormData) {
  await requireDevPanel();
  const actor = await devActor();

  const code = String(formData.get("code") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!code || !body) return;

  await addTicketComment(code, body, actor);

  revalidatePath(`/dev/tickets/${code}`);
}
