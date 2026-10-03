"use server";

import { revalidatePath } from "next/cache";

import { requirePageRole } from "@/lib/permissions";
import { assignRequest, updateRequestStatus } from "@/lib/services";
import { isRequestStatus } from "@/lib/roles";

export async function updateRequestStatusAction(formData: FormData) {
  const session = await requirePageRole(["AGENT", "ADMIN"]);

  const requestId = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = formData.get("note") ? String(formData.get("note")) : undefined;

  if (!requestId || !isRequestStatus(status)) return;

  await updateRequestStatus(requestId, status, session.user.id, note);

  revalidatePath("/agents");
  revalidatePath("/agents/demandes");
  revalidatePath(`/agents/demandes/${requestId}`);
  revalidatePath(`/demandes/${requestId}`);
  revalidatePath("/espace");
}

export async function assignToMeAction(formData: FormData) {
  const session = await requirePageRole(["AGENT", "ADMIN"]);
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return;

  await assignRequest(requestId, session.user.id);

  revalidatePath("/agents");
  revalidatePath("/agents/demandes");
  revalidatePath(`/agents/demandes/${requestId}`);
}
