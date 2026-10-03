"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { initialActionState } from "@/lib/action-state";
import { registerAction } from "@/lib/actions/auth";

const TABS = [
  { href: "/login", label: "Connexion", active: false },
  { href: "/register", label: "Inscription", active: true },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Création…" : "→ Créer mon identité colon"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialActionState);

  return (
    <div className="space-y-5">
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--info)]/40 bg-[var(--info)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--info)]">
        🛡️ Nouvelle identité · Tier I
      </span>

      <header>
        <h1 className="font-mono text-2xl leading-tight text-foreground">Rejoindre Terra Nova.</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Créez votre identité civique pour accéder aux services de la colonie.
        </p>
      </header>

      <div className="grid grid-cols-2 rounded-lg border border-border p-1">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-md py-2 text-center font-mono text-xs uppercase tracking-wide transition ${
              tab.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <form action={formAction} className="space-y-4">
        <Field label="Nom complet" htmlFor="name">
          <Input id="name" name="name" required minLength={2} autoComplete="name" />
        </Field>

        <Field label="Adresse e-mail" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </Field>

        <Field label="Mot de passe" htmlFor="password" hint="8 caractères minimum.">
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

      <p className="text-sm text-muted-foreground">
        Vous avez déjà une identité ?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
