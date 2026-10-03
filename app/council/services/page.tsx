import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { ServiceForm } from "@/components/colony/ServiceForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteServiceAction } from "@/lib/actions/admin";
import { getAllServices } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services de la colonie" };

export default async function CouncilServicesPage() {
  await requirePageRole(["COUNCIL"]);
  const services = await getAllServices();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-mono text-xl text-foreground">Services de la colonie</h1>
        <p className="text-sm text-muted-foreground">
          Gérez les services présentés aux colons dans le réseau civique.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr,1.3fr]">
        <Card className="p-4">
          <SectionHeader title="Nouveau service" />
          <ServiceForm />
        </Card>

        <section>
          <SectionHeader
            title="Services existants"
            badge={<span className="font-mono text-[11px] text-muted-foreground">{services.length}</span>}
          />
          <div className="space-y-2">
            {services.map((service) => (
              <Card key={service.id} className="p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FeedRow
                    className="flex-1 border-0 bg-transparent p-0"
                    icon={service.icon ?? "🏛️"}
                    title={service.name}
                    meta={`/${service.slug} · ${formatDate(service.createdAt)}`}
                  />
                  <form action={deleteServiceAction}>
                    <input type="hidden" name="id" value={service.id} />
                    <Button type="submit" variant="danger" size="sm">
                      Supprimer
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
