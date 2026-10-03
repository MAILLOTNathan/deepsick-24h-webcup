import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { addTicketCommentAction, updateTicketAction } from "@/lib/actions/tickets";
import { TICKET_STATUSES, TICKET_STATUS_LABELS } from "@/lib/ticket-status";

/** Status + assignee control for a ticket. */
export function TicketUpdateForm({
  code,
  status,
  assignee,
}: {
  code: string;
  status: string;
  assignee: string | null;
}) {
  return (
    <form action={updateTicketAction} className="space-y-3">
      <input type="hidden" name="code" value={code} />

      <Field label="Statut" htmlFor="status">
        <Select id="status" name="status" defaultValue={status}>
          {TICKET_STATUSES.map((value) => (
            <option key={value} value={value}>
              {TICKET_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Assigné à" htmlFor="assignee">
        <Input id="assignee" name="assignee" defaultValue={assignee ?? ""} placeholder="Ex. Neisan" />
      </Field>

      <Button type="submit" className="w-full">
        Mettre à jour
      </Button>
    </form>
  );
}

/** Free-form comment appended to the ticket timeline. */
export function TicketCommentForm({ code }: { code: string }) {
  return (
    <form action={addTicketCommentAction} className="space-y-3">
      <input type="hidden" name="code" value={code} />

      <Field label="Commentaire" htmlFor="body">
        <Textarea id="body" name="body" required placeholder="Ex. Écran terminé, en attente de revue." />
      </Field>

      <Button type="submit" variant="secondary" className="w-full">
        Ajouter le commentaire
      </Button>
    </form>
  );
}
