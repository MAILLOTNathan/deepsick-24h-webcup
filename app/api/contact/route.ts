import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/permissions";
import { createContactMessage } from "@/lib/services";
import { contactSchema, firstError } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  }

  const session = await getAuthSession();
  const message = await createContactMessage({
    ...parsed.data,
    authorId: session?.user?.id ?? null,
  });

  return NextResponse.json({ reference: message.reference }, { status: 201 });
}
