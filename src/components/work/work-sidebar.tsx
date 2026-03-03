"use client";

import { Separator } from "@/components/ui/separator";
import type { RoadmapSection, WorkerStatus } from "@/types";

interface WorkSidebarProps {
  roadmap: RoadmapSection[];
  workers: WorkerStatus[];
}

export function WorkSidebar({ roadmap, workers }: WorkSidebarProps) {
  return (
    <div className="flex flex-col h-full border-l">
      {/* Roadmap */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Roadmap</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <button className="hover:text-foreground p-0.5 text-xs" title="Expand">⤢</button>
            <button className="hover:text-foreground p-0.5 text-xs" title="Focus">⇥</button>
          </div>
        </div>
        <div className="space-y-0.5">
          {roadmap.map((section) => (
            <div key={section.label}>
              <button className="flex w-full items-center gap-1 text-sm hover:text-foreground text-muted-foreground py-0.5">
                <span className="text-xs">›</span>
                <span>
                  {section.label} ({section.count})
                </span>
              </button>
              {section.items && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {section.items.map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.done}
                        className="rounded border-muted-foreground"
                      />
                      <span>{item.text}</span>
                      {item.tag && (
                        <span className="text-xs italic text-primary">
                          {item.tag}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          [Just md files on the backend in Context]
        </p>
      </div>

      <Separator />

      {/* Workers */}
      <div className="px-4 py-3 flex-1">
        <h3 className="text-sm font-semibold mb-2">Workers</h3>
        <div className="space-y-3">
          {workers.map((w) => (
            <div key={w.name}>
              <div className="text-sm font-medium">{w.name}</div>
              {w.status && (
                <div className="text-xs italic text-muted-foreground">
                  {w.status}
                </div>
              )}
              {w.detail && (
                <div className="text-xs italic text-primary">
                  {w.detail}
                </div>
              )}
              {w.historyLink && (
                <button className="text-xs text-muted-foreground hover:text-foreground mt-0.5">
                  [See history]
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
