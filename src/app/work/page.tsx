"use client";

import { useProject } from "@/data/projects";

export default function WorkPage() {
  const { activeProject } = useProject();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center text-muted-foreground">
        <h2 className="text-lg font-medium mb-1">Work</h2>
        <p className="text-sm">
          Chat interface for {activeProject === "startups" ? "Startups" : "Collider"} — coming soon
        </p>
      </div>
    </div>
  );
}
