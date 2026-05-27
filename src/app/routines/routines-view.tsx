"use client";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleRoutineStatus, toggleDaemon } from "./actions";
import { EditPrompt } from "@/components/layout/edit-prompt";
import type { RoutineMeta, DaemonStatus, ActivityEntry } from "@/types";
import { useState } from "react";

const statusDot: Record<string, string> = {
  active: "bg-emerald-400",
  paused: "bg-yellow-400",
  draft: "bg-zinc-300",
};

const daemonDot: Record<string, string> = {
  green: "bg-emerald-400",
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  grey: "bg-zinc-400",
  purple: "bg-violet-400",
};

const activityStatusDot: Record<string, string> = {
  success: "bg-emerald-400",
  failure: "bg-red-400",
  skipped: "bg-yellow-400",
  crashed: "bg-zinc-400",
  running: "bg-blue-400",
};

function cronToLabel(cronExpr: string): string {
  try {
    const parts = cronExpr.trim().split(/\s+/);
    if (parts.length !== 5) return cronExpr;
    const [minute, hour, , , dayOfWeek] = parts;

    if (minute.startsWith("*/") && hour === "*") return `Every ${minute.slice(2)} min`;
    if (hour.startsWith("*/") && minute === "0") return `Every ${hour.slice(2)} hr`;
    if (hour === "*" || minute === "*") return cronExpr;

    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    if (isNaN(h) || isNaN(m)) return cronExpr;
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const time = m === 0 ? `${h12}:00 ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (dayOfWeek === "*") return `Daily at ${time}`;
    if (dayOfWeek === "1-5") return `Weekdays at ${time}`;
    const dayList = dayOfWeek.split(",").map((d) => days[parseInt(d, 10)] ?? d);
    if (dayList.length === 1) return `${dayList[0]} at ${time}`;
    return `${dayList.join(", ")} at ${time}`;
  } catch {
    return cronExpr;
  }
}

const tabs = [
  { id: "routines", label: "Routines" },
  { id: "activity", label: "Activity" },
];

function ToggleSwitch({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        active ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
          active ? "translate-x-[18px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}

export function RoutinesView({
  routines,
  daemonStatus,
  activeTab,
  activity,
  lastRuns,
}: {
  routines: RoutineMeta[];
  daemonStatus: DaemonStatus;
  activeTab: string;
  activity: ActivityEntry[];
  lastRuns: Record<string, string | null>;
}) {
  const [daemonLoading, setDaemonLoading] = useState(false);
  const [daemonError, setDaemonError] = useState<string | null>(null);

  const handleDaemonToggle = async () => {
    setDaemonLoading(true);
    setDaemonError(null);
    try {
      const result = await toggleDaemon();
      if (result?.error) setDaemonError(result.error);
    } catch (err) {
      setDaemonError("Failed to toggle daemon");
    }
    setDaemonLoading(false);
  };

  const isRunning = daemonStatus.color === "green" || daemonStatus.color === "yellow";

  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-1">
        <h1 className="text-lg font-semibold">Routines</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className={cn("h-2 w-2 rounded-full", daemonDot[daemonStatus.color])} />
          Daemon: {daemonStatus.label}
          {daemonStatus.lastHeartbeat && (
            <span>· Last sweep: {daemonStatus.lastHeartbeat}</span>
          )}
          <button
            onClick={handleDaemonToggle}
            disabled={daemonLoading || daemonStatus.color === "purple"}
            className={cn(
              "ml-1 px-2 py-0.5 rounded border text-xs transition-colors",
              daemonLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            {daemonLoading ? "..." : isRunning ? "Stop" : "Start"}
          </button>
        </div>
      </div>

      {daemonError && (
        <div className="text-xs text-red-500 mb-2 md:text-right">{daemonError}</div>
      )}

      <div className="mb-4">
        <EditPrompt commands={[
          { label: "New report", command: "/report-builder" },
          { label: "New alert", command: "/alert-configurator" },
        ]} />
      </div>

      <div className="flex gap-1 mb-4">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`/routines?tab=${tab.id}`}
            className={cn(
              "px-2.5 py-1 text-xs rounded transition-colors",
              activeTab === tab.id
                ? "bg-zinc-100 font-medium dark:bg-zinc-800"
                : "text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900"
            )}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {daemonStatus.color === "grey" && (
        <div className="border rounded-md px-4 py-3 mb-4 bg-zinc-50 dark:bg-zinc-900">
          <p className="text-sm text-muted-foreground">
            Daemon not running — routines won&apos;t execute on schedule. Click &quot;Start&quot; above or run:
          </p>
          <code className="text-xs mt-1 block px-2 py-1 bg-white dark:bg-zinc-800 rounded border">
            npx differnet daemon start
          </code>
        </div>
      )}

      {activeTab === "routines" ? (
        routines.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">No routines configured yet.</p>
            <p className="text-xs text-muted-foreground mb-1">Paste into Claude Code:</p>
            <code className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
              Help me set up a weekly summary routine
            </code>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead className="w-20">Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routines.map((routine) => (
                    <TableRow key={routine.slug}>
                      <TableCell>
                        <span className={cn("inline-block h-2 w-2 rounded-full", statusDot[routine.status] ?? "bg-zinc-300")} />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{routine.name}</div>
                        {routine.description && (
                          <div className="text-xs text-muted-foreground">{routine.description}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {cronToLabel(routine.schedule)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {routine.skills.join(", ")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {lastRuns[routine.slug] ?? "—"}
                      </TableCell>
                      <TableCell>
                        <ToggleSwitch
                          active={routine.status === "active"}
                          onToggle={() => toggleRoutineStatus(routine.slug)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-2">
              {routines.map((routine) => (
                <div key={routine.slug} className="border rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", statusDot[routine.status] ?? "bg-zinc-300")} />
                      <span className="font-medium text-sm">{routine.name}</span>
                    </div>
                    <ToggleSwitch
                      active={routine.status === "active"}
                      onToggle={() => toggleRoutineStatus(routine.slug)}
                    />
                  </div>
                  {routine.description && (
                    <p className="text-xs text-muted-foreground">{routine.description}</p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{cronToLabel(routine.schedule)}</span>
                    <span>Skills: {routine.skills.join(", ")}</span>
                    <span>Last: {lastRuns[routine.slug] ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      ) : (
        activity.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">No activity recorded yet.</p>
            <p className="text-xs text-muted-foreground">
              Run history will appear here once the daemon is executing routines.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activity.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <span className={cn("inline-block h-2 w-2 rounded-full", activityStatusDot[entry.status] ?? "bg-zinc-300")} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {entry.timestamp}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {entry.type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="text-sm">{entry.actor}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-2">
              {activity.map((entry) => (
                <div key={entry.id} className="border rounded-md p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", activityStatusDot[entry.status] ?? "bg-zinc-300")} />
                      <span className="text-sm font-medium">{entry.actor}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{entry.type.replace(/_/g, " ")}</div>
                  <div className="text-sm text-muted-foreground">{entry.description}</div>
                </div>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}
