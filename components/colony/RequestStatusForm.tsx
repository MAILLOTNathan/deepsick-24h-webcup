import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/ui/Field";
import { updateRequestStatusAction } from "@/lib/actions/agent";
import { getDictionary } from "@/lib/i18n/server";
import { REQUEST_STATUSES } from "@/lib/roles";

/** Status control for administrative démarches. */
export async function RequestStatusForm({ requestId, status }: { requestId: string; status: string }) {
  const t = getDictionary();

  return (
    <form action={updateRequestStatusAction} className="space-y-3">
      <input type="hidden" name="requestId" value={requestId} />

      <Field label={t.ops.administration.status} htmlFor="status">
        <Select id="status" name="status" defaultValue={status}>
          {REQUEST_STATUSES.map((value) => (
            <option key={value} value={value}>
              {t.requestStatus[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t.ops.administration.officialReply} htmlFor="note">
        <Textarea
          id="note"
          name="note"
          placeholder={t.ops.administration.officialReplyPlaceholder}
        />
      </Field>

      <Button type="submit" className="w-full">
        {t.ops.administration.update}
      </Button>
    </form>
  );
}
