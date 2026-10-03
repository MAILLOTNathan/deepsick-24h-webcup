import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { RequestForm } from "@/components/forms/RequestForm";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nouvelle demande" };

export default async function NewRequestPage() {
  await requirePageRole(["CITIZEN"]);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/demandes" className="text-sm text-mars hover:underline">
        ← Mes demandes
      </Link>

      <div className="mt-4">
        <PageHeader
          title="Nouvelle demande"
          description="Décrivez votre besoin : votre demande sera transmise aux agents municipaux et vous pourrez suivre son avancement."
        />
      </div>

      <Card>
        <RequestForm />
      </Card>
    </div>
  );
}
