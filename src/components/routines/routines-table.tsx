"use client";

import { useProject } from "@/data/projects";
import { routines } from "@/data/routines";
import { TriggerBadge } from "./trigger-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RoutinesTable() {
  const { activeProject } = useProject();
  const data = routines[activeProject] ?? [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Routines</h1>
        <Button size="sm">New routine</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>
                <TriggerBadge trigger={r.trigger} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {r.schedule ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {r.lastRun}
              </TableCell>
              <TableCell>
                <span
                  className={
                    r.status === "Active"
                      ? "text-green-600"
                      : r.status === "Paused"
                        ? "text-amber-600"
                        : "text-muted-foreground"
                  }
                >
                  {r.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
