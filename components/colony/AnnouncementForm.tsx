"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { createAnnouncementAction } from "@/lib/actions/admin";
import { initialAdminActionState } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Publication…" : "Publier l'annonce"}
    </Button>
  );
}

export function AnnouncementForm() {
  const [state, formAction] = useFormState(createAnnouncementAction, initialAdminActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <Alert tone={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <Field label="Titre" htmlFor="title">
        <Input id="title" name="title" required placeholder="Ex. Ouverture du Secteur 05" />
      </Field>

      <Field label="Chapeau" htmlFor="excerpt" hint="Résumé affiché dans les listes.">
        <Input id="excerpt" name="excerpt" maxLength={280} />
      </Field>

      <Field label="Contenu" htmlFor="body">
        <Textarea id="body" name="body" required className="min-h-36" />
      </Field>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="published" className="size-4 accent-primary" />
        Publier immédiatement
      </label>

      <SubmitButton />
    </form>
  );
}
