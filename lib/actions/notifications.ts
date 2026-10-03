"use server";

import { revalidatePath } from "next/cache";

import { requirePageRole } from "@/lib/permissions";
import { markAllNotificationsRead } from "@/lib/services";
import { ROLES } from "@/lib/roles";

export async function markNotificationsReadAction() {
  const session = await requirePageRole(ROLES);
  await markAllNotificationsRead(session.user.id);
  revalidatePath("/citizen/notifications");
}
