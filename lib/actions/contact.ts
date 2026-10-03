"use server";

import type { ActionState } from "@/lib/action-state";
import { getAuthSession } from "@/lib/permissions";
import { createContactMessage } from "@/lib/services";
import { contactSchema, firstError } from "@/lib/validation";

export async function contactAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    subject: formData.get("subject"),
    email: formData.get("email"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { ok: false, message: firstError(parsed.error) };
  }

  const session = await getAuthSession();

  try {
    const message = await createContactMessage({
      ...parsed.data,
      authorId: session?.user?.id ?? null,
    });
    return {
      ok: true,
      message: "Votre message a bien été transmis à l'administration.",
      reference: message.reference,
    };
  } catch {
    return { ok: false, message: "L'envoi a échoué. Réessayez dans un instant." };
  }
}
