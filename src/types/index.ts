export interface Project {
  id: string;
  name: string;
}

export type TriggerType = "User" | "Cron" | "Webhook";

export interface Routine {
  id: string;
  name: string;
  trigger: TriggerType;
  schedule?: string;
  lastRun: string;
  status: "Active" | "Paused" | "Draft";
}

export interface ContextFile {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: ContextFile[];
  content?: string;
}

export interface ContextCategory {
  id: string;
  name: string;
}

export interface StructuredItem {
  id: string;
  category: string;
  field: string;
  value: string;
  updatedAt: string;
}

export interface VaultService {
  id: string;
  name: string;
  project: string;
  apiKey: string;
  secret: string;
  workerPermissions: string[];
}

export interface DashboardMetric {
  id: string;
  title: string;
  value?: string;
  description?: string;
}

export interface AgentCost {
  model: string;
  tokens: string;
  cost: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "Online" | "Offline" | "Busy";
  costs: AgentCost[];
  server?: string;
  vaultAccess: string[];
}
