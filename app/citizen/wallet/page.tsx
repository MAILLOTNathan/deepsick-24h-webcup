import type { Metadata } from "next";

import { FeedRow, SectionHeader } from "@/components/colony/FeedRow";
import { StatTile } from "@/components/colony/StatTile";
import { Card } from "@/components/ui/Card";
import { getWallet } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().citizen.wallet.title };
}

export default async function CitizenWalletPage() {
  const t = getDictionary();
  const session = await requirePageRole(["CITIZEN"]);
  const { balance, transactions } = await getWallet(session.user.id);

  const credited = transactions.filter((tx) => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const debited = transactions.filter((tx) => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-mono text-xl text-foreground">{t.citizen.wallet.title}</h1>
        <p className="text-sm text-muted-foreground">{t.citizen.wallet.subtitle}</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatTile
          label={t.citizen.wallet.balance}
          value={balance}
          hint={t.citizen.wallet.credits}
          tone="primary"
        />
        <StatTile
          label={t.citizen.wallet.credited}
          value={`+${credited}`}
          hint={t.citizen.wallet.thisCycle}
          tone="success"
        />
        <StatTile
          label={t.citizen.wallet.debited}
          value={`-${debited}`}
          hint={t.citizen.wallet.thisCycle}
          tone="danger"
        />
      </div>

      <Card className="p-4">
        <SectionHeader title={t.citizen.wallet.transactions} />
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.citizen.wallet.empty}</p>
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
