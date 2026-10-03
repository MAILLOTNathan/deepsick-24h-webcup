import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { OrderForm } from "@/components/colony/OrderForm";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { getOrders } from "@/lib/data";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes commandes" };

export default async function CitizenOrdersPage({
  searchParams,
}: {
  searchParams: { cree?: string; type?: string };
}) {
  const session = await requirePageRole(["CITIZEN"]);
  const orders = await getOrders({ customerId: session.user.id });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-mono text-xl text-foreground">Commandes</h1>
        <p className="text-sm text-muted-foreground">
          Mobilisez un rover Hermes ou commandez auprès de Mercator Exchange.
        </p>
      </header>

      {searchParams.cree === "1" ? (
        <Alert tone="success">Commande enregistrée. Vous serez notifié à chaque étape.</Alert>
      ) : null}

      <Card className="p-4">
        <SectionHeader title="Nouvelle commande" />
        <OrderForm defaultType={searchParams.type === "FOOD" ? "FOOD" : "TAXI"} />
      </Card>

      <section>
        <SectionHeader
          title="Historique"
          badge={<span className="font-mono text-[11px] text-muted-foreground">{orders.length}</span>}
        />
        {orders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aucune commande.
          </p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <FeedRow
                key={order.id}
                icon={order.type === "TAXI" ? "🚡" : "🍜"}
                title={`${order.reference} · ${order.summary}`}
                meta={[
                  order.etaMinutes ? `ETA ${order.etaMinutes} min` : null,
                  `${order.total} crédits`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
                trailing={<OrderStatusBadge status={order.status} />}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
