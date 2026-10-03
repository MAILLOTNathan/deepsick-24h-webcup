import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        Ville de Nova Terra — Plateforme citoyenne
      </p>
    </div>
  );
}
