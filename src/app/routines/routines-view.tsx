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
import { toggleRoutineStatus } from "./actions";
import { EditPrompt } from "@/components/layout/edit-prompt";
import type { RoutineMeta, DaemonStatus } from "@/types";

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

const tabs = [
  { id: "routines", label: "Routines" },
  { id: "activity", label: "Activity" },
];

export function RoutinesView({
  routines,
  daemonStatus,
  activeTab,
}: {
  routines: RoutineMeta[];
  daemonStatus: DaemonStatus;
  activeTab: string;
}) {
  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold">Routines</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("h-2 w-2 rounded-full", daemonDot[daemonStatus.color])} />
          Daemon: {daemonStatus.label}
          {daemonStatus.lastHeartbeat && (
            <span>· Last sweep: {daemonStatus.lastHeartbeat.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

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
            Daemon not installed — routines won&apos;t run on schedule. Paste into Claude Code:
          </p>
          <code className="text-xs mt-1 block px-2 py-1 bg-white dark:bg-zinc-800 rounded border">
            Help me install the differnet daemon so my routines run automatically
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
                  <TableCell className="text-muted-foreground">{routine.schedule}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {routine.skills.join(", ")}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    —
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleRoutineStatus(routine.slug)}
                      className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                        routine.status === "active" ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                          routine.status === "active" ? "translate-x-[18px]" : "translate-x-[3px]"
                        )}
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      ) : (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">No activity recorded yet.</p>
          <p className="text-xs text-muted-foreground">
            Run history will appear here once the daemon is executing routines.
          </p>
        </div>
      )}
    </div>
  );
}
