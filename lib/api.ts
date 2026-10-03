import { NextResponse } from "next/server";

/** Translate an API auth error into a JSON response. */
export function authErrorResponse(error: "unauthorized" | "forbidden") {
  return NextResponse.json(
    { error: error === "unauthorized" ? "Authentification requise." : "Accès refusé." },
    { status: error === "unauthorized" ? 401 : 403 },
  );
}
