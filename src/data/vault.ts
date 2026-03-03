import type { VaultService } from "@/types";

export const vaultServices: Record<string, VaultService[]> = {
  startups: [
    { id: "v1", name: "OpenAI", project: "Startups Fund III", apiKey: "sk-proj-****…8f3a", secret: "••••••••••••", workerPermissions: ["Deal Analyst", "Memo Writer"] },
    { id: "v2", name: "Anthropic", project: "Startups Fund III", apiKey: "sk-ant-****…c2d1", secret: "••••••••••••", workerPermissions: ["Deal Analyst", "LP Reporter"] },
    { id: "v3", name: "Pinecone", project: "Startups Fund III", apiKey: "pc-****…9e7b", secret: "••••••••••••", workerPermissions: ["Deal Analyst"] },
    { id: "v4", name: "SendGrid", project: "Startups Fund III", apiKey: "SG.****…4a2c", secret: "••••••••••••", workerPermissions: ["LP Reporter", "Outreach Agent"] },
    { id: "v5", name: "Airtable", project: "Startups Fund III", apiKey: "pat****…1b8e", secret: "••••••••••••", workerPermissions: ["CRM Sync"] },
  ],
  collider: [
    { id: "v10", name: "AWS S3", project: "Collider Ops", apiKey: "AKIA****…7F2Q", secret: "••••••••••••", workerPermissions: ["Data Pipeline", "Archiver"] },
    { id: "v11", name: "Anthropic", project: "Collider Ops", apiKey: "sk-ant-****…e9f3", secret: "••••••••••••", workerPermissions: ["Analysis Agent"] },
    { id: "v12", name: "Grafana", project: "Collider Ops", apiKey: "glsa_****…3d1a", secret: "••••••••••••", workerPermissions: ["Monitor Agent"] },
    { id: "v13", name: "Slack", project: "Collider Ops", apiKey: "xoxb-****…8c4e", secret: "••••••••••••", workerPermissions: ["Alert Agent", "Report Agent"] },
  ],
};
