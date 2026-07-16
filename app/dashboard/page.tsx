import { DashboardClient } from "./DashboardClient";
import { getWorldCupMatches } from "@/lib/worldcup-data";

export default async function DashboardPage() {
  const matches = await getWorldCupMatches();
  return <DashboardClient matches={matches} />;
}
