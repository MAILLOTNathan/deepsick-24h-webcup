import { redirect } from "next/navigation";

import { requirePageRole } from "@/lib/permissions";
import { STAFF_ROLES, homeForRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function OperationsIndexPage() {
  const session = await requirePageRole(STAFF_ROLES);
  redirect(homeForRole(session.user.role));
}
