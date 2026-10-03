"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { getAuthSession } from "@/lib/permissions";
import { createServiceRequest } from "@/lib/services";
import { firstError, requestSchema } from "@/lib/validation";

export async function createRequestAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getAuthSession();
  if (!session) {
    return { ok: false, message: "Vous devez être connecté pour créer une demande." };
  }

  const parsed = requestSchema.safeParse({
    subject: formData.get("subject"),
    description: formData.get("description"),
    category: formData.get("category"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    return { ok: false, message: firstError(parsed.error) };
  }

  try {
    await createServiceRequest(session.user.id, parsed.data);
  } catch {
    return { ok: false, message: "La demande n'a pas pu être enregistrée." };
  }

  revalidatePath("/demandes");
  revalidatePath("/espace");
  redirect("/demandes?creee=1");
}
