import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import {
  assignReportAction,
  filePoliceCaseAction,
  updateReportStatusAction,
} from "@/lib/actions/reports";
import { REPORT_STATUSES, REPORT_STATUS_LABELS } from "@/lib/roles";

/** Move an incident through its lifecycle and log a note. */
export function ReportStatusForm({ reportId, status }: { reportId: string; status: string }) {
  return (
    <form action={updateReportStatusAction} className="space-y-4">
      <input type="hidden" name="reportId" value={reportId} />

      <Field label="Nouveau statut" htmlFor="status">
        <Select id="status" name="status" defaultValue={status}>
          {REPORT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {REPORT_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Note d'intervention" htmlFor="note" hint="Visible par le colon dans son suivi.">
        <Textarea id="note" name="note" placeholder="Ex. Patrouille engagée, périmètre sécurisé." />
      </Field>

      <Button type="submit" className="w-full">
        Enregistrer
      </Button>
    </form>
  );
}

export function ReportAssignButton({
  reportId,
  assigneeName,
}: {
  reportId: string;
  assigneeName?: string | null;
}) {
  return (
    <form action={assignReportAction} className="space-y-2">
      <input type="hidden" name="reportId" value={reportId} />
      <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        {assigneeName ? `Unité : ${assigneeName}` : "Aucune unité affectée"}
      </p>
      <Button type="submit" variant="secondary" size="sm" className="w-full">
        {assigneeName ? "Réaffecter à mon unité" : "Prendre en charge"}
      </Button>
    </form>
  );
}

/** Simulated arrest + PV, security only. */
export function PoliceCaseForm({
  reportId,
  existing,
}: {
  reportId: string;
  existing?: {
    suspectName: string | null;
    arrestNotes: string | null;
    fineAmount: number | null;
    pvContent: string | null;
  } | null;
}) {
  return (
    <form action={filePoliceCaseAction} className="space-y-3">
      <input type="hidden" name="reportId" value={reportId} />

      <Field label="Personne concernée" htmlFor="suspectName">
        <Input id="suspectName" name="suspectName" defaultValue={existing?.suspectName ?? ""} placeholder="Ex. K. Doran" />
      </Field>

      <Field label="Notes d'intervention" htmlFor="arrestNotes">
        <Textarea id="arrestNotes" name="arrestNotes" defaultValue={existing?.arrestNotes ?? ""} />
      </Field>

      <Field label="Amende (crédits)" htmlFor="fineAmount">
        <Input id="fineAmount" name="fineAmount" type="number" min={0} defaultValue={existing?.fineAmount ?? ""} />
      </Field>

      <Field label="Procès-verbal simulé" htmlFor="pvContent">
        <Textarea id="pvContent" name="pvContent" defaultValue={existing?.pvContent ?? ""} />
      </Field>

      <Button type="submit" variant="secondary" className="w-full">
        {existing ? "Mettre à jour le dossier" : "Ouvrir un dossier + PV"}
      </Button>
    </form>
  );
}
