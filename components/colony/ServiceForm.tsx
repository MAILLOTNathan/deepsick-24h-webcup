"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { createServiceAction } from "@/lib/actions/admin";
import { initialAdminActionState } from "@/lib/action-state";
import { useT } from "@/lib/i18n/client";

function SubmitButton() {
  const t = useT();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? t.council.services.form.submitting : t.council.services.form.submit}
    </Button>
  );
}

export function ServiceForm() {
  const t = useT();
  const [state, formAction] = useFormState(createServiceAction, initialAdminActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <Alert tone={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <Field label={t.council.services.form.name} htmlFor="name">
        <Input
          id="name"
          name="name"
          required
          placeholder={t.council.services.form.namePlaceholder}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t.council.services.form.category} htmlFor="category">
          <Input
            id="category"
            name="category"
            placeholder={t.council.services.form.categoryPlaceholder}
          />
        </Field>
        <Field label={t.council.services.form.icon} htmlFor="icon">
          <Input id="icon" name="icon" maxLength={4} placeholder="🛠️" />
        </Field>
      </div>

      <Field label={t.council.services.form.description} htmlFor="description">
        <Textarea id="description" name="description" required />
      </Field>

      <SubmitButton />
    </form>
  );
}
