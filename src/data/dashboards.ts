import type { DashboardMetric } from "@/types";

export const dashboardMetrics: Record<string, DashboardMetric[]> = {
  startups: [
    { id: "d1", title: "Deals Reviewed", value: "142", description: "This month" },
    { id: "d2", title: "Active DD", value: "7", description: "In progress" },
    { id: "d3", title: "Agent Spend", value: "$2,847", description: "MTD API costs" },
    { id: "d4", title: "LP Updates Sent", value: "23", description: "This quarter" },
  ],
  collider: [
    { id: "d10", title: "Experiments Run", value: "1,204", description: "This month" },
    { id: "d11", title: "Data Processed", value: "48.7 TB", description: "Last 30 days" },
    { id: "d12", title: "Agent Spend", value: "$12,340", description: "MTD compute costs" },
    { id: "d13", title: "Anomalies Flagged", value: "18", description: "Pending review" },
  ],
};
