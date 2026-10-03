"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { syncTicketsAction, type TicketActionState } from "@/lib/actions/tickets";
import { useT } from "@/lib/i18n/client";

const INITIAL: TicketActionState = { ok: false, message: "" };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const t = useT();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" size="sm" disabled={disabled || pending}>
      {pending ? t.dev.page.syncing : t.dev.page.sync}
    </Button>
  );
}

/** Pulls the latest needs from the Webcup API into the ticket store. */
export function SyncButton({ configured }: { configured: boolean }) {
  const [state, formAction] = useFormState(syncTicketsAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <SubmitButton disabled={!configured} />
      {state.message ? (
        <span
          className={`font-mono text-[11px] ${
            state.ok ? "text-[var(--chart-3)]" : "text-destructive"
          }`}
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
