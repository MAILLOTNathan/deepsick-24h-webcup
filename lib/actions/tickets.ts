"use server";

import { revalidatePath } from "next/cache";

import { devActor, requireDevPanel } from "@/lib/dev-access";
import { addTicketComment, syncTickets, updateTicket } from "@/lib/tickets";

export type TicketActionState = { ok: boolean; message: string };

export async function syncTicketsAction(
  _previous: TicketActionState,
  _formData: FormData,
): Promise<TicketActionState> {
  await requireDevPanel();

  try {
    const result = await syncTickets();
    revalidatePath("/dev/tickets");

    const wave =
      result.session?.next_wave_number !== undefined
        ? ` Prochaine vague dans ${result.session.minutes_until_next_wave ?? "?"} min.`
        : "";

    return {
      ok: true,
      message: `${result.fetched} besoin(s) reçu(s) — ${result.created} créé(s), ${result.updated} mis à jour.${wave}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Synchronisation impossible.",
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
