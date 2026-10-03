import { NextResponse } from "next/server";

import { authErrorResponse } from "@/lib/api";
import { getActivityFeed, getPlatformStats } from "@/lib/data";
import { requireApiRole } from "@/lib/permissions";
import { STAFF_ROLES } from "@/lib/roles";
import { toActivityDto } from "@/lib/serialize";

export const dynamic = "force-dynamic";

/**
 * Nova Terra API surface consumed by the agent workspace (D19).
 * Returns platform statistics plus the latest activity.
 */
export async function GET() {
  const auth = await requireApiRole(STAFF_ROLES);
  if (auth.error) return authErrorResponse(auth.error);

  const [stats, activity] = await Promise.all([getPlatformStats(), getActivityFeed()]);

  return NextResponse.json({ stats, activity: toActivityDto(activity) });
}
