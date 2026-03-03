"use client";

import { cn } from "@/lib/utils";
import type { Agent } from "@/types";

const statusDot: Record<string, string> = {
  Online: "bg-green-500",
  Offline: "bg-gray-400",
  Busy: "bg-amber-500",
};

interface AgentListProps {
  agents: Agent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AgentList({ agents, selectedId, onSelect }: AgentListProps) {
  return (
    <div className="p-3">
      {agents.map((a) => (
        <button
          key={a.id}
          onClick={() => onSelect(a.id)}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-sm text-left rounded-md transition-colors",
            selectedId === a.id
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <span className={cn("h-2 w-2 rounded-full shrink-0", statusDot[a.status])} />
          <span className="truncate">{a.name}</span>
        </button>
      ))}
    </div>
  );
}
