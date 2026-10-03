import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { homeForRole } from "@/lib/roles";

/**
 * First security layer. Every protected area is checked again inside the pages
 * and API routes (see `lib/permissions.ts`) — never trust the middleware alone.
 */
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;
  const role = token?.role as string | undefined;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isStaff =
    typeof role === "string" &&
    ["SECURITY", "MEDIC", "MAINTENANCE", "DRIVER", "MERCHANT", "ADMIN_AGENT", "COUNCIL"].includes(
      role,
    );

  const denies =
    (pathname.startsWith("/council") && role !== "COUNCIL") ||
    (pathname.startsWith("/operations") && !isStaff) ||
    (pathname.startsWith("/citizen") && role !== "CITIZEN");

  if (denies) {
    return NextResponse.redirect(new URL(homeForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/citizen/:path*", "/operations/:path*", "/council/:path*"],
};
