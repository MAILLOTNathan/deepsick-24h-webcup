import type { Metadata } from "next";

import { IncidentStation } from "@/components/colony/IncidentStation";
import { getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().ops.security.title };
}

export default function SecurityConsolePage() {
  return <IncidentStation type="SECURITY" />;
}
