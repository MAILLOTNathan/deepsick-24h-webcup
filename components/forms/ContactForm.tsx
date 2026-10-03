"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { contactAction } from "@/lib/actions/contact";
import { initialActionState } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Envoi…" : "Envoyer le message"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(contactAction, initialActionState);

  if (state.ok) {
    return (
      <Alert tone="success" title="Message transmis">
        <p>{state.message}</p>
        {state.reference ? (
          <p className="mt-2">
            Référence de suivi :{" "}
            <span className="font-mono text-slate-100">{state.reference}</span>
          </p>
        ) : null}
        <p className="mt-2 text-xs text-emerald-200/80">
          Conservez cette référence : elle permet de retrouver votre message.
        </p>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <Field label="Objet" htmlFor="subject">
        <Input id="subject" name="subject" required maxLength={120} placeholder="Ex. Question sur les transports" />
      </Field>

      <Field label="Votre adresse e-mail" htmlFor="email" hint="Pour vous répondre.">
        <Input id="email" name="email" type="email" required placeholder="vous@exemple.fr" />
      </Field>

      <Field label="Votre message" htmlFor="body">
        <Textarea id="body" name="body" required minLength={10} placeholder="Décrivez votre question ou votre difficulté." />
      </Field>

      <SubmitButton />
    </form>
  );
}
