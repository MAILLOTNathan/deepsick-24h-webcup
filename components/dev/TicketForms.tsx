"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { addTicketCommentAction, updateTicketAction } from "@/lib/actions/tickets";
import { useT } from "@/lib/i18n/client";
import { TICKET_STATUSES } from "@/lib/ticket-status";

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
  const t = useT();

  return (
    <form action={updateTicketAction} className="space-y-3">
      <input type="hidden" name="code" value={code} />

      <Field label={t.dev.detail.status} htmlFor="status">
        <Select id="status" name="status" defaultValue={status}>
          {TICKET_STATUSES.map((value) => (
            <option key={value} value={value}>
              {t.ticketStatus[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t.dev.detail.assignee} htmlFor="assignee">
        <Input
          id="assignee"
          name="assignee"
          defaultValue={assignee ?? ""}
          placeholder={t.dev.detail.assigneePlaceholder}
        />
      </Field>

      <Button type="submit" className="w-full">
        {t.dev.detail.update}
      </Button>
    </form>
  );
}

/** Free-form comment appended to the ticket timeline. */
export function TicketCommentForm({ code }: { code: string }) {
  const t = useT();

  return (
    <form action={addTicketCommentAction} className="space-y-3">
      <input type="hidden" name="code" value={code} />

      <Field label={t.dev.detail.comment} htmlFor="body">
        <Textarea
          id="body"
          name="body"
          required
          placeholder={t.dev.detail.commentPlaceholder}
        />
      </Field>

      <Button type="submit" variant="secondary" className="w-full">
        {t.dev.detail.addComment}
      </Button>
    </form>
  );
}
