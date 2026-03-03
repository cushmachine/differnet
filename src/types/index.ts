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

// Work page types

export type WorkItemType = "taskmaster" | "worker";
export type WorkItemUrgency = "warning" | "info" | "none";
export type WorkItemStatus = "Ready for merge" | "Needs review" | "Waiting" | "In progress" | "Draft";

export interface WorkItem {
  id: string;
  agentName: string;
  type: WorkItemType;
  subject: string;
  context?: string;
  urgency: WorkItemUrgency;
  status?: WorkItemStatus;
  detail: WorkItemDetail;
}

export interface WorkItemDetail {
  heading: string;
  blocks: ContentBlock[];
  draftResponse?: string;
  sendLabel?: string;
}

export type ContentBlock =
  | { kind: "text"; value: string }
  | { kind: "italic"; value: string };

export interface RoadmapSection {
  label: string;
  count: number;
  items?: { text: string; done: boolean; tag?: string }[];
}

export interface WorkerStatus {
  name: string;
  status: string;
  detail?: string;
  historyLink?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  tag?: string;
  startSlot: number; // 0-based slot on the timeline
  span: number;      // how many slots wide
}
