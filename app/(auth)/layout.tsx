import { ColonyScene } from "@/components/colony/ColonyScene";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr,1.1fr]">
      <div className="relative hidden border-r border-border lg:block">
        <ColonyScene className="absolute inset-0" />
        <div className="relative flex h-full flex-col justify-between p-8">
          <Logo />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Mars Civic OS · 01
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
