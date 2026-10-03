import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { StatTile } from "@/components/colony/StatTile";
import { Card } from "@/components/ui/Card";
import { getWallet } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Portefeuille" };

export default async function CitizenWalletPage() {
  const session = await requirePageRole(["CITIZEN"]);
  const { balance, transactions } = await getWallet(session.user.id);

  const credited = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const debited = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-mono text-xl text-foreground">Portefeuille civique</h1>
        <p className="text-sm text-muted-foreground">Crédits fictifs de démonstration — aucun paiement réel.</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Solde" value={balance} hint="crédits" tone="primary" />
        <StatTile label="Crédité" value={`+${credited}`} hint="ce cycle" tone="success" />
        <StatTile label="Débité" value={`-${debited}`} hint="ce cycle" tone="danger" />
      </div>

      <Card className="p-4">
        <SectionHeader title="Transactions" />
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune transaction.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <FeedRow
                key={transaction.id}
                title={transaction.label}
                meta={formatDate(transaction.createdAt)}
                trailing={
                  <span
                    className="font-mono text-sm"
                    style={{ color: transaction.amount < 0 ? "var(--destructive)" : "var(--chart-3)" }}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </span>
                }
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
