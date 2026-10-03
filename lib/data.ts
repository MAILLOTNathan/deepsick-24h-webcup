import "server-only";

import { prisma } from "@/lib/prisma";
import { ACTIONABLE_STATUSES } from "@/lib/roles";

/* ------------------------------------------------------------------ *
 * Public content
 * ------------------------------------------------------------------ */

export function getPublishedServices() {
  return prisma.municipalService.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export function getAllServices() {
  return prisma.municipalService.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export function getServiceBySlug(slug: string) {
  return prisma.municipalService.findUnique({ where: { slug } });
}

export function getPublishedAnnouncements() {
  return prisma.announcement.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { author: { select: { name: true } } },
  });
}

export function getAnnouncementBySlug(slug: string) {
  return prisma.announcement.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
}

/* ------------------------------------------------------------------ *
 * Requests
 * ------------------------------------------------------------------ */

export function getRequestsByAuthor(authorId: string) {
  return prisma.serviceRequest.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: { assignee: { select: { name: true } } },
  });
}

export function getRequestById(id: string) {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
      history: { orderBy: { createdAt: "asc" } },
    },
  });
}

/** Requests list for agents/admins, optionally restricted to actionable items (F22). */
export function getStaffRequests({ actionable = false } = {}) {
  return prisma.serviceRequest.findMany({
    where: actionable ? { status: { in: [...ACTIONABLE_STATUSES] } } : undefined,
    orderBy: [{ createdAt: "desc" }],
    include: {
      author: { select: { name: true, email: true } },
      assignee: { select: { name: true } },
    },
  });
}

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

export function getUsers() {
  return prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export function getContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}

export function getAssignableAgents() {
  return prisma.user.findMany({
    where: { role: "AGENT" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

/* ------------------------------------------------------------------ *
 * Dashboard / activity
 * ------------------------------------------------------------------ */

export async function getPlatformStats() {
  const [citizens, agents, services, announcements, requests, actionable, contacts] =
    await Promise.all([
      prisma.user.count({ where: { role: "CITIZEN" } }),
      prisma.user.count({ where: { role: "AGENT" } }),
      prisma.municipalService.count({ where: { published: true } }),
      prisma.announcement.count({ where: { published: true } }),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: { in: [...ACTIONABLE_STATUSES] } } }),
      prisma.contactMessage.count(),
    ]);

  return { citizens, agents, services, announcements, requests, actionable, contacts };
}

export type ActivityItem = {
  id: string;
  kind: "request" | "contact" | "announcement";
  title: string;
  subtitle: string;
  date: Date;
  href: string;
};

/** Unified activity feed consumed by the agent workspace (D19). */
export async function getActivityFeed(limit = 8): Promise<ActivityItem[]> {
  const [requests, contacts, announcements] = await Promise.all([
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { author: { select: { name: true } } },
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
  ]);

  const items: ActivityItem[] = [
    ...requests.map((request) => ({
      id: `request-${request.id}`,
      kind: "request" as const,
      title: `Demande — ${request.subject}`,
      subtitle: `${request.author?.name ?? "Habitant"} · ${request.status}`,
      date: request.createdAt,
      href: `/agents/demandes/${request.id}`,
    })),
    ...contacts.map((message) => ({
      id: `contact-${message.id}`,
      kind: "contact" as const,
      title: `Message — ${message.subject}`,
      subtitle: message.email,
      date: message.createdAt,
      href: "/agents",
    })),
    ...announcements.map((announcement) => ({
      id: `announcement-${announcement.id}`,
      kind: "announcement" as const,
      title: `Annonce — ${announcement.title}`,
      subtitle: announcement.published ? "Publiée" : "Brouillon",
      date: announcement.createdAt,
      href: `/announcements/${announcement.slug}`,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}
