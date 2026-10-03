import { IncidentStation } from "@/components/colony/IncidentStation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Opérations de sécurité" };

export default function SecurityConsolePage() {
  return <IncidentStation type="SECURITY" />;
}
