"use server";

import { revalidatePath } from "next/cache";

import { requirePageRole } from "@/lib/permissions";
import { assignRequest, updateRequestStatus } from "@/lib/services";
import { isRequestStatus } from "@/lib/roles";

/** Démarches administratives: move a citizen request forward and log a note. */
export async function updateRequestStatusAction(formData: FormData) {
  const session = await requirePageRole(["ADMIN_AGENT", "COUNCIL"]);

  const requestId = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = formData.get("note") ? String(formData.get("note")) : undefined;

  if (!requestId || !isRequestStatus(status)) return;

  await updateRequestStatus(requestId, status, session.user.id, note);

  revalidatePath("/operations/administration");
  revalidatePath(`/operations/administration/${requestId}`);
  revalidatePath("/citizen");
  revalidatePath("/citizen/reports");
}

export async function assignToMeAction(formData: FormData) {
  const session = await requirePageRole(["ADMIN_AGENT", "COUNCIL"]);
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return;

  await assignRequest(requestId, session.user.id);

  revalidatePath("/operations/administration");
  revalidatePath(`/operations/administration/${requestId}`);
}
