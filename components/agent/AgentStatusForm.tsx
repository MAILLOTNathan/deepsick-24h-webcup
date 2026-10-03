import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/ui/Field";
import { assignToMeAction, updateRequestStatusAction } from "@/lib/actions/agent";
import { REQUEST_STATUSES, REQUEST_STATUS_LABELS } from "@/lib/roles";

export function AgentStatusForm({
  requestId,
  status,
  hasAssignee,
}: {
  requestId: string;
  status: string;
  hasAssignee: boolean;
}) {
  return (
    <div className="space-y-5">
      <form action={updateRequestStatusAction} className="space-y-4">
        <input type="hidden" name="requestId" value={requestId} />

        <Field label="Nouveau statut" htmlFor="status">
          <Select id="status" name="status" defaultValue={status}>
            {REQUEST_STATUSES.map((value) => (
              <option key={value} value={value}>
                {REQUEST_STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Note de suivi" htmlFor="note" hint="Visible par l'habitant dans son espace.">
          <Textarea id="note" name="note" placeholder="Ex. Intervention programmée pour jeudi." />
        </Field>

        <Button type="submit">Mettre à jour le statut</Button>
      </form>

      {!hasAssignee ? (
        <form action={assignToMeAction} className="border-t border-border/60 pt-4">
          <input type="hidden" name="requestId" value={requestId} />
          <p className="mb-3 text-xs text-slate-500">
            Aucun agent n'est encore assigné à cette demande.
          </p>
          <Button type="submit" variant="secondary">
            Me l'assigner
          </Button>
        </form>
      ) : null}
    </div>
  );
}
