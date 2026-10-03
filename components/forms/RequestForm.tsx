"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { createRequestAction } from "@/lib/actions/requests";
import { initialActionState } from "@/lib/action-state";
import {
  REQUEST_CATEGORIES,
  REQUEST_PRIORITIES,
  REQUEST_PRIORITY_LABELS,
} from "@/lib/roles";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Envoi…" : "Envoyer ma demande"}
    </Button>
  );
}

export function RequestForm() {
  const [state, formAction] = useFormState(createRequestAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <Field label="Objet" htmlFor="subject">
        <Input id="subject" name="subject" required maxLength={120} placeholder="Ex. Lampadaire en panne" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Catégorie" htmlFor="category">
          <Select id="category" name="category" defaultValue="">
            <option value="">— Choisir —</option>
            {REQUEST_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Priorité" htmlFor="priority">
          <Select id="priority" name="priority" defaultValue="NORMAL">
            {REQUEST_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {REQUEST_PRIORITY_LABELS[priority]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          required
          minLength={10}
          placeholder="Décrivez précisément votre demande, le lieu et le besoin."
        />
      </Field>

      <SubmitButton />
    </form>
  );
}
