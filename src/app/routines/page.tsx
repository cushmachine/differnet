import { readRoutines, readDaemonStatus, readActivity, readLastRunForRoutine } from "@/lib/readers";
import { RoutinesView } from "./routines-view";

export const dynamic = "force-dynamic";

export default async function RoutinesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const [routines, daemonStatus, activity] = await Promise.all([
    readRoutines(),
    readDaemonStatus(),
    readActivity(100),
  ]);

  const lastRuns: Record<string, string | null> = {};
  for (const routine of routines) {
    lastRuns[routine.slug] = await readLastRunForRoutine(routine.slug);
  }

  return (
    <RoutinesView
      routines={routines}
      daemonStatus={daemonStatus}
      activeTab={params.tab || "routines"}
      activity={activity}
      lastRuns={lastRuns}
    />
  );
}
