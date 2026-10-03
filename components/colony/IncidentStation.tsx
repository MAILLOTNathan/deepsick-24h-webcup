import { IncidentConsole } from "@/components/colony/IncidentConsole";
import { getReports } from "@/lib/data";
import { requirePageRole } from "@/lib/permissions";
import { toReportRow } from "@/lib/serialize";
import type { ReportType } from "@/lib/roles";

const COPY: Record<ReportType, { station: string; title: string; subtitle: string; role: string }> = {
  SECURITY: {
    station: "ARES SECURITY COMMAND",
    title: "Opérations de sécurité",
    subtitle: "Contrôle des secteurs, interventions et sûreté civique.",
    role: "SECURITY",
  },
  MEDICAL: {
    station: "ASCLEPIUS MEDICAL NET",
    title: "Urgences et soins",
    subtitle: "Triage des urgences, équipes et capacité médicale.",
    role: "MEDIC",
  },
  MAINTENANCE: {
    station: "HEPHAESTUS INFRASTRUCTURE",
    title: "Maintenance vitale",
    subtitle: "Air, énergie, eau et propreté des modules.",
    role: "MAINTENANCE",
  },
  CLEANLINESS: {
    station: "HEPHAESTUS INFRASTRUCTURE",
    title: "Propreté des modules",
    subtitle: "Collecte et salubrité des espaces communs.",
    role: "MAINTENANCE",
  },
};

/** Server wrapper shared by the security / medical / maintenance consoles. */
export async function IncidentStation({ type }: { type: ReportType }) {
  const copy = COPY[type];
  await requirePageRole([copy.role, "COUNCIL"]);

  const all = await getReports();
  const reports = all.filter((report) =>
    type === "MAINTENANCE"
      ? report.type === "MAINTENANCE" || report.type === "CLEANLINESS"
      : report.type === type,
  );

  return (
    <IncidentConsole
      station={copy.station}
      title={copy.title}
      subtitle={copy.subtitle}
      reports={reports.map(toReportRow)}
      detailBase={`/operations/${type === "MEDICAL" ? "medical" : type === "SECURITY" ? "security" : "maintenance"}`}
    />
  );
}
