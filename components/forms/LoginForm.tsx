"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Fingerprint, IdCard, LockKeyhole } from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { homeForRole } from "@/lib/roles";

const TABS = [
  { href: "/login", label: "Connexion", active: true },
  { href: "/register", label: "Inscription", active: false },
];

export function LoginForm({ registered = false }: { registered?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      redirect: false,
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (!result || result.error) {
      setError("Identifiant colon ou mot de passe incorrect.");
      setPending(false);
      return;
    }

    const session = await getSession();
    router.push(homeForRole(session?.user?.role));
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--info)]/40 bg-[var(--info)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--info)]">
        🛡️ Accès sécurisé · Tier IV
      </span>

      <header>
        <h1 className="font-mono text-2xl leading-tight text-foreground">Bon retour, colon.</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Authentifiez-vous pour entrer dans le réseau civique de Terra Nova.
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

      {registered ? <Alert tone="success">Identité créée. Vous pouvez vous connecter.</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Identifiant colon ou e-mail" htmlFor="email">
          <div className="relative">
            <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="AK-2048-TRN"
              className="pl-9"
            />
          </div>
        </Field>

        <Field label="Mot de passe" htmlFor="password">
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••"
              className="pl-9"
            />
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="size-4 accent-primary" />
            Faire confiance à ce terminal (12 h)
          </label>
          <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--info)]">
            Récupérer l&apos;accès
          </span>
        </div>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Vérification…" : "→ Entrer dans Terra Nova"}
        </Button>
      </form>

      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button type="button" variant="secondary" className="w-full" disabled>
        <Fingerprint data-icon="inline-start" />
        Clé biométrique
      </Button>

      <p className="rounded-lg border border-border bg-card p-3 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        Session résistante · données biométriques locales · audit 18:30 MTC
      </p>

      <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
        <p className="font-mono uppercase tracking-wide text-foreground">Comptes de démonstration</p>
        <p className="mt-1">citoyen@terranova.fr · securite@terranova.fr · medical@terranova.fr · conseil@terranova.fr</p>
        <p className="mt-0.5">maintenance@ · transport@ · commerce@ · administration@terranova.fr</p>
        <p className="mt-0.5">Mot de passe : password123</p>
      </div>
    </div>
  );
}
