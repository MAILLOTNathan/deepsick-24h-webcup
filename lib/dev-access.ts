import "server-only";

import { notFound } from "next/navigation";

import { getAuthSession } from "@/lib/permissions";

/**
 * The dev panel is a developer tool:
 * - always available outside production,
 * - opt-in in production with `DEV_PANEL=1`,
 * - otherwise restricted to the High Council.
 */
export function isDevPanelOpen(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.DEV_PANEL === "1";
}

export async function canAccessDevPanel(): Promise<boolean> {
  if (isDevPanelOpen()) return true;
  const session = await getAuthSession();
  return session?.user?.role === "COUNCIL";
}

/** Guards pages and layouts — hides the panel entirely when not allowed. */
export async function requireDevPanel(): Promise<void> {
  if (!(await canAccessDevPanel())) notFound();
}

/** Best-effort author name for ticket comments. */
export async function devActor(): Promise<string> {
  const session = await getAuthSession();
  return session?.user?.name ?? session?.user?.email ?? "dev";
}
