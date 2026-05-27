import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import type {
  SkillMeta,
  SkillDetail,
  DaemonStatus,
  RoutineMeta,
  ActivityEntry,
  VaultIntegration,
  MemoryPage,
  InboxMessage,
} from "@/types";

const ROOT = process.env.DIFFERNET_ROOT || process.cwd();

function toStr(val: unknown, includeTime = false): string {
  if (val instanceof Date) {
    return includeTime
      ? val.toISOString().replace("T", " ").slice(0, 16)
      : val.toISOString().split("T")[0];
  }
  return String(val ?? "");
}

function resolve(...parts: string[]) {
  return path.join(ROOT, ...parts);
}



async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// --- Skills ---

export async function readSkills(): Promise<SkillMeta[]> {
  const skillsDir = resolve(".claude", "skills");
  if (!(await exists(skillsDir))) return [];

  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const skills: SkillMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, "skill.md");
    if (!(await exists(skillFile))) continue;

    const raw = await fs.readFile(skillFile, "utf-8");
    const { data } = matter(raw);

    skills.push({
      slug: entry.name,
      name: data.name ?? entry.name,
      description: data.description ?? "",
      owner: data.owner ?? "unknown",
      managed: data.managed === true,
      visibility: data.visibility ?? [data.team ?? "all"],
      created: toStr(data.created),
      modified: toStr(data.modified),


      triggers: data.triggers ?? [],
      secrets: data.secrets ?? [],
    });
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export async function readSkill(slug: string): Promise<SkillDetail | null> {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) return null;
  const skillFile = resolve(".claude", "skills", slug, "skill.md");
  if (!(await exists(skillFile))) return null;

  const raw = await fs.readFile(skillFile, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    name: data.name ?? slug,
    description: data.description ?? "",
    owner: data.owner ?? "unknown",
    visibility: data.visibility ?? [data.team ?? "all"],
    managed: data.managed === true,
    created: toStr(data.created),
    modified: toStr(data.modified),
    triggers: data.triggers ?? [],
    secrets: data.secrets ?? [],
    content,
  };
}

// --- Map ---

export async function readMapFile(name: string): Promise<Record<string, unknown>> {
  const filePath = resolve("map", `${name}.yml`);
  if (!(await exists(filePath))) return {};

  const raw = await fs.readFile(filePath, "utf-8");
  return (yaml.load(raw) as Record<string, unknown>) ?? {};
}

export interface DirectoryEntry {
  slug: string;
  name: string;
  subname?: string;
  teams: string[];
  agent_notes?: string;
  referencedBySkills: string[];
}

export interface DirectoryConnection {
  from: string;
  to: string;
  description: string;
  bidirectional: boolean;
}

export async function readDirectory(): Promise<{
  entries: DirectoryEntry[];
  connections: DirectoryConnection[];
}> {
  const data = await readMapFile("directory");
  const rawEntries = (data.entries as Record<string, unknown>[]) ?? [];
  const rawConns = (data.connections as Record<string, unknown>[]) ?? [];

  const skillRefs = await getSkillReferences();

  const entries = rawEntries.map((e) => {
    const name = (e.name as string) ?? "";
    const nameLower = name.toLowerCase();
    const slug = (e.slug as string) ?? "";
    return {
      slug,
      name,
      subname: e.subname as string | undefined,
      teams: (e.teams as string[]) ?? [],
      agent_notes: e.agent_notes as string | undefined,
      referencedBySkills: skillRefs.filter(
        (ref) => ref.mentionsLower.includes(nameLower) || ref.mentionsLower.includes(slug)
      ).map((ref) => ref.name),
    };
  });

  const connections = rawConns.map((c) => ({
    from: (c.from as string) ?? "",
    to: (c.to as string) ?? "",
    description: (c.description as string) ?? "",
    bidirectional: (c.bidirectional as boolean) ?? false,
  }));

  return { entries, connections };
}

async function getSkillReferences(): Promise<{ name: string; mentionsLower: string }[]> {
  const skillsDir = resolve(".claude", "skills");
  if (!(await exists(skillsDir))) return [];

  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const refs: { name: string; mentionsLower: string }[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, "skill.md");
    if (!(await exists(skillFile))) continue;
    const raw = await fs.readFile(skillFile, "utf-8");
    const { data, content } = matter(raw);
    refs.push({
      name: (data.name as string) ?? entry.name,
      mentionsLower: content.toLowerCase(),
    });
  }

  return refs;
}

// --- Settings ---

export interface AppSettings {
  user: { name: string; teams: string[] };
  hidden_pages: string[];
}

export async function readSettings(): Promise<AppSettings> {
  const filePath = resolve("settings.yml");
  if (!(await exists(filePath))) return { user: { name: "", teams: [] }, hidden_pages: [] };

  const raw = await fs.readFile(filePath, "utf-8");
  const data = (yaml.load(raw) as Record<string, unknown>) ?? {};
  const user = (data.user as Record<string, unknown>) ?? {};
  return {
    user: {
      name: (user.name as string) ?? "",
      teams: (user.teams as string[]) ?? [],
    },
    hidden_pages: (data.hidden_pages as string[]) ?? [],
  };
}

// --- RACI ---

export interface RaciDecision {
  name: string;
  description?: string;
  responsible: string;
  accountable: string;
  consulted: string[];
  informed: string[];
}

export async function readRaci(): Promise<RaciDecision[]> {
  const data = await readMapFile("raci");
  const decisions = (data.decisions as Record<string, unknown>[]) ?? [];
  return decisions.map((d) => ({
    name: (d.name as string) ?? "",
    description: d.description as string | undefined,
    responsible: (d.responsible as string) ?? "",
    accountable: (d.accountable as string) ?? "",
    consulted: (d.consulted as string[]) ?? [],
    informed: (d.informed as string[]) ?? [],
  }));
}

// --- Routines ---

export async function readRoutines(): Promise<RoutineMeta[]> {
  const routinesDir = resolve("routines");
  if (!(await exists(routinesDir))) return [];

  const entries = await fs.readdir(routinesDir);
  const routines: RoutineMeta[] = [];

  for (const filename of entries) {
    if (!filename.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(routinesDir, filename), "utf-8");
    const { data } = matter(raw);

    routines.push({
      slug: filename.replace(".md", ""),
      name: data.name ?? filename.replace(".md", ""),
      description: data.description ?? "",
      schedule: data.schedule ?? "",
      status: data.status ?? "draft",
      skills: data.skills ?? [],
      created: data.created ?? "",
      modified: data.modified ?? "",
    });
  }

  return routines;
}

// --- Daemon Status ---

export async function readDaemonStatus(): Promise<DaemonStatus> {
  const heartbeatPath = resolve("data", ".heartbeat");

  if (!(await exists(heartbeatPath))) {
    // Distinguish "never run" from "stopped" by checking if the DB exists
    const dbExists = await exists(resolve("data", "differnet.db"));
    const label = dbExists ? "Stopped" : "Not installed";
    return { color: "grey", lastHeartbeat: null, label };
  }

  const stat = await fs.stat(heartbeatPath);
  const ageMs = Date.now() - stat.mtimeMs;

  const timeStr = stat.mtime.toLocaleTimeString();

  if (ageMs < 90_000) {
    return { color: "green", lastHeartbeat: timeStr, label: "Running" };
  }
  if (ageMs < 300_000) {
    return { color: "yellow", lastHeartbeat: timeStr, label: "Slow" };
  }
  if (ageMs < 600_000) {
    return { color: "orange", lastHeartbeat: timeStr, label: "Stale" };
  }
  return { color: "orange", lastHeartbeat: timeStr, label: "Unresponsive" };
}

// --- Activity ---

export async function readActivity(limit = 50): Promise<ActivityEntry[]> {
  const dbPath = resolve("data", "differnet.db");
  if (!(await exists(dbPath))) return [];

  try {
    const Database = (await import("better-sqlite3")).default;
    const db = new Database(dbPath, { readonly: true, fileMustExist: true });
    const rows = db
      .prepare(
        "SELECT id, timestamp, type, actor, description, status, duration_ms FROM activity ORDER BY timestamp DESC LIMIT ?"
      )
      .all(limit) as ActivityEntry[];
    db.close();
    return rows;
  } catch {
    return [];
  }
}

export async function readLastRunForRoutine(slug: string): Promise<string | null> {
  const dbPath = resolve("data", "differnet.db");
  if (!(await exists(dbPath))) return null;

  try {
    const Database = (await import("better-sqlite3")).default;
    const db = new Database(dbPath, { readonly: true, fileMustExist: true });
    const row = db
      .prepare(
        "SELECT timestamp FROM activity WHERE actor = ? AND type = 'routine_run' ORDER BY timestamp DESC LIMIT 1"
      )
      .get(slug) as { timestamp: string } | undefined;
    db.close();
    return row?.timestamp ?? null;
  } catch {
    return null;
  }
}

// --- Vault ---

export async function readVaultIntegrations(): Promise<VaultIntegration[]> {
  const intDir = resolve("vault", "integrations");
  if (!(await exists(intDir))) return [];

  const entries = await fs.readdir(intDir);
  const integrations: VaultIntegration[] = [];

  for (const filename of entries) {
    if (!filename.endsWith(".yml")) continue;
    const raw = await fs.readFile(path.join(intDir, filename), "utf-8");
    const data = yaml.load(raw) as Record<string, unknown>;

    integrations.push({
      name: (data.name as string) ?? filename.replace(".yml", ""),
      slug: filename.replace(".yml", ""),
      auth_secret: (data.auth_secret as string) ?? "",
      base_url: data.base_url as string | undefined,
      health_endpoint: data.health_endpoint as string | undefined,
      teams: (data.teams as string[]) ?? [],
      owner: data.owner as string | undefined,
      status: (data.status as VaultIntegration["status"]) ?? "unconfigured",
      last_checked: data.last_checked as string | undefined,
    });
  }

  return integrations;
}

// --- Inbox ---

export async function readInbox(): Promise<InboxMessage[]> {
  const inboxDir = resolve("inbox");
  if (!(await exists(inboxDir))) return [];

  const entries = await fs.readdir(inboxDir);
  const messages: InboxMessage[] = [];

  for (const filename of entries) {
    if (!filename.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(inboxDir, filename), "utf-8");
    const { data, content } = matter(raw);

    messages.push({
      slug: filename.replace(".md", ""),
      status: (data.status as InboxMessage["status"]) ?? "unread",
      created: toStr(data.created, true),
      subject: (data.subject as string) ?? filename.replace(".md", "").replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/-/g, " "),
      body: content.trim(),
    });
  }

  return messages.sort((a, b) => b.created.localeCompare(a.created));
}

// --- Memory ---

export async function readMemoryPages(): Promise<MemoryPage[]> {
  const memDir = resolve("memory");
  if (!(await exists(memDir))) return [];

  const pages: MemoryPage[] = [];

  async function scanDir(dir: string, prefix: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        await scanDir(path.join(dir, entry.name), `${prefix}${entry.name}/`);
      } else if (entry.name.endsWith(".md")) {
        const raw = await fs.readFile(path.join(dir, entry.name), "utf-8");
        const { data, content } = matter(raw);

        const parts = content.split(/\n---\n/);
        const compiledTruth = parts[0]?.trim() ?? "";
        const timeline = parts[1] ?? "";
        const timelineCount = (timeline.match(/^- \*\*/gm) || []).length;

        pages.push({
          slug: `${prefix}${entry.name.replace(".md", "")}`,
          name: data.name ?? entry.name.replace(".md", ""),
          type: data.type ?? "concept",
          lastSynthesized: data.last_synthesized ?? null,
          compiledTruth,
          timelineCount,
        });
      }
    }
  }

  await scanDir(memDir, "");
  return pages;
}
