import { AgentRequestsTable } from "@/components/agent/AgentRequestsTable";
import { getStaffRequests } from "@/lib/data";
import { requirePageRole } from "@/lib/permissions";
import { toRequestRow } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const metadata = { title: "Demandes des habitants" };

export default async function AgentRequestsPage() {
  await requirePageRole(["AGENT", "ADMIN"]);
  const requests = await getStaffRequests();

  return (
    <div>
      <div className="mb-6 border-b border-border pb-5">
        <h1 className="font-mono text-2xl text-foreground">Demandes des habitants</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Identifiez l'état de chaque demande et distinguez rapidement celles qui nécessitent encore
          une action.
        </p>
      </div>

      <AgentRequestsTable initialRequests={requests.map(toRequestRow)} />
    </div>
  );
}
