import { FeedRow, LiveBadge, SectionHeader } from "@/components/colony/FeedRow";
import { OrderStatusForm } from "@/components/colony/OrderStatusForm";
import { RadarCard } from "@/components/colony/RadarCard";
import { StatTile } from "@/components/colony/StatTile";
import { Card } from "@/components/ui/Card";
import { getOrders } from "@/lib/data";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Commerce & restauration" };

export default async function CommerceConsolePage() {
  await requirePageRole(["MERCHANT", "COUNCIL"]);
  const orders = await getOrders({ type: "FOOD" });

  const preparing = orders.filter((order) => ["CONFIRMED", "PREPARING"].includes(order.status));
  const ready = orders.filter((order) => order.status === "READY");
  const revenue = orders
    .filter((order) => order.status === "COMPLETED")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-5">
      <header>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            MERCATOR EXCHANGE · 47
          </p>
          <LiveBadge />
        </div>
        <h1 className="mt-1 font-mono text-xl text-foreground">Commandes & cantines</h1>
        <p className="text-sm text-muted-foreground">Préparation, prêt et retrait des repas de la colonie.</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="En préparation" value={preparing.length} hint="cuisine" tone="warning" />
        <StatTile label="Prêtes" value={ready.length} hint="au comptoir" tone="info" />
        <StatTile label="Recette" value={`${revenue}`} hint="crédits simulés" tone="success" />
      </div>

      <RadarCard
        label="Commons Kitchen · BioDôme 02"
        caption="Rayon de livraison actif"
        blips={[
          { x: 0.44, y: 0.44, tone: "warning" },
          { x: 0.6, y: 0.56, tone: "success" },
        ]}
      />

      <section>
        <SectionHeader title="File des commandes" badge={<LiveBadge label={`${orders.length}`} />} />
        {orders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aucune commande.
          </p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Card key={order.id} className="p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FeedRow
                    className="flex-1 border-0 bg-transparent p-0"
                    icon="🍜"
                    title={`${order.reference} · ${order.summary}`}
                    meta={[order.customer?.name ?? null, `${order.total} crédits`].filter(Boolean).join(" · ")}
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
