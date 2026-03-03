"use client";

import { useState } from "react";
import { useProject } from "@/data/projects";
import { vaultServices } from "@/data/vault";
import { SplitPanel } from "@/components/layout/split-panel";
import { ServiceList } from "@/components/vault/service-list";
import { ServiceDetail } from "@/components/vault/service-detail";

export default function VaultPage() {
  const { activeProject } = useProject();
  const services = vaultServices[activeProject] ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeService = services.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-3 border-b">
        <h1 className="text-lg font-semibold">Services</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <SplitPanel
          left={
            <ServiceList
              services={services}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          }
          right={<ServiceDetail service={activeService} />}
        />
      </div>
    </div>
  );
}
