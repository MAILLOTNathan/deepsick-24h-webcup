import Link from "next/link";

import { ReportForm } from "@/components/colony/ReportForm";
import { Card } from "@/components/ui/Card";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nouveau signalement" };

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  await requirePageRole(["CITIZEN"]);

  return (
    <div>
      <Link href="/citizen" className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline">
        ← Accueil
      </Link>
      <h1 className="mt-3 font-mono text-xl text-foreground">Signaler un incident</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Votre signalement est routé automatiquement vers le service compétent et suivi dans votre
        espace.
      </p>
      <Card className="p-4">
        <ReportForm defaultType={searchParams.type ?? "SECURITY"} />
      </Card>
    </div>
  );
}
