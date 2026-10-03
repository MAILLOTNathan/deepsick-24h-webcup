"use client";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/client";
import type { MapService } from "@/lib/map-layout";

export function ServiceList({ services }: { services: MapService[] }) {
  const t = useT();

  const categories = Array.from(
    services.reduce((map, service) => {
      const key = service.category ?? t.publicPages.services.other;
      map.set(key, [...(map.get(key) ?? []), service]);
      return map;
    }, new Map<string, MapService[]>()),
  );

  return (
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
                    {t.publicPages.services.consult}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
