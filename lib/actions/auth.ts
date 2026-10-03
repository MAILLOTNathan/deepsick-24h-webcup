"use server";

import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { registerCitizen } from "@/lib/services";
import { firstError, registerSchema } from "@/lib/validation";

export async function registerAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: firstError(parsed.error) };
  }

  try {
    await registerCitizen(parsed.data);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Inscription impossible.",
    };
  }

  redirect("/login?inscription=1");
}
