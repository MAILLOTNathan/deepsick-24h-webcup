// Central place for the enum-like values used across the app.
// SQLite does not support Prisma enums, so every value below is stored as a
// string and validated against these constants.

export const ROLES = ["CITIZEN", "AGENT", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  CITIZEN: "Citoyen",
  AGENT: "Agent municipal",
  ADMIN: "Administrateur",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Landing page for a given role (also used by `middleware.ts`). */
export function homeForRole(role?: string | null): string {
  switch (role) {
    case "AGENT":
      return "/agents";
    case "ADMIN":
      return "/admin";
    case "CITIZEN":
      return "/espace";
    default:
      return "/login";
  }
}

export const REQUEST_STATUSES = [
  "SUBMITTED",
  "IN_REVIEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  SUBMITTED: "Soumise",
  IN_REVIEW: "En cours d'examen",
  IN_PROGRESS: "En traitement",
  RESOLVED: "Résolue",
  CLOSED: "Clôturée",
};

/** Statuses that still require an agent action (drives the F22 filter). */
export const ACTIONABLE_STATUSES: readonly RequestStatus[] = [
  "SUBMITTED",
  "IN_REVIEW",
  "IN_PROGRESS",
];

export function needsAction(status: string): boolean {
  return (ACTIONABLE_STATUSES as readonly string[]).includes(status);
}

export function isRequestStatus(value: unknown): value is RequestStatus {
  return typeof value === "string" && (REQUEST_STATUSES as readonly string[]).includes(value);
}

export const REQUEST_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export const REQUEST_PRIORITY_LABELS: Record<RequestPriority, string> = {
  LOW: "Basse",
  NORMAL: "Normale",
  HIGH: "Haute",
  URGENT: "Urgente",
};

export const CONTACT_STATUSES = ["RECEIVED", "READ", "PROCESSED"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  RECEIVED: "Reçu",
  READ: "Lu",
  PROCESSED: "Traité",
};

export const REQUEST_CATEGORIES = [
  "Voirie",
  "Déchets",
  "Éclairage",
  "Espaces verts",
  "Transports",
  "État civil",
  "Autre",
] as const;
