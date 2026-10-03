import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { authErrorResponse } from "@/lib/api";
import { getRequestsByAuthor, getStaffRequests } from "@/lib/data";
import { requireApiRole } from "@/lib/permissions";
import { STAFF_ROLES } from "@/lib/roles";
import { toRequestRow } from "@/lib/serialize";
import { createServiceRequest } from "@/lib/services";
import { firstError, requestSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireApiRole(["CITIZEN", ...STAFF_ROLES]);
  if (auth.error) return authErrorResponse(auth.error);

  const requests =
    auth.session.user.role === "CITIZEN"
      ? await getRequestsByAuthor(auth.session.user.id)
      : await getStaffRequests();

  return NextResponse.json({ requests: requests.map(toRequestRow) });
}

export async function POST(request: Request) {
  const auth = await requireApiRole(["CITIZEN"]);
  if (auth.error) return authErrorResponse(auth.error);

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  }

  const created = await createServiceRequest(auth.session.user.id, parsed.data);
  revalidatePath("/demandes");
  revalidatePath("/espace");
  revalidatePath("/agents/demandes");

  return NextResponse.json({ reference: created.reference }, { status: 201 });
}
