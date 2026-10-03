import { TicketBoard } from "@/components/dev/TicketBoard";
import { SyncButton } from "@/components/dev/SyncButton";
import { Alert } from "@/components/ui/Alert";
import { requireDevPanel } from "@/lib/dev-access";
import { toTicketRow } from "@/lib/serialize";
import { getTickets, isWebcupConfigured, WEBCUP_API_URL } from "@/lib/tickets";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tickets — panneau dev" };

export default async function DevTicketsPage() {
  await requireDevPanel();

  const tickets = await getTickets();
  const configured = isWebcupConfigured();

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          DEV · WEBCUP CONSOLE
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-mono text-xl text-foreground">Tickets des besoins</h1>
            <p className="text-sm text-muted-foreground">
              Les besoins publiés par l'API Webcup, suivis comme des tickets de développement.
            </p>
          </div>
          <SyncButton configured={configured} />
        </div>
      </header>

      {!configured ? (
        <Alert tone="info" title="Synchronisation désactivée">
          <p>
            Renseignez <span className="font-mono">WEBCUP_API_KEY</span> dans votre <span className="font-mono">.env</span>{" "}
            pour importer les besoins depuis <span className="font-mono">{WEBCUP_API_URL}</span>. Les
            tickets affichés proviennent du jeu de démonstration.
          </p>
        </Alert>
      ) : null}

      <TicketBoard tickets={tickets.map(toTicketRow)} />
    </div>
  );
}
