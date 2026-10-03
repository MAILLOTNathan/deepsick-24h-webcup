import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services municipaux" };

export default async function ServicesPage() {
  const services = await getPublishedServices();

  const categories = Array.from(
    services.reduce((map, service) => {
      const key = service.category ?? "Autres services";
      map.set(key, [...(map.get(key) ?? []), service]);
      return map;
    }, new Map<string, typeof services>()),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Services municipaux"
        description="Retrouvez l'ensemble des services proposés par la ville de Nova Terra et accédez directement aux informations utiles."
      />

      {services.length === 0 ? (
        <EmptyState
          title="Aucun service publié pour le moment"
          description="Les services municipaux seront publiés prochainement."
        />
      ) : (
        <div className="space-y-10">
          {categories.map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-4 font-mono text-sm uppercase tracking-wide text-primary">
                {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((service) => (
                  <Link key={service.id} href={`/services/${service.slug}`} className="group">
                    <Card className="h-full transition group-hover:border-primary/50">
                      <div className="flex items-center gap-2">
                        <span aria-hidden>{service.icon ?? "🏛️"}</span>
                        <h3 className="font-mono text-sm text-foreground">{service.name}</h3>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      <p className="mt-4 font-mono text-xs uppercase tracking-wide text-primary opacity-0 transition group-hover:opacity-100">
                        Consulter →
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

