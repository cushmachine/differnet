"use client";

import { cn } from "@/lib/utils";
import type { WorkItem } from "@/types";

interface WorkInboxProps {
  items: WorkItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const urgencyIcon: Record<string, React.ReactNode> = {
  warning: <span className="text-amber-500 text-base">&#9888;</span>,
  info: <span className="text-blue-500 text-base">&#9432;</span>,
  none: null,
};

const statusColor: Record<string, string> = {
  "Ready for merge": "text-orange-600",
  "Needs review": "text-amber-600",
  "Waiting": "text-muted-foreground",
  "In progress": "text-blue-600",
  "Draft": "text-muted-foreground",
};

export function WorkInbox({ items, selectedId, onSelect }: WorkInboxProps) {
  // Fill 8 rows total (matching wireframe empty rows)
  const rows = 8;

  return (
    <div className="flex flex-col h-full border-r">
      {Array.from({ length: rows }).map((_, i) => {
        const item = items[i];
        if (!item) {
          return (
            <div key={`empty-${i}`} className="h-16 border-b" />
          );
        }
        const isSelected = item.id === selectedId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex items-start gap-3 px-3 py-3 text-left border-b transition-colors",
              isSelected ? "bg-muted" : "hover:bg-muted/50"
            )}
          >
            <span className="mt-0.5 text-muted-foreground shrink-0">
              {item.type === "taskmaster" ? "🤖" : "⚙️"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{item.agentName}</div>
              <div className="text-sm text-muted-foreground truncate">{item.subject}</div>
              <div className="flex items-center gap-2 mt-0.5">
                {urgencyIcon[item.urgency]}
                {item.context && (
                  <span className="text-xs text-primary">{item.context}</span>
                )}
                {item.status && (
                  <span className={cn("text-xs", statusColor[item.status] ?? "text-muted-foreground")}>
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
