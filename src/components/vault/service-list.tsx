"use client";

import { cn } from "@/lib/utils";
import type { VaultService } from "@/types";

interface ServiceListProps {
  services: VaultService[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ServiceList({ services, selectedId, onSelect }: ServiceListProps) {
  return (
    <div className="p-3">
      {services.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={cn(
            "flex w-full items-center px-3 py-2 text-sm text-left rounded-md transition-colors",
            selectedId === s.id
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
