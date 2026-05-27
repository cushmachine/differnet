import { readRoutines, readDaemonStatus } from "@/lib/readers";
import { RoutinesView } from "./routines-view";

export const dynamic = "force-dynamic";

export default async function RoutinesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const [routines, daemonStatus] = await Promise.all([
    readRoutines(),
    readDaemonStatus(),
  ]);

  return (
    <RoutinesView
      routines={routines}
      daemonStatus={daemonStatus}
      activeTab={params.tab || "routines"}
    />
  );
}
