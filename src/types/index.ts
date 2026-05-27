export interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  owner: string;
  visibility: string[];
  managed: boolean;
  created: string;
  modified: string;
  triggers: SkillTrigger[];
  secrets: string[];
}

export interface SkillTrigger {
  schedule?: string;
  event?: string;
}

export interface SkillDetail extends SkillMeta {
  content: string;
}

export type { AppSettings } from "@/lib/readers";

export type DaemonStatusColor = "green" | "yellow" | "orange" | "grey" | "purple";

export interface DaemonStatus {
  color: DaemonStatusColor;
  lastHeartbeat: Date | null;
  label: string;
}

export interface RoutineMeta {
  slug: string;
  name: string;
  description: string;
  schedule: string;
  status: "active" | "paused" | "draft";
  skills: string[];
  created: string;
  modified: string;
}

export interface ActivityEntry {
  id: number;
  timestamp: string;
  type: "routine_run" | "skill_invocation" | "memory_update" | "map_change";
  actor: string;
  description: string;
  status: "success" | "failure";
}

export interface VaultIntegration {
  name: string;
  slug: string;
  auth_secret: string;
  base_url?: string;
  health_endpoint?: string;
  teams: string[];
  owner?: string;
  status: "connected" | "disconnected" | "error" | "unconfigured";
  last_checked?: string;
}

export type InboxStatus = "unread" | "read" | "archived";

export interface InboxMessage {
  slug: string;
  status: InboxStatus;
  created: string;
  subject: string;
  body: string;
}

export interface MemoryPage {
  slug: string;
  name: string;
  type: string;
  lastSynthesized: string | null;
  compiledTruth: string;
  timelineCount: number;
}
