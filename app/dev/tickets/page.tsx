import type { Metadata } from "next";

import { TicketBoard } from "@/components/dev/TicketBoard";
import { SyncButton } from "@/components/dev/SyncButton";
import { Alert } from "@/components/ui/Alert";
import { requireDevPanel } from "@/lib/dev-access";
import { format, getDictionary } from "@/lib/i18n/server";
import { toTicketRow } from "@/lib/serialize";
import { getTickets, isWebcupConfigured, WEBCUP_API_URL } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: getDictionary().dev.page.title };
}

export default async function DevTicketsPage() {
  const t = getDictionary();
  await requireDevPanel();

  const tickets = await getTickets();
  const configured = isWebcupConfigured();

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {t.dev.page.eyebrow}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-mono text-xl text-foreground">{t.dev.page.title}</h1>
            <p className="text-sm text-muted-foreground">{t.dev.page.subtitle}</p>
          </div>
          <SyncButton configured={configured} />
        </div>
      </header>

      {!configured ? (
        <Alert tone="info" title={t.dev.page.notConfiguredTitle}>
          <p>{format(t.dev.page.notConfigured, { url: WEBCUP_API_URL })}</p>
        </Alert>
      ) : null}

      <TicketBoard tickets={tickets.map(toTicketRow)} />
    </div>
  );
}
