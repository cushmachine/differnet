import type { Routine } from "@/types";

export const routines: Record<string, Routine[]> = {
  startups: [
    { id: "r1", name: "Daily deal-flow digest", trigger: "Cron", schedule: "Every day at 8am", lastRun: "2 hours ago", status: "Active" },
    { id: "r2", name: "Inbound LP screening", trigger: "Webhook", lastRun: "5 hours ago", status: "Active" },
    { id: "r3", name: "Portfolio company check-in", trigger: "Cron", schedule: "Mondays at 9am", lastRun: "3 days ago", status: "Active" },
    { id: "r4", name: "Generate weekly memo", trigger: "User", lastRun: "1 week ago", status: "Active" },
    { id: "r5", name: "Competitor scan", trigger: "Cron", schedule: "Every 6 hours", lastRun: "45 min ago", status: "Active" },
    { id: "r6", name: "Update CRM from emails", trigger: "Webhook", lastRun: "1 hour ago", status: "Paused" },
  ],
  collider: [
    { id: "r10", name: "Run experiment pipeline", trigger: "User", lastRun: "30 min ago", status: "Active" },
    { id: "r11", name: "Data quality check", trigger: "Cron", schedule: "Hourly", lastRun: "15 min ago", status: "Active" },
    { id: "r12", name: "Publish results report", trigger: "User", lastRun: "1 day ago", status: "Draft" },
    { id: "r13", name: "Sync detector readings", trigger: "Webhook", lastRun: "5 min ago", status: "Active" },
    { id: "r14", name: "Alert on anomalies", trigger: "Cron", schedule: "Every 5 min", lastRun: "5 min ago", status: "Active" },
  ],
};
