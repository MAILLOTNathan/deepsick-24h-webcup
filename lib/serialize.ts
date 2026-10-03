export type ActivityDto = {
  id: string;
  kind: "request" | "contact" | "announcement";
  title: string;
  subtitle: string;
  date: string;
  href: string;
};

export type StatsDto = {
  citizens: number;
  agents: number;
  services: number;
  announcements: number;
  requests: number;
  actionable: number;
  contacts: number;
};

export type RequestRowDto = {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  category: string | null;
  createdAt: string;
  authorName: string | null;
  assigneeName: string | null;
};

type RequestLike = {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  category: string | null;
  createdAt: Date;
  author?: { name: string | null } | null;
  assignee?: { name: string | null } | null;
};

export function toRequestRow(request: RequestLike): RequestRowDto {
  return {
    id: request.id,
    reference: request.reference,
    subject: request.subject,
    status: request.status,
    priority: request.priority,
    category: request.category,
    createdAt: request.createdAt.toISOString(),
    authorName: request.author?.name ?? null,
    assigneeName: request.assignee?.name ?? null,
  };
}

export function toActivityDto(
  items: Array<{
    id: string;
    kind: "request" | "contact" | "announcement";
    title: string;
    subtitle: string;
    date: Date;
    href: string;
  }>,
): ActivityDto[] {
  return items.map((item) => ({ ...item, date: item.date.toISOString() }));
}
