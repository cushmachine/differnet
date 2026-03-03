"use client";

import { cn } from "@/lib/utils";
import type { ContextCategory } from "@/types";

interface CategoryListProps {
  categories: ContextCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CategoryList({ categories, selectedId, onSelect }: CategoryListProps) {
  return (
    <div className="p-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex w-full items-center px-3 py-2 text-sm text-left rounded-md transition-colors",
            selectedId === cat.id
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
