import "server-only";

import bcrypt from "bcryptjs";

import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { isRequestStatus, isRole, needsAction } from "@/lib/roles";

/* ------------------------------------------------------------------ *
 * Accounts
 * ------------------------------------------------------------------ */

export async function registerCitizen(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Un compte existe déjà avec cette adresse e-mail.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
    data: { name: input.name.trim(), email, passwordHash, role: "CITIZEN" },
  });
}

export async function setUserRole(userId: string, role: string) {
  if (!isRole(role)) throw new Error("Rôle invalide.");
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

/* ------------------------------------------------------------------ *
 * Contact (D04)
 * ------------------------------------------------------------------ */

export async function createContactMessage(input: {
  subject: string;
  body: string;
  email: string;
  authorId?: string | null;
}) {
  return prisma.contactMessage.create({
    data: {
      subject: input.subject.trim(),
      body: input.body.trim(),
      email: input.email.toLowerCase().trim(),
      authorId: input.authorId ?? null,
      status: "RECEIVED",
    },
  });
}

export async function updateContactMessageStatus(id: string, status: string) {
  return prisma.contactMessage.update({ where: { id }, data: { status } });
}

/* ------------------------------------------------------------------ *
 * Citizen requests (D03 / F22)
 * ------------------------------------------------------------------ */

export async function createServiceRequest(
  authorId: string,
  input: {
    subject: string;
    description: string;
    category?: string | null;
    priority: string;
  },
) {
  const created = await prisma.serviceRequest.create({
    data: {
      subject: input.subject.trim(),
      description: input.description.trim(),
      category: input.category?.trim() || null,
      priority: input.priority,
      status: "SUBMITTED",
      authorId,
      history: {
        create: { status: "SUBMITTED", note: "Demande créée par l'habitant.", actorId: authorId },
      },
    },
  });
  return created;
}

/**
 * Move a request forward, record the transition, and self-assign it to the
 * agent who first acts on it.
 */
export async function updateRequestStatus(
  requestId: string,
  status: string,
  actorId: string,
  note?: string,
) {
  if (!isRequestStatus(status)) throw new Error("Statut invalide.");

  return prisma.$transaction(async (tx) => {
    const current = await tx.serviceRequest.findUnique({ where: { id: requestId } });
    if (!current) throw new Error("Demande introuvable.");

    const updated = await tx.serviceRequest.update({
      where: { id: requestId },
      data: {
        status,
        ...(current.assigneeId ? {} : { assigneeId: actorId }),
      },
    });

    await tx.requestStatusEvent.create({
      data: { requestId, status, note: note?.trim() || null, actorId },
    });

    return updated;
  });
}

export async function assignRequest(requestId: string, assigneeId: string) {
  return prisma.serviceRequest.update({ where: { id: requestId }, data: { assigneeId } });
}

/** True when the request still needs an agent action. */
export function requestNeedsAction(status: string): boolean {
  return needsAction(status);
}

/* ------------------------------------------------------------------ *
 * Municipal services (D05)
 * ------------------------------------------------------------------ */

async function uniqueServiceSlug(name: string) {
  const root = slugify(name) || "service";
  let slug = root;
  let suffix = 2;
  while (await prisma.municipalService.findUnique({ where: { slug } })) {
    slug = `${root}-${suffix++}`;
  }
  return slug;
}

export async function createMunicipalService(input: {
  name: string;
  description: string;
  category?: string | null;
  icon?: string | null;
}) {
  return prisma.municipalService.create({
    data: {
      slug: await uniqueServiceSlug(input.name),
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category?.trim() || null,
      icon: input.icon?.trim() || null,
      published: true,
    },
  });
}

export async function deleteMunicipalService(id: string) {
  return prisma.municipalService.delete({ where: { id } });
}

/* ------------------------------------------------------------------ *
 * Announcements (D06)
 * ------------------------------------------------------------------ */

async function uniqueAnnouncementSlug(title: string) {
  const root = slugify(title) || "annonce";
  let slug = root;
  let suffix = 2;
  while (await prisma.announcement.findUnique({ where: { slug } })) {
    slug = `${root}-${suffix++}`;
  }
  return slug;
}

export async function createAnnouncement(input: {
  title: string;
  excerpt?: string | null;
  body: string;
  published?: boolean;
  authorId?: string | null;
}) {
  const published = input.published ?? false;
  return prisma.announcement.create({
    data: {
      slug: await uniqueAnnouncementSlug(input.title),
      title: input.title.trim(),
      excerpt: input.excerpt?.trim() || null,
      body: input.body.trim(),
      published,
      publishedAt: published ? new Date() : null,
      authorId: input.authorId ?? null,
    },
  });
}

export async function setAnnouncementPublished(id: string, published: boolean) {
  return prisma.announcement.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
}
