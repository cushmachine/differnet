"use client";

import { Button } from "@/components/ui/button";
import type { WorkItem } from "@/types";

interface WorkDetailProps {
  item: WorkItem | null;
}

export function WorkDetail({ item }: WorkDetailProps) {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Select a work item to view
      </div>
    );
  }

  const { detail } = item;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b">
        <span className="text-muted-foreground">
          {item.type === "taskmaster" ? "🤖" : "⚙️"}
        </span>
        <h2 className="text-sm font-semibold">{detail.heading}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-5 py-4 space-y-3">
        {detail.blocks.map((block, i) => (
          <p
            key={i}
            className={
              block.kind === "italic"
                ? "text-sm italic text-foreground/80"
                : "text-sm"
            }
          >
            {block.value}
          </p>
        ))}

        {detail.sendLabel && (
          <div className="flex items-center gap-3 pt-2">
            <Button size="sm">{detail.sendLabel}</Button>
            <span className="text-sm text-muted-foreground">
              Or type below for an alternative
            </span>
          </div>
        )}
      </div>

      {/* Reply input */}
      <div className="border-t px-5 py-3">
        <textarea
          placeholder="Your reply here..."
          className="w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          rows={2}
        />
      </div>
    </div>
  );
}
