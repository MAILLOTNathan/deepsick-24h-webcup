import { IncidentStation } from "@/components/colony/IncidentStation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Maintenance vitale" };

export default function MaintenanceConsolePage() {
  return <IncidentStation type="MAINTENANCE" />;
}
