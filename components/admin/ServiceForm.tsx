"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { createServiceAction } from "@/lib/actions/admin";
import { initialAdminActionState } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Création…" : "Créer le service"}
    </Button>
  );
}

export function ServiceForm() {
  const [state, formAction] = useFormState(createServiceAction, initialAdminActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <Alert tone={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <Field label="Nom du service" htmlFor="name">
        <Input id="name" name="name" required placeholder="Ex. Éclairage public" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Catégorie" htmlFor="category">
          <Input id="category" name="category" placeholder="Ex. Cadre de vie" />
        </Field>
        <Field label="Icône (emoji)" htmlFor="icon">
          <Input id="icon" name="icon" maxLength={4} placeholder="💡" />
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <Textarea id="description" name="description" required />
      </Field>

      <SubmitButton />
    </form>
  );
}
