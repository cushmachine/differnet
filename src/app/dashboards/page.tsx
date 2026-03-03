"use client";

import { useProject } from "@/data/projects";
import { dashboardMetrics } from "@/data/dashboards";
import { MetricCard } from "@/components/dashboards/metric-card";

export default function DashboardsPage() {
  const { activeProject } = useProject();
  const metrics = dashboardMetrics[activeProject] ?? [];

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Dashboards</h1>
      <div className="grid grid-cols-2 gap-4 max-w-3xl">
        {metrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>
    </div>
  );
}
