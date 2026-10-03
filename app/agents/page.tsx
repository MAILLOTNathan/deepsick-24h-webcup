import { AgentDashboard } from "@/components/agent/AgentDashboard";
import { getActivityFeed, getPlatformStats } from "@/lib/data";
import { requirePageRole } from "@/lib/permissions";
import { toActivityDto } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const metadata = { title: "Espace agents" };

export default async function AgentHomePage() {
  await requirePageRole(["AGENT", "ADMIN"]);

  const [stats, activity] = await Promise.all([getPlatformStats(), getActivityFeed()]);

  return <AgentDashboard initialStats={stats} initialActivity={toActivityDto(activity)} />;
}
