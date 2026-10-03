import { IncidentStation } from "@/components/colony/IncidentStation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Urgences médicales" };

export default function MedicalConsolePage() {
  return <IncidentStation type="MEDICAL" />;
}
