"use client";

import { useState } from "react";
import { useProject } from "@/data/projects";
import { workItems, roadmap, workers, calendarEvents } from "@/data/work";
import { WorkInbox } from "@/components/work/work-inbox";
import { WorkDetail } from "@/components/work/work-detail";
import { WorkSidebar } from "@/components/work/work-sidebar";
import { CalendarBar } from "@/components/work/calendar-bar";

export default function WorkPage() {
  const { activeProject } = useProject();
  const items = workItems[activeProject] ?? [];
  const rm = roadmap[activeProject] ?? [];
  const wk = workers[activeProject] ?? [];
  const cal = calendarEvents[activeProject] ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);

  const activeItem = items.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="flex h-full flex-col">
      {/* Three-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Inbox */}
        <div className="w-[280px] shrink-0 overflow-auto">
          <WorkInbox items={items} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Center: Detail */}
        <div className="flex-1 min-w-0 border-r">
          <WorkDetail item={activeItem} />
        </div>

        {/* Right: Sidebar */}
        <div className="w-[260px] shrink-0 overflow-auto">
          <WorkSidebar roadmap={rm} workers={wk} />
        </div>
      </div>

      {/* Bottom: Calendar */}
      <CalendarBar events={cal} />
    </div>
  );
}
