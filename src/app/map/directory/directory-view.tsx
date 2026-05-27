"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditPrompt } from "@/components/layout/edit-prompt";
import type { DirectoryEntry } from "@/lib/readers";

export function DirectoryView({ entries }: { entries: DirectoryEntry[] }) {
  const [teamFilter, setTeamFilter] = useState<string>("all");

  const teams = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.teams.forEach((t) => set.add(t)));
    return ["all", ...Array.from(set).sort()];
  }, [entries]);

  const filtered = teamFilter === "all"
    ? entries
    : entries.filter((e) => e.teams.includes(teamFilter));

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">Directory</h2>
          <div className="flex gap-1">
            {teams.map((t) => (
              <button
                key={t}
                onClick={() => setTeamFilter(t)}
                className={cn(
                  "px-2 py-0.5 text-[11px] rounded transition-colors",
                  teamFilter === t
                    ? "bg-zinc-200 dark:bg-zinc-700 font-medium"
                    : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <EditPrompt commands={[{ label: "Add entry", command: "/integration-connector" }]} />
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">No entries yet.</p>
          <p className="text-xs text-muted-foreground mb-1">Paste into Claude Code:</p>
          <code className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
            Help me add my company&apos;s systems and vendors to the directory
          </code>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Used by skills</TableHead>
              <TableHead>Agent notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry) => (
              <TableRow key={entry.slug}>
                <TableCell>
                  <div className="font-medium">{entry.name}</div>
                  {entry.subname && (
                    <div className="text-[11px] text-muted-foreground">{entry.subname}</div>
                  )}
                  <code className="text-[10px] text-zinc-400">{entry.slug}</code>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {entry.teams.join(", ")}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {entry.referencedBySkills.length > 0
                    ? entry.referencedBySkills.join(", ")
                    : "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                  {entry.agent_notes ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
