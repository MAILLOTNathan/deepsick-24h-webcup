"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { initialActionState } from "@/lib/action-state";
import { createOrderAction } from "@/lib/actions/orders";
import { ORDER_TYPE_LABELS, ORDER_TYPES } from "@/lib/roles";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Envoi…" : "Confirmer la commande"}
    </Button>
  );
}

export function OrderForm({ defaultType = "TAXI" }: { defaultType?: string }) {
  const [state, formAction] = useFormState(createOrderAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <fieldset className="space-y-2">
        <legend className="font-mono text-xs uppercase tracking-wide text-foreground">
          Type de commande
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {ORDER_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 transition has-[:checked]:border-primary has-[:checked]:bg-primary/10"
            >
              <input
                type="radio"
                name="type"
                value={type}
                defaultChecked={type === defaultType}
                className="accent-primary"
              />
              <span className="font-mono text-xs uppercase tracking-wide text-foreground">
                {type === "TAXI" ? "🚡 Course" : "🍜 Repas"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Résumé" htmlFor="summary">
        <Input id="summary" name="summary" required placeholder="Ex. Rover TX-22 · Habitat 07 → BioDôme 03" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Départ" htmlFor="origin">
          <Input id="origin" name="origin" placeholder="Ex. Habitat 07" />
        </Field>
        <Field label="Destination" htmlFor="destination">
          <Input id="destination" name="destination" placeholder="Ex. BioDôme 03" />
        </Field>
      </div>

      <SubmitButton />
    </form>
  );
}
