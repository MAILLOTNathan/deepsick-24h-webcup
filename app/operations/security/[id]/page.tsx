import { ReportDetailView } from "@/components/colony/ReportDetailView";

export const dynamic = "force-dynamic";

export default function SecurityIncidentPage({ params }: { params: { id: string } }) {
  return <ReportDetailView id={params.id} />;
}
