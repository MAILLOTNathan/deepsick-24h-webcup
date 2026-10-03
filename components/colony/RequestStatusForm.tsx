import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/ui/Field";
import { updateRequestStatusAction } from "@/lib/actions/agent";
import { REQUEST_STATUSES, REQUEST_STATUS_LABELS } from "@/lib/roles";

/** Status control for administrative démarches. */
export function RequestStatusForm({ requestId, status }: { requestId: string; status: string }) {
  return (
    <form action={updateRequestStatusAction} className="space-y-3">
      <input type="hidden" name="requestId" value={requestId} />

      <Field label="Statut" htmlFor="status">
        <Select id="status" name="status" defaultValue={status}>
          {REQUEST_STATUSES.map((value) => (
            <option key={value} value={value}>
              {REQUEST_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Réponse officielle" htmlFor="note">
        <Textarea id="note" name="note" placeholder="Ex. Dossier complet, traitement en cours." />
      </Field>

      <Button type="submit" className="w-full">
        Mettre à jour
      </Button>
    </form>
  );
}
