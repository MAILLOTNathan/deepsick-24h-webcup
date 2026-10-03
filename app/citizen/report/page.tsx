import type { Metadata } from "next";
import Link from "next/link";

import { ReportForm } from "@/components/colony/ReportForm";
import { Card } from "@/components/ui/Card";
import { getDictionary } from "@/lib/i18n/server";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().citizen.report.title };
}

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const t = getDictionary();
  await requirePageRole(["CITIZEN"]);

  return (
    <div>
      <Link href="/citizen" className="font-mono text-[11px] uppercase tracking-wide text-primary hover:underline">
        {t.common.backHome}
      </Link>
      <h1 className="mt-3 font-mono text-xl text-foreground">{t.citizen.report.title}</h1>
      <p className="mb-4 text-sm text-muted-foreground">{t.citizen.report.subtitle}</p>
      <Card className="p-4">
        <ReportForm defaultType={searchParams.type ?? "SECURITY"} />
      </Card>
    </div>
  );
}
