"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { registerAction } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Création…" : "Créer mon compte"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialActionState);

  return (
    <div className="rounded-lg border border-border bg-muted/60 p-6">
      <h1 className="font-mono text-xl text-foreground">Créer un compte habitant</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Quelques informations suffisent pour accéder aux services numériques de la ville.
      </p>

      {state.message ? (
        <Alert tone="error" className="mt-4">
          {state.message}
        </Alert>
      ) : null}

      <form action={formAction} className="mt-5 space-y-4">
        <Field label="Nom complet" htmlFor="name">
          <Input id="name" name="name" required minLength={2} autoComplete="name" />
        </Field>

        <Field label="Adresse e-mail" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </Field>

        <Field
          label="Mot de passe"
          htmlFor="password"
          hint="8 caractères minimum."
        >
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>

        <SubmitButton />
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
