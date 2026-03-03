import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Agent } from "@/types";

const statusColor: Record<string, string> = {
  Online: "text-green-600",
  Offline: "text-gray-500",
  Busy: "text-amber-600",
};

interface AgentDetailProps {
  agent: Agent | null;
}

export function AgentDetail({ agent }: AgentDetailProps) {
  if (!agent) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Select an agent to view
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-base font-semibold">{agent.name}</h2>
        <span className={`text-sm ${statusColor[agent.status]}`}>
          {agent.status}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{agent.role}</p>
      <Separator className="mb-4" />

      {/* Costs table */}
      <h3 className="text-sm font-semibold mb-2">Costs (this month)</h3>
      <Table className="mb-6">
        <TableHeader>
          <TableRow className="bg-primary/10">
            <TableHead className="text-primary font-semibold">Model</TableHead>
            <TableHead className="text-primary font-semibold">Tokens</TableHead>
            <TableHead className="text-primary font-semibold">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agent.costs.map((c, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{c.model}</TableCell>
              <TableCell>{c.tokens}</TableCell>
              <TableCell>{c.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Server info */}
      {agent.server && (
        <>
          <h3 className="text-sm font-semibold mb-2">Server</h3>
          <p className="text-sm text-muted-foreground mb-4 font-mono">
            {agent.server}
          </p>
        </>
      )}

      {/* Vault access */}
      <h3 className="text-sm font-semibold mb-2">Vault Access</h3>
      <div className="flex flex-wrap gap-1.5">
        {agent.vaultAccess.map((v) => (
          <Badge key={v} variant="secondary" className="text-xs">
            {v}
          </Badge>
        ))}
      </div>
    </div>
  );
}
