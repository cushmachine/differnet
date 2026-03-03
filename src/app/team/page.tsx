"use client";

import { useState } from "react";
import { useProject } from "@/data/projects";
import { agents } from "@/data/team";
import { SplitPanel } from "@/components/layout/split-panel";
import { AgentList } from "@/components/team/agent-list";
import { AgentDetail } from "@/components/team/agent-detail";

export default function TeamPage() {
  const { activeProject } = useProject();
  const teamAgents = agents[activeProject] ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeAgent = teamAgents.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-3 border-b">
        <h1 className="text-lg font-semibold">Team</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <SplitPanel
          left={
            <AgentList
              agents={teamAgents}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          }
          right={<AgentDetail agent={activeAgent} />}
        />
      </div>
    </div>
  );
}
