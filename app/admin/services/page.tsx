import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Button } from "@/components/ui/Button";
import { deleteServiceAction } from "@/lib/actions/admin";
import { getAllServices } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gérer les services" };

export default async function AdminServicesPage() {
  await requirePageRole(["ADMIN"]);
  const services = await getAllServices();

  return (
    <div>
      <PageHeader
        title="Services municipaux"
        description="Ajoutez ou retirez les services présentés aux habitants."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
        <Card>
          <h2 className="mb-4 font-mono text-sm uppercase tracking-wide text-foreground">
            Nouveau service
          </h2>
          <ServiceForm />
        </Card>

        <section>
          <h2 className="mb-4 font-mono text-sm uppercase tracking-wide text-foreground">
            Services existants ({services.length})
          </h2>

          {services.length === 0 ? (
            <EmptyState title="Aucun service" description="Créez le premier service municipal." />
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <Card key={service.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span aria-hidden>{service.icon ?? "🏛️"}</span>
                        <h3 className="font-mono text-sm text-foreground">{service.name}</h3>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        /{service.slug} · {formatDate(service.createdAt)}
                      </p>
                    </div>
                    <form action={deleteServiceAction} className="shrink-0">
                      <input type="hidden" name="id" value={service.id} />
                      <Button type="submit" variant="danger" size="sm">
                        Supprimer
                      </Button>
                    </form>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
