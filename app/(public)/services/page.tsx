import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedServices } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().publicPages.services.title };
}

export default async function ServicesPage() {
  const t = getDictionary();
  const services = await getPublishedServices();

  const categories = Array.from(
    services.reduce((map, service) => {
      const key = service.category ?? t.publicPages.services.other;
      map.set(key, [...(map.get(key) ?? []), service]);
      return map;
    }, new Map<string, typeof services>()),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title={t.publicPages.services.title}
        description={t.publicPages.services.subtitle}
      />

      {services.length === 0 ? (
        <EmptyState
          title={t.publicPages.services.empty}
          description={t.publicPages.services.emptyHint}
        />
      ) : (
        <div className="space-y-10">
          {categories.map(([category, items], index) => (
            <section key={category}>
              <h2 className="mb-4 font-mono text-sm uppercase tracking-wide text-primary">
                {category}
              </h2>
              <div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                data-tour={index === 0 ? "services-grid" : undefined}
              >
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
                        {t.publicPages.services.consult}
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
