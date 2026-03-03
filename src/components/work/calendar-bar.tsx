"use client";

import type { CalendarEvent } from "@/types";

interface CalendarBarProps {
  events: CalendarEvent[];
}

const SLOTS = 8;

export function CalendarBar({ events }: CalendarBarProps) {
  return (
    <div className="border-t px-4 py-2">
      <div className="text-xs font-semibold mb-1.5">Today&apos;s calendar</div>
      <div className="relative grid gap-px" style={{ gridTemplateColumns: `repeat(${SLOTS}, 1fr)` }}>
        {/* Background slots */}
        {Array.from({ length: SLOTS }).map((_, i) => (
          <div key={i} className="h-10 rounded border border-transparent" />
        ))}

        {/* Events positioned on the grid */}
        {events.map((ev) => (
          <div
            key={ev.id}
            className="absolute top-0 h-10 flex items-center justify-center rounded border bg-muted text-xs font-medium px-2 text-center"
            style={{
              left: `${(ev.startSlot / SLOTS) * 100}%`,
              width: `${(ev.span / SLOTS) * 100}%`,
            }}
          >
            <div>
              <div>{ev.title}</div>
              {ev.tag && (
                <div className="text-[10px] text-muted-foreground">[{ev.tag}]</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
