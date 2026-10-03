import { ReportDetailView } from "@/components/colony/ReportDetailView";

export const dynamic = "force-dynamic";

export default function MedicalIncidentPage({ params }: { params: { id: string } }) {
  return <ReportDetailView id={params.id} />;
}
