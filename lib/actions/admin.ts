"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/action-state";
import { requirePageRole } from "@/lib/permissions";
import {
  createAnnouncement,
  createMunicipalService,
  deleteMunicipalService,
  setAnnouncementPublished,
  setUserRole,
} from "@/lib/services";
import { isRole } from "@/lib/roles";
import {
  announcementSchema,
  firstError,
  serviceSchema,
} from "@/lib/validation";

export async function createServiceAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requirePageRole(["ADMIN"]);

  const parsed = serviceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    icon: formData.get("icon"),
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  try {
    await createMunicipalService(parsed.data);
  } catch {
    return { ok: false, message: "Le service n'a pas pu être créé." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true, message: "Service créé." };
}

export async function deleteServiceAction(formData: FormData) {
  await requirePageRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteMunicipalService(id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function createAnnouncementAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requirePageRole(["ADMIN"]);

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  try {
    await createAnnouncement({ ...parsed.data, authorId: session.user.id });
  } catch {
    return { ok: false, message: "L'annonce n'a pas pu être créée." };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  return { ok: true, message: "Annonce créée." };
}

export async function toggleAnnouncementAction(formData: FormData) {
  await requirePageRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (!id) return;
  await setAnnouncementPublished(id, published);
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
}

export async function setUserRoleAction(formData: FormData) {
  const session = await requirePageRole(["ADMIN"]);
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || !isRole(role) || userId === session.user.id) return;

  await setUserRole(userId, role);
  revalidatePath("/admin/utilisateurs");
}
