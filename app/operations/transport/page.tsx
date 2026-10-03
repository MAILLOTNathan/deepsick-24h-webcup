import type { Metadata } from "next";

import { FeedRow, LiveBadge, SectionHeader } from "@/components/colony/FeedRow";
import { OrderStatusForm } from "@/components/colony/OrderStatusForm";
import { RadarCard } from "@/components/colony/RadarCard";
import { StatTile } from "@/components/colony/StatTile";
import { Card } from "@/components/ui/Card";
import { getOrders } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/server";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().ops.transport.title };
}

export default async function TransportConsolePage() {
  const t = getDictionary();
  await requirePageRole(["DRIVER", "COUNCIL"]);
  const orders = await getOrders({ type: "TAXI" });

  const active = orders.filter((order) => ["CONFIRMED", "IN_TRANSIT"].includes(order.status));
  const pending = orders.filter((order) => order.status === "PENDING");
  const done = orders.filter((order) => order.status === "COMPLETED");

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            HERMES MOBILITY NET · 42 online
          </p>
          <LiveBadge />
        </div>
        <h1 className="mt-1 font-mono text-xl text-foreground">{t.ops.transport.title}</h1>
        <p className="text-sm text-muted-foreground">{t.ops.transport.subtitle}</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatTile
          label={t.ops.transport.waiting}
          value={pending.length}
          hint={t.ops.transport.waitingHint}
          tone="warning"
        />
        <StatTile
          label={t.ops.transport.running}
          value={active.length}
          hint={t.ops.transport.runningHint}
          tone="info"
        />
        <StatTile
          label={t.ops.transport.completed}
          value={done.length}
          hint={t.ops.transport.thisCycle}
          tone="success"
        />
      </div>

      <RadarCard
        label={t.ops.transport.radarLabel}
        caption={t.ops.transport.radarCaption}
        locked
        blips={[
          { x: 0.4, y: 0.5, tone: "warning" },
          { x: 0.66, y: 0.36, tone: "info" },
        ]}
      />

      <section>
        <SectionHeader title={t.ops.transport.queue} badge={<LiveBadge label={`${orders.length}`} />} />
        {orders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {t.ops.transport.empty}
          </p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Card key={order.id} className="p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FeedRow
                    className="flex-1 border-0 bg-transparent p-0"
                    icon="🚡"
                    title={`${order.reference} · ${order.summary}`}
                    meta={[
                      order.customer?.name ?? null,
                      order.etaMinutes ? `ETA ${order.etaMinutes} min` : null,
                      `${order.total} ${t.citizen.wallet.credits}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                  <OrderStatusForm orderId={order.id} status={order.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
