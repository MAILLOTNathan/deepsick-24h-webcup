"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { homeForRole } from "@/lib/roles";

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
      setError("Adresse e-mail ou mot de passe incorrect.");
      setPending(false);
      return;
    }

    const session = await getSession();
    router.push(homeForRole(session?.user?.role));
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-border/60 bg-surface/60 p-6">
      <h1 className="font-mono text-xl text-slate-50">Connexion</h1>
      <p className="mt-1 text-sm text-slate-400">Accédez à votre espace personnel.</p>

      {registered ? (
        <Alert tone="success" className="mt-4">
          Votre compte a bien été créé. Vous pouvez vous connecter.
        </Alert>
      ) : null}

      {error ? (
        <Alert tone="error" className="mt-4">
          {error}
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <Field label="Adresse e-mail" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </Field>

        <Field label="Mot de passe" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </Field>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-slate-400">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-mars hover:underline">
          Créer un compte
        </Link>
      </p>

      <div className="mt-5 rounded-md border border-border/60 bg-background/40 p-3 text-xs text-slate-500">
        <p className="font-mono uppercase tracking-wide text-slate-400">Comptes de démonstration</p>
        <p className="mt-1">citoyen@novaterra.fr · agent@novaterra.fr · admin@novaterra.fr</p>
        <p>Mot de passe : password123</p>
      </div>
    </div>
  );
}
