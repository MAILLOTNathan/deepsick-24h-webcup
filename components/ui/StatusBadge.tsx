import { Badge } from "@/components/ui/Badge";
import {
  REQUEST_PRIORITY_LABELS,
  REQUEST_STATUS_LABELS,
  ROLE_LABELS,
  isRequestStatus,
  isRole,
  type RequestPriority,
  type Role,
} from "@/lib/roles";

const STATUS_TONES: Record<string, "mars" | "info" | "warning" | "success" | "neutral"> = {
  SUBMITTED: "mars",
  IN_REVIEW: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CLOSED: "neutral",
};

const PRIORITY_TONES: Record<RequestPriority, "neutral" | "info" | "warning" | "danger"> = {
  LOW: "neutral",
  NORMAL: "info",
  HIGH: "warning",
  URGENT: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  const label = isRequestStatus(status) ? REQUEST_STATUS_LABELS[status] : status;
  return <Badge tone={STATUS_TONES[status] ?? "neutral"}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const label =
    priority in REQUEST_PRIORITY_LABELS
      ? REQUEST_PRIORITY_LABELS[priority as RequestPriority]
      : priority;
  return (
    <Badge tone={PRIORITY_TONES[priority as RequestPriority] ?? "neutral"}>{label}</Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const label = isRole(role) ? ROLE_LABELS[role as Role] : role;
  const tone = role === "ADMIN" ? "danger" : role === "AGENT" ? "info" : "mars";
  return <Badge tone={tone}>{label}</Badge>;
}
